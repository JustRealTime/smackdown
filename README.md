# Typebite

Ein Browser-Spiel im Stil von agar.io. Man läuft als kleine Pixel-Figur durch eine Cartoon-Welt, isst Snacks, steigt im Level auf und besiegt andere in Tippduellen.

Der Name Typebite ist gewählt (Domain typebite.io geplant). Vor einem kommerziellen Release Marke und Namensähnlichkeit prüfen: es gibt ähnlich klingende kleine Spiele (BiteType!, Type 'n' Bite).

## Spielen

Öffne `index.html` im Browser (eine einzelne Datei, mit Musik). Die Datei ist eigenständig, kein Ordner und keine Installation nötig. Vorerst nur am PC, weil die Duelle eine Tastatur brauchen.

- **Maus:** Die Figur läuft zum Mauszeiger.
- **Shift:** Sprint, solange die Ausdauer reicht.
- **Leertaste:** Dash mit Slide, die schnellste Bewegung, mit Abklingzeit.
- **Q / W / E:** Item in Slot 1, 2 oder 3 benutzen (bis zu 3 Items tragen).
- **Esc:** zurück ins Menü.
- **1 / 2 / 3:** Perk beim Level-Up wählen.
- **Berühren:** Ein Tippduell startet. Wer die englische Wörter-Phrase schneller richtig tippt, gewinnt. Je höher dein Level, desto länger deine Phrase. Der Sieger bekommt einen Teil der XP des Verlierers.

## Mit Freunden spielen (ohne Server-Datei)

Einfach `index.html` öffnen und **Play** drücken. Wer zuerst spielt, ist automatisch der Host (sein Browser-Tab führt das Spiel aus). Jeder, der danach das Spiel öffnet, sieht im Menü zum Beispiel „Alex is playing · Lv 4“ mit einem **Join**-Knopf und startet neben ihm. Das funktioniert über das Internet per WebRTC; ein kostenloser Vermittlungsdienst (PeerJS) stellt nur die Verbindung her. Für eine private Gruppe unter „Friends: room and server options“ einen gemeinsamen Raumnamen eintragen.

Wichtig: Der Host sollte den Tab offen lassen, sonst endet das Spiel für alle. Ohne Internet startet Play automatisch den Einzelspielermodus.

Optional gibt es weiterhin einen eigenen Server (`start-server.bat`, braucht [Node.js](https://nodejs.org) 18+), z. B. für LAN-Partys ohne Internet. Die Seite dieses Servers zeigt ebenfalls die Spielerliste.

## Spieltests und Fehler melden

Ablauf, Testaufgaben und Fragen stehen in [docs/spieltest.md](docs/spieltest.md). Bei Problemen im Spiel **F8** drücken (oder im Menü „Report a problem“): ein Fehlerbericht wird kopiert und kann in einen Chat eingefügt werden. Es wird nichts automatisch verschickt.

## Stand

Solo oder mit Freunden gegen bis zu 240 Bots auf einer Karte von 10000 x 10000 (einstellbar) mit 9 Biomen und Minimap, rund 50 betretbare Gebäude mit je mehreren markierten Eingängen in 16 Typen (Haus, Diner, Bäckerei, Fitnessstudio, Schuppen, Arcade, Scheune, Bibliothek, Gewächshaus, Café, Pizzeria, Schule, Klinik, Kino, Werkstatt, Eisdiele), 57 Snack-Arten, 24 Items, 38 Perks, Zeltlager, Märkte, schwimmbare Teiche, Felder und Parks, zufällig gemischte Charaktere, Level-Looks bis Level 1500, kurze Tippduelle mit Animationen, Sprint, Dash mit Slide und Essanimation mit Bissen. Es gibt keine Level-Grenze: Perk-Bäume bei Level-Ups, Items, einen König mit Kopfgeld und Level-Orbs. Effekte sind erzeugt, die Hintergrundmusik steckt in `index.html`. Oben links lassen sich Sound und Musik einzeln abschalten. Multiplayer im lokalen Netz gibt es (siehe oben).

Die Spielidee und alle bisherigen Entscheidungen stehen in [docs/konzept.md](docs/konzept.md).

## Einstellungen ändern

Alle Zahlen des Spiels (Kartengröße, Anzahl Bots, wie viel herumliegt, Seltenheit, Items, Perks, Snacks, Level, Duelle, ...) stehen als Klartext in [site/config.js](site/config.js). Zahl ändern, speichern, Spiel neu laden; gebaut werden muss nichts. Auf GitHub geht das direkt im Browser (Stift-Symbol), nach etwa einer Minute gilt es auf der Webseite. Die Anleitung steht in [docs/konfiguration.md](docs/konfiguration.md).

## Entwickeln

Bearbeitet wird `game.html` (Musik liegt in `music/`). Danach `python3 tools/build.py` ausführen, das erzeugt `index.html`.
