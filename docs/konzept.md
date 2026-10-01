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

## Entscheidungen (Runde 6, 30.09.2026): kein Ende bei Level 100
Problem: Bei Level 100 war alles freigeschaltet, dann gab es nichts mehr zu tun. agar.io und slither.io haben kein Ende. Beschlossen wurden alle 6 Vorschläge plus Level-Bäume nach dem Vorbild von Hades.
- **Unendliche Level:** Kein Cap mehr. Ein Snack bringt weiter weniger, je höher das Level. Neue Looks: 125 blaue Aura, 150 Flammen, 200 Flügel, 300 Regenbogen-Aura. Ränge: Rookie, Bronze (10), Silber (25), Gold (40), Platin (60), Diamant (80), Legende (100), Mythisch (150), Unsterblich (200), Godlike (300).
- **König:** Wer ab Level 8 die höchste Stufe hat, trägt eine Krone und steht auf der Minimap für alle als Stern. Bots jagen ihn gezielt (wenn sie mindestens 30 % seines Levels haben). Wer ihn besiegt, bekommt einen Kopfgeld-Bonus (+25 % seines Levels +3). Der König ist außerdem etwas langsamer (bis zu -15 % bei hohem Level).
- **Nicht mehr alles 1:1:** Der Sieger bekommt etwa die Hälfte der Level des Verlierers (Plunder-Perk erhöht das). Wer viel schwächere Gegner besiegt, bekommt noch weniger (Anti-Farming, bis auf 15 %). 60 % des Rests fallen als goldene Orbs auf den Boden und können von allen aufgesammelt werden.
- **Items:** Geschenkboxen auf der Karte (60 draußen, 45 in Gebäuden), ein Item pro Spieler, Taste E. Magnet (7 s), Turbo-Sneakers (7 s), Blasen-Schild (6 s), Zuckerschock (10 s, 3x schneller essen, +50 % Level), Rauchbombe (4 s unsichtbar für Bots, Dash lädt sich sofort auf), Pro-Tastatur (automatisch, nächste Duell-Phrase 2 Wörter kürzer). Bots nehmen und benutzen Items auch.
- **Level-Bäume:** Ein Perk bei Level 2, danach alle 3 Level. Drei Karten zur Auswahl (Tasten 1 2 3 oder Klick), das Spiel läuft weiter. Je mehr Punkte in einem Baum, desto öfter wird er angeboten. Nach 4 Punkten in einem Baum können legendäre Perks erscheinen. Bei Tod setzen sich die Perks zurück (die Level je nach Last Stand nicht).
  - **Feast:** Gourmet (+20 % Level aus Snacks), Quick Bite, Snack Vacuum, Jackpot, Treasure Nose (legendär).
  - **Sprint:** Swift Feet, Quick Dash, Big Lungs, Ice Slide, Double Dash (legendär).
  - **Typist:** Short Phrases, Autocorrect, Head Start, Plunder, Flow State (legendär).
  - **Guard:** Victory Shield, Slippery, Last Stand (behält 15 % der Level pro Rang beim Tod), Snack Guard, Iron Bubble (legendär).
  - **Mastery:** Füller, wenn alles ausgeschöpft ist.
- **Offen:** Balance aller Werte muss im Spiel getestet werden. Bots bekommen noch keine Perks.

## Entscheidungen (Runde 7, 30.09.2026)
- **Weglaufen sichtbarer:** Wer vor einem Verfolger flieht, trägt in der Welt das Label "RUNNING". Im Duell erscheint in der Vorphase ein großes Banner: grün "GOTCHA! You caught them running: 2 fewer words for you" für den Verfolger, rot "CAUGHT RUNNING! ... gets 2 fewer words" für den Erwischten. Der Perk Slippery wird im Banner erwähnt.
- **Vorphase im Duell:** 5,6 s statt 2,4 s. Erst 3,2 s "READY?" (Phrase schon lesbar, Banner und Hinweise), dann 3-2-1.
- **Neue Perks (12):** Snack Combo, Orb Hunter (Feast). Sprinter, Long Dash, Second Wind (Sprint). Curse, Underdog, King Hunter (Typist). Neuer fünfter Baum **Trick** (Items): Long Lasting, Recycler, Lucky Boxes, Item Fairy (legendär).
- **Musik:** 5 Songs im Ordner `music/`. Menü und Todesbildschirm: chill. Im Spiel abwechselnd happy und artilerja. Im Duell: omegalul (22 s, passt zur Duell-Länge, danach geht der Song im Spiel dort weiter, wo er war). Als König: africa. Jeder Song wird auf die gleiche Lautstärke angeglichen (gemessen), Wechsel per Fade, Musik wird bei großen Effekten (Level-Up, Chomp, Aufprall) kurz leiser. Knöpfe "Sound" und "Music" oben links. Wichtig: Der Ordner `music/` muss neben `index.html` liegen.
- **Essgeräusch:** Das Knuspern klang nicht gut. Jetzt weiche, blubbernde Plopps im Stil des Trinkgeräuschs, das gut ankam.

