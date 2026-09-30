# Spielkonzept (Arbeitstitel offen)

Stand: 30.09.2026

## Grundidee
- Browser-Spiel im Stil von agar.io, genauso simpel. Kein Account, einfach reinspringen.
- Spielfigur: simpler menschlicher Körper, cartoonish, nichts Brutales.
- Muss auf PC und Handy sehr intuitiv sein (Handy kommt später, siehe Runde 2).

## Entscheidungen (Runde 1, 30.09.2026)
- **Fortschritt:** Level 1 bis ca. 100. Die Figur wird nicht größer, sondern sieht cooler aus (mehr Muskeln, mehr Rüstung).
- **Essen/Trinken:** Items auf der Karte, eines bringt ca. 25 % eines Levels. Beim Essen/Trinken läuft eine Animation, in der man angreifbar ist.
- **Kampf:** 1v1-Duell. Wer schneller richtig tippt, gewinnt. Der Gewinner "isst" den Verlierer (cartoonish) und bekommt dessen Level. Ein höheres Level gibt einen Vorteil im Duell.
- **Steuerung:** PC mit der Maus (Handy mit Joystick, erst später). Dazu Sprint/Dash mit coolem Slide (Vorbild: Zelda-Ocarina-Dash, Slides aus Fighting Games). Die Bewegung soll sich abwechslungsreich und cool anfühlen.
- **Modus:** erst Solo gegen Bots, danach echter Multiplayer wie bei agar.io (ohne Account).
- **Ansicht:** von oben. Mit Innen- und Außenbereichen (Gebäude betretbar), wie bei Surviv.io bzw. ZombsRoyale.io.

## Entscheidungen (Runde 2, 30.09.2026)
- **Plattform:** vorerst NUR PC. Kein Handy-Build (Tippen am Handy wäre unfair).
- **Duell-Inhalt:** Man tippt ganze Sätze, wie bei Monkeytype. Es soll sich befriedigend anfühlen.
- **Duell-Start:** automatisch bei Berührung. Beide sind eingefroren und für andere geschützt.
- **Weglaufen:** ist immer möglich, hat aber einen Nachteil: Holt der Verfolger dich ein, hat er im Duell einen Vorteil (kürzerer Satz).
- **Verlierer:** zurück auf Level 1, sofortiger Neustart wie bei agar.io.
- **Level-Vorteil im Duell:** Das höhere Level bekommt einen kürzeren Satz. (Kein Fehlerbonus, kein Zeitvorsprung.)

## Entscheidungen (Runde 3, 30.09.2026)
- **Bewegung:** Leertaste = Dash mit Slide (schnellster Move, Cooldown). Shift = Sprint mit Ausdauer.
- **Stil:** Welt im flachen, bunten Cartoon-Look von oben. Spielfigur in Pixel-Art.
- **Sprache der Duell-Sätze:** immer Englisch.
- **Prototyp:** als spielbarer Link (Artifact), kein Repository.

## Geplanter Prototyp-Umfang
Solo gegen Bots, Essen mit Animation, Level mit sichtbarem Look-Wechsel, Tippduelle, Dash und ein betretbares Haus. Freigegeben am 30.09.2026, Arbeitstitel "Snackdown".

## Später klären
- Grafikstil im Detail, Name, Kartengröße, Spielerzahl pro Server.
## Prototyp v1 (30.09.2026)
- Link: https://claude.ai/artifact/Gv6VFDHPNfwc5d2xbJwQnE
- Quelle: /mnt/project-files/prototyp/snackdown.html
- Zahlen: 18 Bots, Karte 3200x3200 px, 8 Häuser. Snack = +0,25 Level, 0,85 s Essanimation. Dash 2,2 s Cooldown. Sprint x1,55 mit Ausdauer.
- Duell: Grundlänge 14 Wörter. Pro 3 Level Vorsprung 1 Wort weniger (max. 6). Wer eingeholt wurde: der Verfolger bekommt 4 Wörter weniger. Minimum 4 Wörter.
- Bot-Tippgeschwindigkeit: ca. 24 + 0,9 x Level WPM.
- Looks: Lv 10 Schulterpolster, 15 Muskeln, 25 Brustpanzer, 40 große Muskeln, 50 Helm, 70 Goldrüstung, 85 Umhang, 100 Krone.

## Entscheidungen (Runde 4, 30.09.2026)
- **Duell-Texte:** waren zu lang. Jetzt kurze Phrasen statt Sätze (Grundlänge 6 Wörter).
- **Fokus:** mehr Inhalt (Gebäude, Charaktere), mehr Detail in Bewegung, Dash, Slide und Essanimation, mehr Animationen überall. Handy bleibt vorerst draußen.

