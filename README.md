# Snackdown

Ein Browser-Spiel im Stil von agar.io. Man läuft als kleine Pixel-Figur durch eine Cartoon-Welt, isst Snacks, steigt im Level auf und besiegt andere in Tippduellen.

Der Name ist noch ein Arbeitstitel.

## Spielen

Öffne `index.html` im Browser. Es gibt keinen Build-Schritt und keine Abhängigkeiten, alles steckt in dieser einen Datei. Vorerst nur am PC, weil die Duelle eine Tastatur brauchen.

- **Maus:** Die Figur läuft zum Mauszeiger.
- **Shift:** Sprint, solange die Ausdauer reicht.
- **Leertaste:** Dash mit Slide, die schnellste Bewegung, mit Abklingzeit.
- **E:** Item benutzen (Geschenkboxen einsammeln).
- **1 / 2 / 3:** Perk beim Level-Up wählen.
- **Berühren:** Ein Tippduell startet. Wer die kurze englische Phrase schneller richtig tippt, gewinnt und bekommt alle Level des Gegners.

## Stand

Prototyp v2: Solo gegen 60 Bots auf einer großen Karte mit Minimap, 30 betretbare Gebäude mit je mehreren markierten Eingängen in 5 Typen (Haus, Diner, Bäckerei, Fitnessstudio, Schuppen), zufällig gemischte Charaktere, Level-Looks von 1 bis 100, kurze Tippduelle mit Animationen, Sprint, Dash mit Slide und Essanimation mit Bissen. Es gibt keine Level-Grenze: Rang-Looks bis Level 300, Perk-Bäume bei Level-Ups, Items, einen König mit Kopfgeld und Level-Orbs. Alle Sounds sind erzeugt, oben links lässt sich der Ton abschalten. Multiplayer kommt später.

Die Spielidee und alle bisherigen Entscheidungen stehen in [docs/konzept.md](docs/konzept.md).
