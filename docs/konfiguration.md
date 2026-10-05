# Einstellungen ändern (`site/config.js`)

Alles, was man am Spiel verstellen kann, steht in **einer** Textdatei: [`site/config.js`](../site/config.js). Zahl ändern, speichern, Spiel neu laden. Es muss nichts gebaut werden.

Die Datei ist auf Englisch kommentiert (jede Zeile sagt, was die Zahl macht). Diese Seite erklärt das Drumherum auf Deutsch.

## So änderst du etwas

**Auf der Webseite (typebite.io)**
1. Auf GitHub das Repo öffnen, Ordner `site`, Datei `config.js`.
2. Den Stift (Edit) anklicken, Zahl ändern, unten **Commit changes** (direkt auf `main`).
3. Cloudflare veröffentlicht automatisch, nach etwa einer Minute nutzt die Seite die neuen Zahlen. Wer das Spiel offen hat, muss neu laden (F5).

**Lokal auf dem eigenen PC (heruntergeladene `index.html`)**
Die Datei `config.js` in denselben Ordner wie `index.html` legen. Sie überschreibt die Zahlen, die in `index.html` eingebaut sind. Löscht man sie wieder, gelten die eingebauten Zahlen.

**Eigener Server (`start-server.bat` / `node server/server.js`)**
Der Server liest automatisch `site/config.js` und gibt dieselbe Datei an alle Browser weiter, die sich verbinden. Eine andere Datei geht so: `SNACK_CONFIG=/pfad/zur/config.js node server/server.js`. Nach einer Änderung den Server neu starten.

**Wichtig zu wissen**
- In `index.html` steckt beim Bauen (`python3 tools/build.py`) eine Kopie von `config.js`. Das ist der Rückfall, falls die Datei nicht geladen werden kann (offline, andere Seite). Wer nur `index.html` herunterlädt und nicht `config.js`, spielt mit dem Stand vom letzten Build.
- **Alle in einem Mehrspieler-Spiel müssen dieselben Einstellungen haben.** Der Host und die, die beitreten, vergleichen einen Fingerabdruck. Weicht er ab, kommt „different game settings“ und man tritt nicht bei. Auf der Webseite passiert das nur kurz nach einer Änderung, bis alle neu geladen haben.
- Im Browser-Mehrspieler zählen die Zahlen des Hosts für die Spielregeln (er führt die Welt aus). Der Vergleich beim Beitreten sorgt nur dafür, dass Anzeigen, Anleitung und Host zusammenpassen.

## Fehler in der Datei

Das Spiel prüft die Datei beim Start. Probleme zeigt eine **orange Leiste** oben im Spiel, zum Beispiel:
- „unknown setting …“ (Tippfehler im Namen, die Zeile wird ignoriert)
- „… must be a number“ (Text statt Zahl; für diese eine Einstellung gilt der eingebaute Wert)
- „the file has a mistake: …“ (Syntaxfehler, meistens ein vergessenes Komma oder eine fehlende Klammer; dann gelten alle eingebauten Zahlen)

Regeln: Jede Zeile endet mit einem Komma. Klammern `{ }` und `[ ]` nicht löschen. Kommazahlen mit Punkt (`0.5`, nicht `0,5`). Alles hinter `//` ist Kommentar. Im Fehlerbericht („Report a problem“, F8) steht in der Zeile `Settings:` der Fingerabdruck der Einstellungen und, falls es welche gab, wie viele Hinweise.

## Was steht wo