## Entscheidungen (Runde 8, 30.09.2026): Macht ist zu leicht zu halten
Feedback nach dem Spielen: Wer oben ist, verliert kaum noch. Level 1000 war schnell erreicht, dann kam lange nichts Neues. Duell zu voll. Musik spielte nicht (nur `index.html` heruntergeladen, `music/` fehlte).
- **Phrasenlänge steigt mit dem eigenen Level:** 3 Wörter + 1 pro 10 Level, maximal 20. Der Level-Vorteil im Duell ist umgekehrt: Wer oben steht, tippt viel mehr als sein Herausforderer. Der König verliert also oft. Die Perks (kürzere Phrase, Underdog, Curse, Tastatur-Items) wirken weiter darauf.
- **Nur Wörter:** Phrasen sind zufällige Wörter aus einer Liste mit 1240 Wörtern, alles klein, keine Satzzeichen, nichts Essen-bezogenes.
- **Härtere Wirtschaft:** Ein Snack bringt 0,2 / (1 + 0,1 x (Level - 1)) Level (Level 1: 5 Snacks, Level 50: 30, Level 100: 55, Level 500: 255). Ein Duellsieg bringt etwa 30 % (vorher 50 %) der Level des Verlierers und nie mehr als 25 % des eigenen Levels. Nur 40 % des Rests fallen als Orbs. Das Kopfgeld für den König ist 15 % seines Levels plus 3, höchstens 40. Perks kommen alle 4 Level statt alle 3. Bot-Tippgeschwindigkeit hängt kaum noch vom Level ab.
- **Perks:** Mastery entfernt. Ein voll ausgebauter Perk wird nie wieder angeboten. Gibt es nichts mehr zu wählen, wird das Level einfach ohne Auswahl übersprungen. 6 neue Perks: Cozy Eater, Adrenaline, Phase Dash (legendär), Warm Fingers, Pickpocket, Fortune. Zusammen 38.
- **Items:** 15 statt 6. Neu: Snack Bomb, Freeze Ray, Rocket Boots, Golden Ticket, Radar, Golden Keyboard (halbe Phrase, automatisch), Angel Feather (überlebt eine verlorene Runde mit halben Leveln, automatisch), Time Warp, Shockwave.
- **Duell-Anzeige entrümpelt:** Keine Chips mehr. Oben ein großes Banner mit dem Wichtigsten (Weglaufen-Meldung, sonst "YOU HAVE THE EDGE / THEY HAVE THE EDGE" mit den Wortzahlen), dann Namen mit Level und Wortzahl, Balken und die Phrase. Lange Phrasen brechen um und werden kleiner. Namensschilder der Kämpfer sind ausgeblendet.
- **Skins bis Level 1500:** Rüstungsmaterial wechselt (Eisen, Gold ab 70, Rubin 350, Saphir 500, Obsidian 750, Diamant 1000, Kosmisch 1500). Umhang violett ab 400, dunkel ab 750. Sterne-Spur 350, Heiligenschein 450, Blitze 600, kreisende Kugeln 800, Nebel-Aura und größere Flügel 1000. Neue Ränge Celestial, Cosmic, Eternal, Transcendent, Omnipotent.
- **Eine Datei zum Spielen:** `game.html` ist die Quelle, `python3 tools/build.py` baut daraus `index.html` mit eingebetteter Musik (2,4 MB, neu kodiert). `index.html` braucht keinen Ordner mehr.

## Entscheidungen (Runde 9, 30.09.2026)
- **Musik leiser und mehr davon:** Grundlautstärke etwa 4 dB leiser. 29 Songs aus den hochgeladenen Archiven nach Stimmung einsortiert (gemessen: Länge, Lautstärke, Tempo, Energie), jeweils zufällige Reihenfolge ohne direkte Wiederholung:
  - **Menü:** chillactually, minecraft, untitled, geige.
  - **Todesbildschirm:** sadmarioinb4, sadmariosda, dead_inside.
  - **Im Spiel (ruhig bis groovig):** happy, artilerja, bassline_besser, vass3_0, fonky, rat, guitar, whoinvitedthiskid, xd, master3_0, basslineloopkinda, sankokna.
  - **Duell (schnell, laut):** omegalul, chase_action, weirdaf, kindasentihard, lkfjslkfsjdlkfsdjlkfjdfrap, goofy, fh.
  - **König (episch):** africa, personaxmother, peronamorhwr.
  - **Nicht verwendet:** Songs mit derben Namen (ass, shit, shittyassmoan, electro cock), Songs mit sehr viel Stille (melanmon, foramira, chour) und Loops unter 15 s. Die langen Songs sind gekürzt (artilerja auf 3:10, die beiden Persona-Songs auf 2:50, mit Ausblenden). Alles ist auf 40 kbps mono kodiert, zusammen 7,8 MB.
- **Langsam ohne Grund:** Drei Ursachen behoben. Essen hat dich komplett angehalten (jetzt kriechst du mit 35 % Tempo weiter, bleibst aber angreifbar). Bots konnten Time Warp und Freeze Ray benutzen, ohne dass man es merkte (Bots benutzen diese zwei nicht mehr, und oben erscheint eine Anzeige "FROZEN", "SLOWED by ..." oder "eating: you move slowly"). Snack Vacuum und Magnet ließen dich ständig anhalten.
- **XP statt Level als Währung:** Ein Snack ist 1 XP. Level L kostet 5 x (1 + 0,15 x (L - 1)) XP (Level 1: 5 Snacks, Level 50: 42, Level 100: 79, Level 500: 379). Ein Duellsieg bringt etwa 25 % (bei viel schwächeren Gegnern weniger, bis 7,5 %) der XP, die der Verlierer insgesamt gesammelt hat, höchstens 8 Level des eigenen Levels, mindestens 2 Snacks. Weitere 20 % fallen als Orbs. Der Rest ist weg. Kopfgeld für den König: bis zu 12 % seiner XP. Ein gleich starker Sieg bei Level 20 bringt etwa 2,8 Level statt 6.
- **Multiplayer im lokalen Netz:** Ein kleiner Node-Server (`server/server.js`, ohne Pakete, `start-server.bat` unter Windows) führt die echten Spielregeln aus, mit allen Bots (60) plus den Menschen. Die Browser senden nur Eingaben (Maus-Richtung, Sprint, Dash, E, Tastendrücke im Duell) und zeigen den Zustand an. Alle sehen dieselbe Karte (gleicher Startwert), dieselben Bots, Items, Orbs und den König. Duelle gehen Mensch gegen Mensch und Mensch gegen Bot. Jeder Spieler hat eigene Perks und Angebote, eigenen Tod und Respawn. Friends öffnen `http://<IP des Hosts>:8080` (im selben WLAN oder über Tailscale). Ohne Server läuft das Spiel wie bisher allein gegen die Bots.
  - **Bewusst einfach:** Der Server vertraut dem, was der Browser über den Tipp-Fortschritt meldet (für Tests mit Freunden gedacht, nicht für ein öffentliches Spiel). Effekte anderer Spieler werden im Browser aus dem Zustand abgeleitet, einzelne Kleinigkeiten (z.B. Combo- und Jackpot-Hinweise) erscheinen nur solo.