## Prototyp v2 (30.09.2026)
- Datei: `index.html` im Repository (das Artifact-Ziel aus Runde 3 gilt nicht mehr).
- **Duell:** Grundlänge 6 Wörter. Pro 3 Level Vorsprung 1 Wort weniger (max. 3). Wer eingeholt wurde: der Verfolger bekommt 2 Wörter weniger. Minimum 2 Wörter. Vorher: 14 / 6 / 4 / 4.
- **Gebäude:** 16 statt 8, in 5 Typen mit eigener Einrichtung und eigenem Boden: Haus (6), Diner (3), Bäckerei (2), Fitnessstudio (2), Schuppen (3). Diner und Bäckerei haben mehr Essen drin. Möbel stehen in den Ecken und sind fest, der Eingang bleibt frei. Ein Schild auf dem Dach zeigt, was drin ist.
- **Umgebung:** Bäume (blenden aus, wenn man darunter steht), Felsen, Büsche. Essen: 240 draußen, 110 drinnen.
- **Charaktere:** zufällig aus 6 Frisuren (kurz, lang, Stacheln, Glatze, Zopf, Haare), 5 Kopfaccessoires (Sonnenbrille, Cap, Mütze, Stirnband, keins), 3 Shirt-Stile (einfarbig, gestreift, Logo), lange oder kurze Hose. Die Level-Looks bleiben wie in v1.
- **Bewegung:** Squash-and-Stretch mit Feder, Schräglage in Laufrichtung, Staub bei Schritten im Sprint, Speedlines.
- **Dash:** Kauerpose, dann Streckung, Staubring, Speedlines, Nachbilder, kurzer Kamera-Zoom.
- **Slide:** nach dem Dash 0,6 s Gleiten mit wenig Reibung (lenkbar), Charakter duckt sich und lehnt sich, Bremsspuren und Staub am Boden.
- **Essen:** Snack wandert von der Hand zum Mund, 3 Bissen mit sichtbar fehlenden Stücken und Krümeln, Kauen, Getränke werden gekippt mit Bläschen. Ein Ring um die Figur zeigt, wie lange man noch angreifbar ist. Am Ende Sterne und "YUM!". Dauer weiter 0,85 s.
- **Duell-Animationen:** Aufeinandertreffen mit Blitz, Hitstop, Bildschirmwackeln und Ringen. Beide drehen sich zueinander, Kamera zoomt ein. Das Panel springt herein, VS knallt rein, 3-2-1 poppt. Richtige Buchstaben lassen die Figur pulsieren, Fehler wackeln den Bildschirm. Der Verlierer wird spiralförmig verschluckt, dazu "CHOMP!".

## Entscheidungen (Runde 5, 30.09.2026, Feedback nach dem ersten Spieltest)
- **Karte:** 7200x7200 statt 3200x3200, 30 Gebäude auf einem 6x6-Raster (6 Zellen bleiben frei), 420 Bäume, 130 Felsen. 60 Bots statt 18. Essen: 1100 draußen, 350 drinnen. Minimap unten rechts.
- **Eingänge:** Jedes Gebäude hat 3 Eingänge (Schuppen 2). Das Dach hat an den Türen Aussparungen, davor liegen gelbe Matten mit hüpfenden Pfeilen.
- **Leveln:** Ein Snack bringt 25 % / (1 + 0,08 x (Level - 1)). Level 1 braucht 4 Snacks, Level 10 etwa 7, Level 30 etwa 14, Level 50 etwa 20. Die Anzeige unten links zeigt "N snacks per level".
- **Level-Vorteil im Duell:** deutlich kleiner. 1 Wort weniger pro 6 Level Vorsprung (max. 2), vorher pro 3 Level (max. 3). Bot-Tippgeschwindigkeit ca. 28 + eigene Stärke (-8 bis +14) + 0,25 x Level WPM, vorher 24 + 0,9 x Level. Bot-gegen-Bot: 50 % +/- 12 % je nach Level. Start-Level der Bots max. ca. 22 statt 34. Der Sieger bekommt weiter alle Level des Verlierers.
- **Sound:** alles per WebAudio erzeugt, keine Dateien. Knuspern und Schlürfen beim Essen, "Yum"-Plink, Level-Up-Arpeggio, Dash-Whoosh mit Slide-Rauschen, Türklingel, Aufprall beim Duellstart, Countdown-Ticks, Tipp-Töne die mit der Serie höher werden, Fehler-Buzz, Chomp mit Jingle beim Sieg und "Wah wah" bei der Niederlage. Bots in der Nähe sind leiser zu hören. Umschalter "Sound on/off" oben links, gemerkt im Browser.