| Abschnitt | Inhalt |
|---|---|
| 1 `world` | Kartengröße, Anzahl Gebäude je Typ, Deko-Orte (Lager, Märkte, Teiche, …), Bäume/Felsen/Büsche |
| 2 `players` | Anzahl Bots, wie schnell sie nachkommen, Bot-Level/-Tippgeschwindigkeit/-Mut, Spieler pro Spiel, Startschutz |
| 3 `spawn` | wie viele Snacks und Geschenkboxen herumliegen und wie schnell Neue nachkommen, Heimat-Boni |
| 4 `rarity` | **Seltenheit**: Gewichte für Common / Rare / Epic / Legendary bei Boxen, Unterwasser-Boxen, Perk-Karten und Snacks |
| 5 `levels` | Level-Kosten, XP pro Snack, Essdauer, Perk-Rhythmus, Item-Slots (ab welchem Level), König |
| 6 `movement` | Lauf-/Sprint-/Dash-Tempo, Ausdauer, Schwimmen |
| 7 `duel` | Phrasenlänge, Level-Ausgleich, Beute, Orbs, Bot-Tippgeschwindigkeit, Zeitlimit |
| 8 `quests` | Wartezeiten, Aufgabenarten, Belohnungen |
| 9 `camera` | Start-Zoom und wie weit man herauszoomen kann |
| 10 `network` | Sichtradius, Updates pro Sekunde im Mehrspieler, nach wie vielen Sekunden Stille der nächste Host übernimmt (`hostSilence`), wie oft er eine Kopie des Spiels bekommt (`checkpointsPerSecond`), wann der Host das Spiel wegen schlechter Verbindung abgibt (`handover`) |
| `autoFps` | Automatische FPS-Begrenzung beim ersten Start: nach wie vielen Sekunden Spiel geschaut wird, bei welchem Durchschnitt, und worauf begrenzt wird |
| 11 `items` | alle 24 Items: Seltenheitsstufe, Gewicht, Dauer, Stapeln, Stärke |
| 12 `perks` | alle 38 Perks: Stufe, Gewicht, Ränge, Wert pro Rang |
| 13 `snacks` | alle 57 Snacks: Stufe, Gewicht, XP, Essdauer, Biome, Läden, Zusatzeffekt |

## Seltenheit

Eine Seltenheit besteht aus vier **Gewichten** in der Reihenfolge Common, Rare, Epic, Legendary. Sie müssen nicht 100 ergeben, das Spiel rechnet die Prozente selbst aus.

```js
giftBox: [75, 19.5, 5, 0.5],   // = 75 % / 19,5 % / 5 % / 0,5 %
```

Legendäre Items noch seltener: die letzte Zahl kleiner machen (`0.2`). Rares ganz abschalten: Gewicht auf `0`.

Zusätzlich hat **jedes einzelne** Item, jeder Perk und jeder Snack eine `tier` (0 Common, 1 Rare, 2 Epic, 3 Legendary) und ein `weight`:
- `tier` ändern verschiebt das Ding in eine andere Seltenheit. (Beispiel: Rush von Rare auf Epic: `tier: 2`.)
- `weight` bestimmt, wie oft es innerhalb *seiner* Seltenheit vorkommt. `1` = normal, `2` = doppelt so oft, `0.5` = halb so oft, `0` = kommt nie vor.

Beispiel: Schwarzes Loch soll doppelt so oft fallen wie die anderen Legendären: `blackhole: { tier: 3, weight: 2, … }`.

Perks haben zusätzlich die Regel, dass legendäre erst erscheinen, wenn man genug Punkte im selben Baum hat (`levels.capstoneNeedsPoints`).

## Items stapeln

Wer ein zeitlich begrenztes Item benutzt, während es noch läuft, bekommt es **gestapelt**. Bei jedem Item steht in der Datei, wie:

| `stack` | Wirkung | Beispiele |
|---|---|---|
| `'strength'` | Jede Benutzung hat ihren eigenen Timer, der Effekt wird mit jeder laufenden Kopie stärker. 2 × Sugar Rush = doppelte Wirkung. Höchstens `maxStacks` Kopien gleichzeitig. | Sugar Rush (x5), Magnet (x4), Turbo (x3), Rocket Boots (x3), Black Hole (x2) |
| `'time'` | Die Zeit wird oben drauf addiert (höchstens `maxStacks` mal die Dauer). | Rauchbombe, Bubble Shield, Radar, Gummiband, Freeze Ray, Time Warp |
| ohne `stack` | Sofort-Effekte (Bombe, Apfel, Kristall, …) wirken bei jeder Benutzung erneut; Clover addiert seine Boxen. | |

Im HUD steht bei laufenden gestapelten Effekten ein „×2“, „×3“ usw. Mit `items: { stacking: false, … }` ist das Stapeln für alle Items abgeschaltet (erneutes Benutzen startet nur den Timer neu).