## Entscheidungen (Runde 10, 30.09.2026)
- **"Auf der Flucht" nur noch echt:** Ein Spieler gilt nur als auf der Flucht vor jemandem, wenn er sich von ihm wegbewegt UND dieser jemand sich auf ihn zubewegt (Markierung hält 3 s statt 5 s). Wer einen stehenden oder wegrennenden Gegner verfolgt, dashed oder an ihm vorbeischießt, wird nicht mehr als Flüchtender gezählt. Das war die Ursache für "ich habe verfolgt, und das Spiel dachte, ich werde gejagt".
- **Phrasen fairer:** 3 Wörter + 1 pro 12 Level (vorher 10), höchstens 20. Zusätzlich tippt niemand weniger als die Hälfte der anderen Seite (6 gegen 2 wird zu 6 gegen 3).
- **Steuerung beim Essen:** Im Solo-Modus wurde die Eingabe beim Essen gar nicht gelesen, deshalb war man zwar langsam, aber nicht steuerbar. Jetzt kann man beim Essen mit 35 % Tempo in jede Richtung laufen (Sprint und Dash gehen dabei nicht).
- **Mehr Gebäude:** 5 neue Typen mit Einrichtung und Dach-Symbol: Arcade (Neon-Boden, Spielautomaten), Scheune (Heu, Fässer), Bibliothek (Teppich, Regale), Gewächshaus (Pflanzkästen) und Café. Zusammen 10 Typen, 30 Gebäude. Alle haben mehrere markierte Eingänge: größere gelbe Matten mit Leuchten, Pfeil und zwei Türpfosten.
- **Türen garantiert erreichbar:** Vor jeder Tür ist ein Bereich von 160 x 170 px frei von Bäumen, Felsen und Props. Ein automatischer Test (Flutfüllung über die ganze Karte, 25 Zufallswelten, 2150 Türen) findet für jede Tür einen Weg von außen hinein.
- **Mehr Props:** Zeltlager mit Feuer (6), Marktplätze mit Ständen (5), Teiche mit Schilf und Bänken (6), eingezäunte Felder mit Heuballen, Vogelscheuche und Beeten (5), kleine Parks mit Brunnen, Bänken und Laternen (6), einzelne Brunnen, Fässer und Baumstümpfe, Wegweiser, Pilze und Blumenbeete. Neue Baumarten: Birke, Kirschbaum (mit fallenden Blüten), Herbstbaum. Dazu Baumstämme am Boden.

## Entscheidungen (Runde 11, 30.09.2026)
- **Vorteil vor dem Duell sichtbar:** Jeder Gegner in der Nähe (bis etwa 640 px) bekommt einen Ring am Boden und eine Zahl neben dem Namen. Grün mit "+2": im Duell würdest du 2 Wörter weniger tippen als er. Rot mit "-3": 3 Wörter mehr. Je größer der Unterschied, desto kräftiger der Ring. Bei Gleichstand gibt es nichts. Die Zahl nutzt dieselbe Rechnung wie das Duell selbst (Level, Perks, ob jemand gerade vor dir flieht). Im Multiplayer rechnet der Server sie für jeden Zuschauer einzeln.
- **Schwimmen:** Teiche und Seen sind keine Wände mehr. Wer hineinläuft, schwimmt: nur der Oberkörper ist zu sehen, Wellenringe, Platsch-Effekt und -Ton, 55 % Tempo, kein Sprint und kein Dash. Snacks und Items erscheinen nicht im Wasser. Gefrorene Seen im Schnee sind Eis: normales Tempo, aber rutschig (wenig Reibung).
- **Größere Karte:** 9600 x 9600 statt 7200 x 7200 (etwa 1,8-mal so viel Fläche), 48 Gebäude in einem 8x8-Raster (vorher 30), 100 Bots, 2000 Snacks draußen und 560 drinnen, 100 + 70 Geschenkboxen, 800 Bäume. Die dichte Bauweise bleibt.
- **Biome:** 6 Biome mit eigenen Farben, Pflanzen und Props, die weich ineinander übergehen (Meadow, Forest, Desert, Snow, Autumn, Swamp). 18 Regionen, die Ränder sind verwackelt und verlaufen über etwa 800 px ineinander, auch der Boden ändert sich (Gras, Sand mit Kieseln, Schnee mit Glitzer, Laub, Sumpf mit Pfützen). Die Minimap zeigt die Biome.
  - **Meadow:** helle Wiese, Blumen, Birken und Kirschbäume, Märkte, Felder, Parks.
  - **Forest:** dunkles Grün, dicht mit Kiefern, Farn, Pilze.
  - **Desert:** Sand, Kakteen und Palmen, Knochen, Oasen (türkis, mit Palmen).
  - **Snow:** weißer Boden, verschneite Kiefern, Schneemänner, gefrorene Seen.
  - **Autumn:** orange Boden, Herbstbäume mit fallenden Blättern, Kürbisse, Laubhaufen.
  - **Swamp:** grün-grauer Boden, Trauerweiden und tote Bäume, trübe Teiche mit Blasen, Schilf.
