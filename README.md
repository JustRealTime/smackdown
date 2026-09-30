# Snackdown

Ein Browser-Spiel im Stil von agar.io. Man läuft als kleine Pixel-Figur durch eine Cartoon-Welt, isst Snacks, steigt im Level auf und besiegt andere in Tippduellen.

Der Name ist noch ein Arbeitstitel.

## Spielen

Öffne `index.html` im Browser (eine einzelne Datei, mit Musik). Die Datei ist eigenständig, kein Ordner und keine Installation nötig. Vorerst nur am PC, weil die Duelle eine Tastatur brauchen.

- **Maus:** Die Figur läuft zum Mauszeiger.
- **Shift:** Sprint, solange die Ausdauer reicht.
- **Leertaste:** Dash mit Slide, die schnellste Bewegung, mit Abklingzeit.
- **E:** Item benutzen (Geschenkboxen einsammeln).
- **1 / 2 / 3:** Perk beim Level-Up wählen.
- **Berühren:** Ein Tippduell startet. Wer die englische Wörter-Phrase schneller richtig tippt, gewinnt. Je höher dein Level, desto länger deine Phrase. Der Sieger bekommt einen Teil der XP des Verlierers.

## Mit Freunden spielen (lokales Netz)

1. Auf dem Rechner, der als Host dient, [Node.js](https://nodejs.org) installieren (Version 18 oder neuer).
2. `start-server.bat` doppelklicken (Windows) oder `node server/server.js` (überall). Windows fragt eventuell nach der Firewall: erlauben.
3. Der Server zeigt die Adressen an, zum Beispiel `http://192.168.1.20:8080`. Du und deine Freunde öffnet diese Adresse im Browser (gleiches WLAN oder Tailscale) und klickt auf **Join**.
4. Die Bots bleiben, alle sehen dieselbe Karte, und ihr könnt euch gegenseitig duellieren.

Ohne Server bleibt **Play** der Einzelspielermodus gegen die Bots.

## Stand

Prototyp v3: Solo oder mit Freunden gegen 60 Bots auf einer großen Karte mit Minimap, 30 betretbare Gebäude mit je mehreren markierten Eingängen in 5 Typen (Haus, Diner, Bäckerei, Fitnessstudio, Schuppen), zufällig gemischte Charaktere, Level-Looks bis Level 1500, kurze Tippduelle mit Animationen, Sprint, Dash mit Slide und Essanimation mit Bissen. Es gibt keine Level-Grenze: Perk-Bäume bei Level-Ups, Items, einen König mit Kopfgeld und Level-Orbs. Effekte sind erzeugt, die Hintergrundmusik steckt in `index.html`. Oben links lassen sich Sound und Musik einzeln abschalten. Multiplayer im lokalen Netz gibt es (siehe oben).

Die Spielidee und alle bisherigen Entscheidungen stehen in [docs/konzept.md](docs/konzept.md).

## Entwickeln

Bearbeitet wird `game.html` (Musik liegt in `music/`). Danach `python3 tools/build.py` ausführen, das erzeugt `index.html`.