Wie stark ein Stapel ist, steht je Item in der Zeile (zum Beispiel `rush: … eatTime: 0.35, xpBonus: 0.5`: pro Kopie isst man schneller und bekommt +50 % XP von Snacks).

## Kartengröße und Zahlen

`world.size` ist die Kantenlänge der Karte in Spieleinheiten (die Figur läuft rund 175 Einheiten pro Sekunde). Die Zahlen für Gebäude, Deko, Bäume, Snacks und Boxen sind für eine Karte mit 13600 geschrieben. Mit `scaleCounts: true` (Standard) werden sie automatisch mit `(size / 13600)²` umgerechnet, damit eine kleinere Karte nicht leerer oder voller wird. Mit `false` gelten die Zahlen genau wie geschrieben.

Die **Nachwuchs-Raten** (`snackRefillOutside`, `boxRefill…`, `botRespawn`) sind Stück pro Sekunde und werden nicht umgerechnet.

Wichtig für das Gefühl: Bei vielen Bots ist die Anzahl herumliegender Snacks fast nur von der Nachwuchs-Rate abhängig. Die Bots fressen alles schneller, als es nachkommt. `snacksOutside` ist dann nur der Anfangsvorrat. Wer mehr Snacks auf der Karte will, erhöht `snackRefillOutside`.

## Beispiele

- **Mehr los:** `players.bots` erhöhen (Obergrenze 1500) und `botRespawn` erhöhen. Mehr Bots kosten Rechenzeit: mit 240 Bots braucht ein Server-Schritt im Test rund 6 ms; wie es auf schwachen Geräten läuft, ist nicht getestet.
- **Kleinere Karte:** `world.size: 8000`.
- **Item abschalten:** bei `items.list` das `weight` auf `0` setzen.
- **Legendäre Items fast nie:** bei `rarity.giftBox` und `rarity.underwaterBox` die vierte Zahl auf `0.1`.
- **Große Lobbys:** `players.maxPerGame` (50), `network.bigLobbyFrom` / `updatesPerSecondBig` (ab so vielen Spielern weniger Updates pro Sekunde), `network.capStepMs` / `capBufferKB` (ab wann ein überlasteter Host niemanden mehr aufnimmt).
- **Tipp-Tempo-Grenze:** `duel.maxWpm` (230) - schneller getippter Text wird vom Server zurückgehalten und gemeldet; nur senken, wenn ein Tippprogramm auffällt.
- **Duelle kürzer:** `duel.baseWords` und `duel.maxWords` senken.
- **Schneller aufsteigen:** `levels.snackValue` erhöhen oder `levels.costGrowth` senken.
- **Mehr Item-Slots früher:** `levels.itemSlotLevels: [0, 0, 0, 5, 10, 20, 40]`.

## Was NICHT in der Datei steht

- Texte, Namen, Icons und Aussehen von Items, Perks und Snacks (stehen im Code, `game.html`).
- Freischaltlevel der Figuren-Looks und die Rang-Titel.
- Musik, Lautstärken, Tastenbelegung.
- Neue Items, Perks oder Snacks hinzufügen: das geht nicht über die Datei, weil jedes eine eigene Wirkung im Code braucht. Bestehende lassen sich komplett umstellen.

## Technik (für Entwickler)

- `window.TYPEBITE_CONFIG` in `site/config.js` ist der einzige Eintrag. `tools/build.py` bettet eine Kopie als `window.TYPEBITE_DEFAULTS` in `index.html` ein und lädt zur Laufzeit zusätzlich `config.js`.
- Das Spiel führt beides zusammen (`CFG`): fehlende Einstellungen kommen aus den eingebauten Zahlen, falsche Typen und unbekannte Namen erzeugen Hinweise (`CFGW`, orange Leiste).
- `CFGID` ist ein Hash über die zusammengeführten Einstellungen. Der Server schickt ihn im `welcome`, der Beitretende vergleicht (zusammen mit der `BUILD`-Nummer).
- Der Host-Worker bekommt die zusammengeführten Einstellungen mit in den Worker-Code, der Node-Server lädt die Datei in dieselbe Sandbox wie das Spiel.
- Namen, Icons und Beschreibungen kommen weiterhin aus `ITEM_DEF`, `PERK_DEF` und `FOOD_SRC` in `game.html`; nur die Zahlen kommen aus der Datei.