- **Mehr Baumarten:** Palme, Kaktus, Schnee-Kiefer, Trauerweide, toter Baum (zusätzlich Birke, Kirsche, Herbst, Kiefer, Laubbaum).
- **Schneller:** Kollisionen und die Snack-Suche laufen über ein Raster statt über alle Objekte, der Boden wird in 512-px-Blöcken einmal gemalt und nur kopiert. Ein Spielschritt mit 100 Bots braucht etwa 3 ms statt 32 ms.

## Runde 12: Namen, Seltenheit, Unterwasser-Kisten

- **Bot-Namen:** Ein generierter Pool aus 500 Namen (Adjektiv/Wort + Vorname), nichts mit Essen. Die alten Snack-Namen sind ersetzt.
- **Seltenheit:** Jedes Item hat eine Stufe: Common, Rare, Epic, Legendary. Drop-Chancen 60 / 28 / 9 / 3 %. Die starken Items (Nova, Time Warp usw.) liegen in den hohen Stufen und sind dadurch wirklich selten. Fortune würfelt mehrfach und behält die beste Stufe.
- **Effekt pro Stufe:** eigener Toast in der Stufenfarbe, eigener Sound (rare / epic / legendary), Farbrahmen im Item-Slot, Legendary leuchtet pulsierend.
- **Neues Item Nova:** Druckwelle, die Gegner wegstößt. Golden Ticket gibt jetzt 10 Snacks.
- **Unterwasser-Kisten:** 18 Geschenkkisten liegen am Grund der Teiche (nicht im Eis). Sie sind nur schwach sichtbar (Blasen, Glitzern), man muss hinschwimmen. Quote 25 / 40 / 25 / 10 %, also deutlich bessere Beute. Respawn langsam, Minimap zeigt sie nicht.

## Runde 13: Siege fühlen sich größer an, Türen ohne Pfeile

- Ein Duellsieg bringt jetzt etwa die Hälfte der XP des Verlierers (vorher ein Viertel), Deckel 15 Level statt 8, Mindestgewinn 4 Snacks, Königsbonus 20 %.
- Die großen Pfeile auf den Türmatten sind weg. Matte und Türpfosten bleiben als Markierung.

## Runde 14: Skins, Perk-Seltenheit, Linksklick-Dash, Guide, sichtbare Auren

- **Skins:** 7 Fantasy-Hautfarben (Schleim, Eis, Geist, Bubblegum, Roboter, Gold, Imp), mehr Shirt- und Haarfarben, Frisuren Mohawk/Afro/Dutt/Zöpfe, Accessoires Katzenohren/Hörner/Heiligenschein/Kopfhörer/Hasenohren, Shirtmuster Punkte und Karo.
- **Perk-Seltenheit:** Jeder Perk ist Common/Rare/Epic/Legendary (Capstones legendär). Jede Karte würfelt 55/30/11/4 %, dann wird ein Perk dieser Stufe im gewählten Baum gezogen (fehlt die Stufe, eine niedrigere). Karten haben Farbrahmen und Label, Epic/Legendary spielen einen Sound.
- **Dash:** Linksklick dasht wie die Leertaste (nicht auf Buttons/Panels).
- **Guide:** Button im Startbildschirm öffnet Items, Perks und Seltenheits-Quoten, erzeugt aus den Spieldaten.
- **Aura:** Der Vorteil-Hinweis färbt jetzt das Spielermodell selbst grün/rot, mit Leuchten um den Körper plus Ring und Zahl.

## Runde 15: Drei Item-Slots

- Man trägt bis zu 3 Items. Jeder Slot hat eine eigene Taste: Q, E, R. Slots behalten ihren Platz, wenn einer benutzt wird.
- Ist alles voll, bleibt die Kiste liegen. Bots tragen weiter nur ein Item. Pickpocket, Iron Bubble und Item Fairy nutzen freie Slots.
- Multiplayer: der Client sendet den Slot, der Server schickt alle drei Slots im Snapshot.

## Runde 16: Tasten, Charaktere, Essen, Menü

- Item-Slots liegen auf Q, W, E (vorher Q, E, R).
- Mehr Charaktere: Frisuren Locken, Seitenscheitel, Flattop, Zopf; Accessoires Piratenbandana mit Augenklappe, Kochmütze, Antenne, Zaubererhut, Maske, Krönchen.
- Snacks geben 1,7x so viel Level wie vorher und das Essen dauert 0,6 s statt 0,85 s.
- Der Hinweistext oben im Spiel ist weg, die Steuerung steht nur noch im Menü.
- Esc geht zurück ins Menü (im Duell nicht). Im Mehrspielermodus verlässt man dabei den Server.

## Runde 17: Sichtlinie und Schatten

- Wände von Gebäuden, Baumstämme, Felsen, Baumstämme am Boden, Zelte, Stände, Brunnen, Kisten und Heuballen blockieren die Sicht. Dahinter liegt ein dunkler Schatten, in dem man nichts sieht.
- In einem Haus sieht man nach draußen nur durch die Türen, als Lichtkegel.
- Zäune, Laternen, Bänke, Fässer, Lagerfeuer und Möbel blockieren nicht. Der Schatten ist nur Darstellung, der Server und die Bots ändern sich nicht.
- Umsetzung: Sichtpolygon per Strahlenwurf von der Spielerposition gegen die dem Spieler zugewandten Kanten, als Overlay über der Welt.

## Runde 18: Sicht nur durch Häuser, Kamera-Zoom

- Nur Hauswände blockieren die Sicht. Bäume, Felsen und Props nicht mehr (zu viel Unruhe).
- Was im Schatten liegt, wird nur abgedunkelt (Boden). Spieler, Bots, Namen, Snacks, Kisten und Orbs im Schatten werden gar nicht gezeichnet.
- Kamera-Zoom mit Mausrad oder + / - (0 setzt zurück), Bereich 40 % bis 200 %. Ein Badge zeigt den Wert kurz an, er wird im Browser gespeichert.

## Runde 19: Guide aufgeräumt, Esc fragt nach

- Guide: Zeilen statt Karten. Items nach Seltenheit gruppiert (Punkt = Seltenheit), Perks mit Reitern pro Baum, Effekt auf höchstem Rang.
- Esc im Spiel öffnet "Go to the menu?" (Esc = bleiben, Enter = Menü). Im Einzelspieler pausiert das Spiel dabei. Auf dem Todesbildschirm geht Esc direkt ins Menü.
- Schatten: dunkler (78 %), auch Partikel im Schatten werden nicht gezeichnet. Im Startmenü steht "Build r19", damit man sieht, ob man die neue Datei hat.

## Runde 20: Hausschatten nur hinten, Zoom per Level

- Von außen ist ein Haus ein fester Block: der Schatten fällt nur auf die Seite, die vom Spieler weg zeigt (keine Lichtstreifen durch Türen mehr). Innen gelten weiter die echten Türöffnungen.
- Zoom startet bei 150 %. Rauszoomen wird mit Levels freigeschaltet: bei Lv 1 gar nicht, danach in 5-%-Schritten bis 80 % bei Lv 60. Reinzoomen geht immer (bis 250 %). Beim Freischalten erscheint ein Hinweis.

## Runde 21: Aura zählt Items und Perks, Tutorial-Menü

- Die Aura (grün/rot, Zahl) berücksichtigt jetzt alles, was ein Duell verändert: Level, Weglaufen, Pro Keyboard (-2 Wörter) und Golden Keyboard (halbe Phrase) bei beiden Seiten, sowie die Perks Short Phrases, Curse, Underdog, Slippery und zusätzlich Warm Fingers, Head Start, Flow State und Autocorrect als "geschenkte Wörter".
- "How to play" im Startmenü: 8 kurze animierte Szenen (Bewegen/Essen, Sprint/Dash, Perks, Duelle, Aura, Items, Sichtlinie, Zoom) mit den Spiel-Sprites. Navigation per Buttons, Punkte oder Pfeiltasten, Esc schließt. Build r21.

## Runde 22: Quests, Editor, große Karte, neue Items

- Quests (alle ca. 3 Minuten, zufällig): bestimmte Snacks essen, Geschenkboxen öffnen oder eine Unterwasser-Box finden, mit Zeitlimit. Belohnung: Level, sonst verfällt sie. Gesuchte Snacks werden markiert.
- Charakter-Editor im Startmenü (Frisur, Haar, Haut, Oberteil, Hose, Schuhe, Accessoire, freie Farben), wird gespeichert und an den Server geschickt.
- Karte 13600 x 13600 (doppelte Fläche), 9 Biome (neu: Dschungel, Vulkan, Zuckerland), ca. 95 Gebäude in 16 Typen (neu: Pizzeria, Schule, Klinik, Kino, Werkstatt, Eisdiele), neue Props (Ruinen, Friedhof, Brunnenplatz), 160 Bots.
- 8 neue Items, Pro Keyboard ist Epic und nur noch -1 Wort, Golden Keyboard etwa -35 %, Epic/Legendary-Chancen gesenkt.
- Tutorial mit doppelter Auflösung (scharf).
- Server-Schritt von ca. 26 ms auf ca. 6 ms optimiert (Kistensuche der Bots gedrosselt, Snack-Sog über das Raster).

## Runde 23: Tutorial als SVG

- "How to play" besteht jetzt aus 9 animierten Vektor-Szenen (inline SVG mit SMIL): Bewegen/Essen, Sprint/Dash, Perks, Duelle, Aura, Items (Q/W/E), Sichtlinie, Zoom, Quests, Charakter-Editor. Sie sind bei jeder Größe scharf und nutzen eigene Vektor-Figuren statt der Pixel-Sprites. Build r24.

## Runde 24: Mehrspieler einfacher

- Das Startmenü fragt alle paar Sekunden den Server ab (`/status` liefert jetzt auch die Namen und Level der Spieler; erreichbar unter der Seiten-Adresse, der gespeicherten Adresse oder localhost:8080).
- Gefundene Spieler erscheinen als "Name is playing · Lv N" mit Join-Knopf. Join startet neben diesem Spieler. Läuft ein Server, tritt Play automatisch bei, "or play alone" bleibt als Ausweg. Die manuelle Adresse liegt unter "Play with friends". Build r25.

## Runde 25: Mehrspieler ohne Server-Datei

- Der erste Spieler, der Play drückt, wird Host: sein Tab startet das Serverspiel in einem Web Worker (derselbe Code wie server/server.js). Weitere Spieler verbinden sich per WebRTC (PeerJS, Bibliothek liegt in tools/peerjs.min.js und wird in index.html eingebettet). Der öffentliche PeerJS-Vermittler hilft nur beim Verbinden.
- Das Menü fragt den Host per kurzer Verbindung nach den Spielern und zeigt "Name is playing" mit Join. Raumname optional. Fällt der Vermittler aus oder ist man offline, startet Play solo. Der Host bekommt beim Verlassen eine Warnung. Build r26. Der Node-Server bleibt als Option.

## Runde 26: Warm Fingers sichtbar, Perk-Karten nur per Taste, Sound, volle Slots

- Warm Fingers: Vor dem Duell sind die vorgetippten Wörter grün unterstrichen, der Cursor steht am ersten echten Wort und eine Zeile erklärt, wo man anfängt.
- Perk-Karten nach dem Level-Up reagieren nicht mehr auf die Maus (stören die Steuerung nicht mehr), gewählt wird nur mit 1, 2, 3. Ein bereits voll aufgelevelter Perk wird nie angeboten (auch nicht aus einer alten Auswahl).
- Sound: maximal 44 gleichzeitige Stimmen, Wiederholungen von Biss/Schluck/Yum/Level-Up werden gedrosselt (schnelles Essen bleibt hörbar), der AudioContext wird bei Bedarf wieder aufgeweckt.
- Volle Item-Slots: Läuft man über eine Geschenkbox, erscheint "SLOTS FULL!", ein Hinweis und ein Ton. Die Box bleibt liegen. Build r27.

## Runde 27: Play startet sofort, Absturzschutz, Versions-Check

- Play: Läuft schon ein Spiel (im Menü gelistet), tritt man direkt bei. Sonst startet das Spiel sofort als Host (kein Warten auf "Looking for a game"), der Raumname wird im Hintergrund beim Vermittler angemeldet und bei Netzproblemen erneut versucht.
- Die Spielschleife läuft jetzt auch bei Fehlern weiter (nächster Frame wird zuerst geplant, Update und Render sind abgesichert, ungültige Kamerawerte werden zurückgesetzt). Ein roter Hinweis zeigt die Fehlermeldung, statt dass der Bildschirm einfach dunkel bleibt.
- Versions-Check: Der Host sendet seine Build-Nummer; wer eine andere Version hat, bekommt eine klare Meldung statt eines kaputten Spiels. Build r28.

## Runde 28: Fairness-Balancing

- Beide Spieler bekommen immer gleich viele Wörter. Länge = 3 + (Durchschnittslevel / 12) + (Levelunterschied / 10), max. 20. Je mehr auf dem Spiel steht (hohe Level, großer Abstand), desto länger. Vorteile entstehen nur durch Items, Perks und Weglaufen.
- Bot-Tippgeschwindigkeit wächst langsamer mit dem Level (max. +14 WPM).
- Legendäre Items deutlich seltener (Kiste 1 %, Unterwasser 6 %); weniger Kisten. Neu bewertet: Sugar Rush Rare, Radar Common, Time Warp 4 s, Golden Keyboard ca. 30 %.
- docs/release-plan.md: Rechtliches und Plan für Release, Werbung, Mikrotransaktionen, Steam. Build r29.

## Runde 29: Musik bereinigt, Schriften eingebettet

- Entfernt: personaxmother, peronamorhwr, minecraft, sadmarioinb4, sadmariosda (Menü hat jetzt 3 Lieder, Todesbildschirm 1, König 1). 
- Schriften (Lilita One, Nunito, JetBrains Mono) liegen in fonts/ und sind in index.html eingebettet, es gibt keinen Google-Aufruf mehr. Build r29.

## Runde 30: Lobby-Liste und (BOT)-Namen

- Bots heißen jetzt "Name (BOT)" in der Rangliste, über den Köpfen und im Duell.
- Browser-Lobbys haben bis zu 8 Plätze pro Raumname (snackdown-<raum>-1 bis -8). Das Menü fragt alle Plätze ab und listet jedes laufende Spiel mit Host, Spielerzahl und Join-Knopf. Play tritt dem vollsten Spiel mit Platz bei, sonst startet es ein neues. Maximal 12 Spieler pro Lobby. Build r30.

## Runde 31: Vorbereitung Spieltests

- Versions-Check repariert: Die interne Build-Nummer stand noch auf r28, obwohl das Menü r30 zeigte. Spieler mit r28, r29 und r30 konnten sich also gegenseitig beitreten, ohne Warnung. Jetzt gibt es nur noch eine Konstante (`BUILD`), das Menü-Label wird daraus gesetzt.
- Fehlerbericht für Tester: "Report a problem" im Menü (mit Beschreibungsfeld), F8 im Spiel und "Copy bug report" in der roten Fehlerleiste kopieren einen Text in die Zwischenablage: Build, Browser, Bildschirm, Modus (Host/Client/Solo, Raum, Lobby, Menschen, Vermittler-Status, Rechenzeit des Hosts pro Schritt, letzte Nachricht vom Host), FPS mit 1 %-Tief und Rucklern über 50 ms, die letzten 10 Fehler mit Quelle (page, update, render, host) und Codezeile. Es wird nichts verschickt (keine Einwilligung nötig), Dateipfade werden entfernt.
- Fehler werden jetzt überall gesammelt: auch Fehler in Klick-Handlern und beim Start (globaler Fehler-Listener), und Fehler im Spielserver des Hosts (Web Worker). Die waren vorher komplett still: Der Host sieht sie jetzt als rote Leiste.
- Browser: Ersatz für `roundRect` (Safari unter 16, Firefox unter 112), Caps Lock oder Shift zählen im Duell nicht mehr als Tippfehler, ' und / öffnen in Firefox nicht mehr die Schnellsuche (die hätte alle weiteren Tasten geschluckt).
- docs/spieltest.md: Ablauf, Testaufgaben, Browser-Matrix, Fragen nach dem Spielen. Build r31.

## Runde 32: Fehler automatisch nach GitHub

- Alle Fehler werden automatisch hochgeladen und landen als Zeile in `errors/JJJJ-MM-TT.jsonl` im privaten Repo `smackdown-errors`. Dazu kommen die manuellen Berichte (F8, "Send report") mit der Beschreibung des Testers.
- Weg: Spiel -> Cloudflare Worker (`tools/error-relay/worker.js`, hält den GitHub-Token geheim) -> GitHub. Ein Token direkt in index.html ginge nicht: Jeder mit der Datei könnte damit das Repo verändern.
- Gebündelt und begrenzt: erster Upload 5 s nach einem Fehler, danach höchstens einer pro Minute, maximal 30 pro Tab, gleiche Fehler werden hochgezählt. Beim Schließen des Tabs wird der Rest noch gesendet. Der Worker prüft und kürzt alles, nimmt höchstens 20 Berichte pro Minute und IP an und speichert keine IP-Adressen. Spielernamen werden nie gesendet.
- Im Menü steht dann "errors are sent to the developer automatically (no names)". Solange `ERR_URL` leer ist (Worker noch nicht eingerichtet), ist alles aus. Einrichtung: docs/fehler-upload.md. Build r32.

## Runde 33: Fehler-Upload aktiv

- Worker auf Cloudflare eingerichtet (`snackdown-errors.alikesan2004.workers.dev`), Test-Bericht ist im privaten Repo `smackdown-errors` angekommen. Die Adresse ist jetzt im Spiel eingetragen: Fehler werden ab Build r33 automatisch hochgeladen, im Menü steht ein Hinweis.
- Der Worker erklärt GitHub-Fehler jetzt genau (Token falsch/abgelaufen, Repo für den Token nicht sichtbar, Branch fehlt, keine Schreibrechte) und ignoriert Leerzeichen in den Einstellungen.
- Der Token läuft am 30.12.2026 ab und muss dann erneuert werden (docs/fehler-upload.md). Build r33.

## Runde 34 (r34): Item-Effekte sichtbar, schnelleres Beitreten, Auto-Auflösung

- Im Mehrspieler läuft der Effekt eines Items auf dem Host, deshalb sah man nichts (Apfel & Co). Jetzt zeigt der Client beim Benutzen (Slot wird leer) Name, Ergebnis ("+4 snacks of level", "Stamina full, dash ready" ...), Ring (Größe je Item), Sterne, Blitz und Ton. Laufende Effekte (Magnet, Turbo, Rocket, Black Hole, Rubber Band, Sugar Rush, Radar, Smoke) haben einen rotierenden Ring unter der Figur.
- Beitreten: Der geöffnete Scout-Kanal zum Vermittler wird wiederverwendet (spart einen Verbindungsaufbau). Läuft die erste Suche noch, wartet Play bis zu 3,5 s darauf, statt aus Versehen ein zweites Spiel zu starten. Statusmeldungen "Joining X's game…". Fehlschlag meldet den Grund. Der Bug-Report enthält "Join steps" mit Zeiten (Klick > Vermittler > verbunden > welcome > Welt gebaut > erster Snapshot), damit man sieht, wo es hängt.
- Ruckeln: automatische Auflösung. Liegt der Schnitt zwei Sekunden lang unter ca. 38 FPS, sinkt die Zeichenauflösung stufenweise bis 55 %, bei hohen FPS steigt sie wieder.

## Runde 35 (r35): Ladebildschirm, Level-Ausgleich im Duell

- Ladebildschirm ab Play/Join: Spinner, Schrittanzeige ("Looking for a game…", "Joining X's game…", "Starting your game…", "Building the world…"), Tipp, Abbrechen-Knopf. Er wird erst gezeichnet, dann läuft die schwere Arbeit (Weltbau), und verschwindet beim ersten Update des Spiels. Nachrichten, die während des Weltbaus ankommen, warten in einer Warteschlange.
- Balance: Wer das niedrigere Level hat, tippt 1-2 (bei großem Abstand mehr) Wörter weniger: ca. 1 pro 9 Level Unterschied, ab Abstand 4 mindestens 1, höchstens 30 % der Phrase. Beispiele: Lv 1 gegen Lv 17: 2 gegen 4 Wörter; Lv 1 gegen Lv 40: 4 gegen 7; Lv 1 gegen Lv 400: 14 gegen 20; gleiches Level: gleich viele.

## Runde 36 (r36): Name Typebite

- Das Spiel heißt jetzt Typebite (Titel, Menü, Fehlerbericht, README, Server-Texte). Lobby-Ids beginnen mit `typebite-`, ältere Versionen sind wegen der Versionsprüfung ohnehin nicht kompatibel. Interne Schlüssel (localStorage `snackdown-*`, Fehler-Relay) bleiben unverändert, damit gespeicherte Einstellungen nicht verloren gehen.
- Entscheidung des Entwicklers trotz Hinweis: ähnliche kleine Spiele existieren (BiteType!, Type 'n' Bite). TMview: keine EU/AT-Marke. Vor Werbung/Steam anwaltlich prüfen lassen.

## Runde 37 (r37): Domain und Veröffentlichung vorbereitet

- Domain typebite.io bei Cloudflare gekauft (Ablauf 01.10.2027, Verlängerung 50 USD/Jahr, Auto-Renew an, 2FA aktiv). `docs/deploy.md` beschreibt die Veröffentlichung mit Cloudflare Pages.
- Menü: Auf einer öffentlichen https-Seite wird `localhost:8080` nicht mehr abgefragt (Browser würden sonst nach einer Berechtigung für das lokale Netz fragen). Build r37.

## Runde 38 (r38): Fehlerbericht schließt sich, Auswertung, https

- "Send" im Fehlerbericht schließt das Fenster nach dem Senden und zeigt "Thanks! Report sent to the developer." (Menü: roter/oben-Balken, im Spiel: Hinweis).
- Auswertung der ersten echten Berichte (errors/2026-10-01.jsonl im Log-Repo): keine Fehler, nur Berichte. r33: 54-58 FPS im Schnitt, 1% Low 16-20 FPS, einmal 557 ms am Spielstart (Weltbau). r37: 99 FPS, 1% Low 71 FPS, Host-Schritt 7 ms. Der 550-ms-Ruckler ist der Weltbau beim Start; er zählt jetzt nicht mehr in die Ruckler-Statistik (2,5 s Schonfrist nach Spielstart).
- typebite.io läuft über Cloudflare Workers Builds (jeder Push auf main veröffentlicht neu). Auf http://typebite.io leitet die Seite selbst auf https um. Build r38.

## Runde 39 (r39): Online-Spiel nur mit Einwilligung, Entwürfe für Impressum und Datenschutz

- Datenschutz: Das Menü fragt beim ersten Besuch "Play online with friends?" (Yes, go online / No, offline only). Vor der Zustimmung wird nichts an den Vermittlungsdienst (PeerJS) gesendet, Play startet dann ein Solo-Spiel. Die Wahl steht im Local Storage (`snackdown-online`) und lässt sich im Bereich "Friends" ein- und ausschalten. Test: vor der Zustimmung 0 Anfragen an den Vermittler, nach "Yes" funktionieren Lobby-Liste, Host und Beitritt wie vorher.
- `docs/legal/`: Entwürfe für Impressum und Datenschutzerklärung (Österreich/DSGVO) mit Platzhaltern, noch nicht veröffentlicht. Erkenntnis: Die Bibliothek PeerJS nutzt standardmäßig Googles STUN-Server und PeerJS-Relay-Server (turn.peerjs.com, EU/USA); das steht in der Datenschutzerklärung. Build r39.

## Runde 40 - Impressum, Datenschutz, 90-Tage-Löschung
- `site/impressum.html` und `site/datenschutz.html` mit den echten Daten (Ali Kesan, Salzburg, noch kein Gewerbe). Live unter typebite.io/impressum und /datenschutz. Menü-Footer verlinkt beide, Consent-Text verlinkt die Datenschutzseite.
- Fehlerberichte werden nach 90 Tagen gelöscht: GitHub Action `cleanup.yml` im privaten Repo `smackdown-errors` (Kopie: `tools/error-relay/cleanup-workflow.yml`), täglich 03:17 UTC, löscht alte Dateien und schreibt die History neu (orphan + force push). Skriptlogik lokal getestet, die Action selbst noch NICHT live gelaufen (Push von Workflow-Dateien per GITHUB_TOKEN könnte von GitHub abgelehnt werden -> einmal manuell starten und Log prüfen).
- "Skin ready": `docs/legal/baustein-skins-zahlungen.md` (Textbaustein + Voraussetzungen). Bewusst NICHT im Live-Text, weil die Erklärung nur tatsächliche Verarbeitung beschreiben darf.
- BUILD r40.

## Runde 41 - Perk-Karten klickbar, Menü-Dialog
- Perk-Karten sind jetzt per Klick wählbar (Tasten 1/2/3 gehen weiter). Klick auf eine Karte löst keinen Dash aus, die Figur läuft weiter zum Cursor.
- `kbd` in Buttons (Stay/Menu) hatte weißen Text auf weißem Feld; jetzt dunkle Schrift.
- BUILD r41. Nur Syntax geprüft, Klick nicht im Browser getestet.

## Runde 42 - Einstellungen
- Neues Menü "Settings" (Menü-Button und Button links oben im Spiel, Esc schließt): Lautstärke Musik und Soundeffekte (Slider), Grafik: Render distance (30-100 %, Dinge weit vom Bildschirmmittelpunkt werden nicht gezeichnet; Häuser, Boden und Schatten bleiben) und Potato-PC-Modus (feste 55 % Auflösung ohne Auto-Qualität, Render distance max 60 %, kein Screenshake, keine Bremsspuren, keine Staub-/Ring-/Linien-Partikel). Metriken: FPS, Ping (zum Host), Details (Spieler, Auflösung, Host-Schrittzeit) als Overlay links.
- Ping: Client sendet alle 2 s `ping`, Host antwortet `pong` (gilt auch für Dedicated Server und Browser-Host). Solo zeigt "- (solo)".
- Während Settings offen ist, läuft die Figur nicht zum Cursor und Tasten gehen nicht ans Spiel (Server läuft weiter).
- Gespeichert in localStorage `snackdown-settings`. BUILD r42.
- Getestet (Chromium, headless): Settings öffnen/Slider/Haken/Esc, Speichern, Metriken im Solo-Spiel, Potato (Res 55 %), Ping 26 ms gegen `server/server.js`. NICHT getestet: Hören der Lautstärke, P2P-Ping, Gefühl der Render distance auf echter Hardware.
