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

## Runde 43 - Handy-Unterstützung, "Network delay"
- Metrik "Ping (to the host)" heißt jetzt "Network delay" (Overlay: "Delay").
- Touch-Modus (`TOUCH`: `(pointer:coarse)`, zum Testen auch `?touch=1`; Klasse `body.touch`): schwebender Joystick (irgendwo auf dem Spielfeld ziehen), Buttons Dash und Run (halten), Items per Antippen (Q/W/E-Slots, geht auch mit Maus), Menü-Button (☰) und Zahnrad für Settings, Zoom-Slider in den Settings (Start 100 %, Minimum 80 %). Maus-Steuerung/Dash-per-Klick sind im Touch-Modus aus.
- Duell am Handy: das Panel sitzt ganz oben, ein unsichtbares Eingabefeld (`#tin`) holt die Handy-Tastatur; Textänderungen werden per Diff (auch bei Autokorrektur/Vorschlägen) in Tastendrücke umgewandelt. Tippen irgendwo öffnet die Tastatur, falls sie nicht von selbst aufgeht ("tap here to type").
- Kompaktes Layout: HUD klein oben links (Level + 3 dünne Balken), Minimap 84 px oben rechts, Bestenliste nur Top 3 + du, Quest klein, Perk-Karten als drei kleine Karten in der Mitte, Menü ohne lange Erklärtexte (Touch-Hinweis statt Tastenliste), Hinweis "needs a keyboard" entfernt. viewport: kein Pinch-Zoom.
- BUILD r43.
- Getestet (Chromium-Emulation, Touch-Ereignisse, Querformat 844x390 und Hochformat 390x844): Menü, Joystick-Ziehen, Buttons sichtbar, Perk-Karten antippen, Duell-Panel, Tippen ins Eingabefeld inkl. Backspace, Desktop-Regression, Node-Server startet. NICHT getestet: echte Geräte (iOS Safari, Android Chrome), ob die Tastatur dort automatisch aufgeht, wie die Tastatur das Bild verdeckt, Performance auf schwachen Handys, Pinch-Zoom (nicht gebaut).

## Runde 44 - Handy-Feedback vom iPhone
- Q/W/E-Beschriftung am Handy weg. Sound/Music-Buttons sind am Handy wieder da (klein, unter dem HUD, nur im Spiel). Eaten-Dialog kompakt (box-sizing-Fehler: Karte war breiter als der Bildschirm).
- Tastatur im Duell: Ursache war, dass das unsichtbare Eingabefeld nach dem Schließen der Tastatur noch den Fokus hatte und das Antippen dann nichts tat. Jetzt blur + focus im selben Tipp (touchend und click). "tap here to type" richtet sich nach der echten Tastatur (visualViewport) statt nach dem Fokus. Metriken liegen im Duell unten statt über dem Text.
- Musikübergänge weicher: Einblenden .9/s statt 2.5/s, Ausblenden 1.3/s statt 4/s (Überblendung ca. 2-3 s). Nicht gehört, nur Werte geändert.
- Vollbild: iOS Safari erlaubt Webseiten kein Vollbild. Deshalb PWA-Daten (`site/manifest.webmanifest`, Icons, apple-mobile-web-app-Tags, theme-color): "Zum Home-Bildschirm" startet ohne Leisten. Fullscreen-Button in den Settings, wo der Browser es kann (Android, Desktop). Hinweis im Menü.
- BUILD r44. Echte iPhone-Prüfung der Tastatur steht aus.

## Runde 45 - Musik, Handy-Layout, passive Items
- Musikwechsel: erst blendet der alte Song ganz aus (linear, ca. 1,8 s; bei Ducking schneller), dann startet der nächste und blendet langsam ein (ca. 3,5 s). Test im Headless-Chromium: Lautstärke des alten Songs läuft auf 0, erst dann steigt der neue.
- Musik ist standardmäßig AUS (localStorage `snackdown-music` = '1' schaltet ein). Hinweis: wer vorher Musik an hatte, hat keinen Eintrag '1' und beginnt auch mit "aus".
- Handy: Quest und King-Hinweis unten links (nicht klickbar, halbtransparent) statt oben über HUD/Buttons.
- Home-Bildschirm-App (iPhone): Canvas-Höhe wird auf die Bildschirmhöhe gesetzt, damit unten kein Streifen bleibt (nur wenn `navigator.standalone`/display-mode standalone und der Unterschied < 140 px). NICHT auf dem Gerät geprüft.
- Passive Items (Piano usw.): Antippen bzw. Q/W/E zeigt "passive, used automatically in your next duel" (auch im Client-Modus, vorher nur Solo), Slot trägt am Handy das Label "auto".
- BUILD r45.

## Runde 46 - Bild bis zum Rand (Handy)
- Neues unsichtbares Element `#vp` (100lvh x 100vw) misst den größten Viewport; `resize()` nimmt daraus Breite/Höhe, der Canvas wird in Pixeln darauf gesetzt. Dadurch reicht das Spielbild am Handy unter die Browserleiste und den Home-Indikator (statt einer einfarbigen Fläche). UI (fixed, bottom/top mit safe-area) bleibt an ihrem Platz. Ersetzt den Standalone-Höhen-Trick aus r45.
- Hintergrund von `html` und theme-color/Manifest sind jetzt das Gras-Grün statt Weiß/Dunkellila.
- Bekannt, nicht änderbar: iOS 26 legt am oberen/unteren Rand von Web-Apps einen Unschärfe-Effekt über den Inhalt; der Spielinhalt bleibt aber sichtbar. Figur sitzt durch die größere Fläche etwas tiefer als die Mitte des sichtbaren Bereichs.
- BUILD r46. Nur in der Emulation geprüft (dort ist lvh = innerHeight, es ändert sich nichts), echtes iPhone steht aus.

## Runde 47 - Vollbild am iPhone: Diagnose
- r46 (nur `100lvh`-Messung) hat am iPhone nichts geändert: im Browser endet das Bild über der Leiste, in der Home-Bildschirm-App bleibt unten ein ca. 60 px hoher Streifen. Die Fix-Logik wählt jetzt die größte von drei Höhen (innerHeight, 100lvh-Probe, im App-Modus die Bildschirmhöhe).
- Da ich kein iPhone habe: Settings -> Details zeigt am Handy zusätzlich `inner / lvh / screen / canvas / app / safe / visual` (auch im Bug-Report unter Screen). Der Nutzer schickt einen Screenshot davon, daraus lässt sich der echte Fehler ablesen.
- Vermutung (ungeprüft): Das Layout-Viewport der App ist ca. 60 px kürzer als der Bildschirm; was außerhalb liegt, kann die Seite eventuell gar nicht bemalen.
- BUILD r47.

## Runde 48 - Online-Start repariert (Regression aus r47), Vollbild-Versuch
- Fehler: `resize()` rief ab r47 `getComputedStyle` auf; im Web Worker (Host-Server) gibt es das nicht -> "host server crashed" -> Online-Spiel blieb bei "Starting your game..." hängen. Gefunden im Fehler-Upload (Logs vom iPhone und PC, 10:55-10:57). Fix: Messblock nur wenn `typeof __SERVER__==='undefined'`.
- Test: lokaler PeerJS-Broker, Online an, Play -> Host startet, HUD sichtbar, keine Fehler (Headless-Chromium). Lehre: Änderungen an gemeinsam genutztem Code (resize, Render) immer auch mit Online-Host testen.
- iPhone-Messung (App-Modus, Hochformat): inner 393x793, lvh 852, screen 852, safe 59/34. Das Layout-Viewport ist 59 px kürzer als der Bildschirm, der Canvas (852 hoch) wird unten bei 793 abgeschnitten. Querformat ist ok (inner = screen). Im Safari-Browser läuft das Bild unter der Leiste weiter.
- Versuch: im App-Modus `html.tall` (overflow: visible, body min-height 100lvh), damit der Canvas unter die Layout-Grenze malen darf. Ungeprüft; Diagnose zeigt "tall" an.
- BUILD r48.

## Runde 49 - Slots, große Karte, FPS-Limit, Essgeräusch
- Item-Slots: Start 3 (Q W E), neue Slots bei Lv 12, 30, 60, 100 (R T Z U; Slot 6 = physisch Y/Z, beide Tasten gehen). `slotsOf`/`freeSlot`; Items-Arrays haben immer 7 Einträge, nur freigeschaltete Slots zählen. Beim Freischalten Toast. Hinweis: verliert man im Duell Level, werden obere Slots wieder unsichtbar/unbenutzbar (Items bleiben, bis man wieder aufsteigt).
- Große Karte: Minimap antippen/anklicken oder Taste M (Esc/Klick daneben schließt). Auflösung der Karte bleibt 300 px (hochskaliert).
- Settings: Frame rate limit (Unlimited, 144, 120, 90, 60, 45, 30). Umsetzung: Frames überspringen, wenn die Zeit seit dem letzten Frame zu kurz ist. Test: Limit 30 -> FPS-Anzeige 30.
- Essgeräusch: Beim Client ist zwischen zwei Snapshots kein 'move'-Zustand sichtbar, wenn direkt der nächste Snack gegessen wird -> kein Ton. Jetzt erkennt `fxStep` den Neustart am Fortschritt (`ep` springt von >.6 auf <.35) und spielt yum + boop. Ungetestet im echten Mehrspielerspiel, nur Code-Pfad.
- BUILD r49.

## Runde 50 - FPS bis 1000, 57 Snacks
**FPS**
- Standard ist jetzt "Match monitor refresh rate" (Haken in den Settings, zeigt die erkannte Hz-Zahl); das ist exakt das alte Verhalten von requestAnimationFrame. Die Hz-Zahl wird aus den rAF-Zeitstempeln gemessen (schnelle 15 % der Abstände, Maximum der letzten 5 Messfenster, auf übliche Werte gerastet).
- Ohne Haken: Schieberegler 30..1000 fps, logarithmisch, rastet bei 30, 60, 90, 120, 144, 165, 240, 360, 500, 1000 (und bei der Monitor-Hz) ein; Pfeiltasten (Einzelschritte) rasten nicht, damit man nicht hängen bleibt.
- Limit unter der Monitorrate: Frames werden im rAF übersprungen, mit "halber Bildschirmtakt"-Toleranz (60 fps auf 144 Hz ergibt wirklich ~60, nicht 48). Limit über der Monitorrate: zusätzlich läuft `frame()` aus einer Timer-Schleife (setTimeout zum Schlafen, MessageChannel für die letzten ms). Ehrlich: der Bildschirm zeigt trotzdem nur seine Hz; mehr Frames senken höchstens die Eingabeverzögerung etwas und kosten viel CPU (Hinweis im Menü).
- Auto-Qualität (QS) beurteilt Frames bei einem Limit unter der Monitorrate gegen dieses Limit (sonst hätte 30 fps die Auflösung gesenkt).
- Getestet (Headless-Chromium, Software-Rendering): Limit 30/45/60 -> ~30/49/60 fps angezeigt, 144/500/1000 -> 101/140/125 fps (durch die Rechenleistung begrenzt, 60-Hz-Bildschirm). Slider-Einrasten per Skript geprüft. NICHT getestet: echte 144/240-Hz-Monitore.
**Snacks**
- 57 Arten statt 5, jede mit eigenem Aussehen, eigenem Nährwert (`xp`, auf Durchschnitt 1,0 normiert: der durchschnittliche Snack bringt gleich viel XP wie vorher; die häufigen sind weniger wert, seltene mehr), eigener Esszeit (`et`).
- Seltenheit: common/rare/epic/legendary mit 80/16/3.5/0.5 % der Snacks (5/15/9/28 Arten). Seltene haben einen Glanz am Boden, epische/legendäre funkeln; beim Essen gibt es Name, Ton (`sfx.rare/epic/legendary`) und Ringe.
- Epische und legendäre Snacks haben einen Bonus: Sugar Rush, Turbo, Blasenschild, Magnet, Radar, Stamina auffüllen, Dash aufladen oder ein Geschenk (Items-Logik wiederverwendet).
- Heimat: jede Art wächst häufiger in bestimmten Biomen (Faktor 6) und in bestimmten Läden (Faktor 8), z. B. Ramen im Schnee, Bananen im Dschungel, Donuts in Zuckerland/Bäckerei.
- Guide: neuer Tab "Snacks" mit Bild, Beschreibung, Nährwert, Esszeit, Bonus und Fundort; die Rarity-Seite zeigt auch die Snack-Chancen. Quests ("Iss 4 Burger") nehmen nur häufige Snacks.
- Technik: Sprites werden einmal in 3-facher Auflösung gezeichnet und dann gestempelt (schneller als 57 Vektorformen pro Frame); Biss-Sprites nutzen dasselbe. Snapshot-Index ist `FOOD[id].i`.
- Fix: das Essgeräusch-Nachziehen aus r49 (`_ep`) löste bei jedem normalen Snack doppelt aus; jetzt wird `_ep` bei jedem Zustandswechsel zurückgesetzt.
- Getestet: alle 57 Sprites auf der Kontaktkarte, Spielstart solo, Online-Host + Beitritt (57 Arten beim Beitretenden), Essen von goldenem Burger (+2,3 Level auf Lv 5, Rush), Phoenix-Ei (Stamina, Dash, Rush), Trüffel (Item), Guide (57 Zeilen, Mobil-Layout). NICHT getestet: wie es sich spielt (Balance der Seltenheiten), Gehör der Sounds.
- BUILD r50.

## Runde 51 - Einstellungsdatei, Items stapeln, kleinere Karte, mehr Bots, Seltenes seltener
Wunsch: gleiche Items sollen sich stapeln (2x Sugar Rush = doppelte Wirkung), die Karte ist zu groß und es gibt zu wenige Spieler, alles Seltene soll seltener sein, und alle Stellschrauben sollen an einem Ort im Klartext stehen.

**Einstellungsdatei `site/config.js`**
- Eine Datei mit allen Zahlen, ausführlich kommentiert (englisch, Erklärung auf Deutsch in `docs/konfiguration.md`): Karte (Größe, Gebäude je Typ, Deko-Orte, Bäume), Spieler/Bots, Spawn-Raten, Seltenheit, Level/XP, Bewegung, Duell, Quests, Kamera, Netzwerk, alle 24 Items, 38 Perks, 57 Snacks (je Seltenheitsstufe, Gewicht, Werte, Biome/Läden, Effekt).
- Ändern ohne Build: Der Ordner `site/` ist der Webroot (Cloudflare), also liegt die Datei live unter `/config.js` und `index.html` lädt sie beim Start. Auf GitHub editieren, committen, nach ca. 1 Minute gilt es. In `index.html` steckt zusätzlich eine Kopie vom letzten Build (Rückfall, `window.TYPEBITE_DEFAULTS`); eine `config.js` neben der heruntergeladenen `index.html` überschreibt sie. Der Node-Server (`server/server.js`) liest dieselbe Datei (`SNACK_CONFIG=pfad` für eine andere) und liefert sie unter `/config.js` aus; der Host-Worker bekommt die zusammengeführten Einstellungen eingebaut.
- Schutz: unbekannte Namen, falsche Typen und Syntaxfehler zeigen eine orange Leiste (`#cfgbar`), die eingebaute Zahl gilt dann weiter. Mehrspieler: `CFGID` (Hash über alle Einstellungen) steht im `welcome`; wer andere Einstellungen hat, kommt nicht rein ("different game settings"), wie bei einer anderen Version. Bug-Report und `diag()` zeigen den Hash.
- Gewichte (0 = kommt nie vor), `tier` verschiebt ein Ding in eine andere Seltenheit. Seltenheits-Listen sind Gewichte, werden normiert. Zählwerte (`world`, `spawn`) gelten für eine Karte mit 13600 und werden mit `(size/13600)^2` umgerechnet (`world.scaleCounts`).
- Nicht in der Datei: Texte, Namen, Icons, Aussehen; Freischaltlevel der Looks; Rang-Titel; Musik; Tasten. Neue Items/Perks/Snacks brauchen weiter Code.

**Items stapeln**
- `stack:'strength'`: jede Benutzung hat einen eigenen Timer, der Effekt wächst mit der Zahl der laufenden Kopien (bis `maxStacks`): Sugar Rush (x5; pro Kopie Essen 1/0,35 mal schneller und +50 % XP), Magnet (x4; Radius und Tempo), Turbo (x3; +40 % Tempo je Kopie), Rocket Boots (x3), Black Hole (x2). `stack:'time'`: die Zeit wird addiert, höchstens `maxStacks` (3) mal die Dauer: Rauchbombe, Bubble Shield, Radar, Gummiband, Freeze Ray, Time Warp. Clover addiert seine Boxen. `items.stacking:false` schaltet alles ab.
- HUD zeigt "🍬×2 10s", beim Benutzen steht "Sugar Rush ×2" über der Figur, Guide nennt "stacks: stronger/longer".
- Nebenbei gefunden: die Rauchbombe hat bei Bots nie gewirkt (gesetzt wurde `buff.smoke`, abgefragt `buff.hide`). Jetzt einheitlich `smoke`.

**Neue Standardwerte (meine Vorschläge, Balance ist ungespielt)**
- Karte 10000 statt 13600 (54 % der Fläche), Bots 240 statt 160, Bot-Nachwuchs 2 pro Sekunde (vorher 0,8).
- Seltenheit (Common/Rare/Epic/Legendary): Geschenkbox 75/19,5/5/0,5 (vorher 66/26/7/1), Unterwasserbox 42/38/16,5/3,5 (34/40/20/6), Perk-Karten 62/26/9/3 (55/30/11/4), Snacks 86,5/11/2,3/0,2 (80/16/3,5/0,5).
- Snack-Nachwuchs 16 außen und 4 innen pro Sekunde (vorher 8 und 2), siehe Messung.

**Messung (Node-Sim, 1 Spieler, 300-420 s, wichtig fürs Verständnis der Zahlen)**
- Die Bots fressen die Snacks viel schneller, als sie nachkommen: im alten Spiel fällt der Vorrat von 5085 auf rund 330 und bleibt dort (ca. 1,9 Snacks je Mio. Einheiten², Bots im Mittel Lv 9-10, 90 %-Marke Lv 30). Der Vorrat `snacksOutside` ist also nur der Anfang, die Nachwuchs-Rate bestimmt, wie viel liegt.
- Neue Karte mit unveränderter Rate (8/2): rund 180 Snacks = 1,8 je Mio.²; Bot-Level wie vorher. Mit 16/4 und Bot-Nachwuchs 2: rund 240 Snacks = 2,4 je Mio.², etwa 165 Bots am Leben (Bots 240 ist nur das Maximum, sie fressen sich gegenseitig; 0,8 ergibt ca. 115, 4 ergibt ca. 220), Bot-Level Median 9,5, 90 %-Marke 25. Spielerdichte damit etwa das Dreifache von vorher (1,65 statt 0,54 je Mio.²).
- Server-Schritt mit 240 Bots im Host-Worker: 6,4 ms (Cloud-Rechner, kein Handy).
- Geschenkboxen werden nicht leergefressen (außen 70-90 von 92, innen ~45 von 65, Wasser ~18 von 19); Bots tragen im Mittel 0,3-0,4 Items.

**Getestet** (Headless-Chromium, Node)
- Spielstart solo (Desktop und Touch-Emulation) mit dem gebauten `index.html`, keine Fehler. Stapel-Zahlen: XP-Faktor 1,5 / 2,0 / 2,5 bei 1 / 2 / 3 Rush, Essdauer 0,21 / 0,105 / 0,07 s, zwei Rush per Taste Q und W = ×2, Schild 12 s bei zwei, Deckel 18 s, Magnet-Deckel 4, Magnet-Radius wächst mit den Kopien.
- Seltenheit mit 200 000 Würfen gemessen: Geschenkbox 75,1/19,4/5,0/0,49, Wasser 42,1/38,0/16,5/3,5, Snacks 86,6/10,9/2,3/0,21. Die Perk-Karten beim ersten Pick sind anders (62/33/5/0), weil es nur 2 epische Perks gibt und legendäre erst ab 4 Punkten im Baum erscheinen; dann wird eine Stufe tiefer gezogen (so war es schon vorher).
- Datei-Fälle: ohne Datei, gültige Überschreibung (Karte 6000, 50 Bots, Box 10/10/10/70), Tippfehler plus falscher Typ (5 Hinweise, eingebaute Werte), Syntaxfehler (1 Hinweis). Mehrspieler mit lokalem Broker: Host + Beitretender mit gleichen Einstellungen verbinden sich, einer mit geänderter Box-Chance wird abgewiesen. Node-Server: Datei geladen, `/config.js` ausgeliefert, WebSocket-Beitritt, derselbe Hash wie im Browser. Guide-Tabs ohne undefined/NaN, Perk-Karten, Pick per Taste 1.
- NICHT getestet: wie sich die neuen Werte spielen (Balance), echte Handys und Firefox/Safari, das Bearbeiten auf GitHub samt Cloudflare-Deploy (aus der Sandbox nicht erreichbar), schwache Geräte mit 240 Bots.
- BUILD r51.

## Runde 52 - Viel mehr Auswahl im Figuren-Editor
Wunsch: Der Editor ist langweilig, vor allem Oberteil, Hose und Accessoire. Viel mehr davon, die Farben passen.

**Neu**
- Oberteile: 31 statt 5 (u. a. Hoodie, Jacke, Tanktop, Pulli, Polo, Anzug mit Krawatte, Trikot mit Nummer, Baseball-Shirt, Herz, Stern, Totenkopf, Blitz, Burger, Camo, Tiger, Regenbogen, Schürze, Bauchfrei, Weste, Karo, Zickzack, Batik, Brusttasche, Kimono, Farbverlauf, Skelett). Je nach Stil kurze, lange oder keine Ärmel.
- Hosen: 21 Stile statt nur "Shorts an/aus" (Jeans, Cargo, Trainingshose, Caprihose, zerrissen, Rock, langer Rock, Kilt, Tutu, Latzhose, weit, gestreift, Camo, Anzughose, Pyjama, Schlaghose, Badehose, Flicken, Gürtel).
- Das eine Accessoire ist jetzt auf drei Plätze aufgeteilt, jeder mit eigener Farbe:
  - **Hut** (40): die alten plus Zylinder, Cowboyhut, Wikingerhelm, Blume, Schleife, Propellermütze, Weihnachtsmütze, Partyhut, Fuchs- und Bärenohren, Froschmütze, Einhorn, Pflänzchen, Baskenmütze, Fes, Diadem, Sombrero, Kapuze, Pilz, Ninja-Band, Bandana, Doktorhut, Geweih, Ohrenschützer, verkehrte Kappe, Fahrradhelm.
  - **Gesicht** (20): Sonnenbrille und Maske (vorher Accessoire), Brille, Monokel, Schutzbrille, Augenklappe, Schnurrbart, Vollbart (in Haarfarbe), Sommersprossen, Clownsnase, Kriegsbemalung, Vampirzähne, Sternbrille, Cyber-Visier, Schnorchel, Herzaugen, müde Augen, Monobraue, Pflaster.
  - **Extra** (19): Schal, Krawatte, Fliege, Kette, Medaille, Glöckchen-Halsband, Blumenkette, Rucksack, Umhängetasche, Jetpack, Gitarre, Schwert auf dem Rücken, Schwanz, Luftballon, Lolli, Zauberstab, Haustier-Schleim, Haustier-Küken (hüpfen beim Laufen).
- Editor: acht Zeilen (Haare, Haut, Oberteil, Hose, Schuhe, Hut, Gesicht, Extra), jede mit Pfeilen und einer Auswahlliste (bei 40 Hüten sonst zu viel Klicken) plus Zähler "3/40", darunter die Farben. Teile, die ihre Farbe nicht nutzen (z. B. Heiligenschein, Schnurrbart), blenden die Farbfelder halb aus.
- Bots ziehen ebenfalls aus allen Listen, "nichts" kommt bei Gesicht und Extra öfter vor, damit nicht jeder vollbehängt herumläuft.
- Alte gespeicherte Looks werden umgewandelt: Shorts an -> Hose "shorts", Accessoire Sonnenbrille/Maske -> Gesicht. Der Server prüft alle neuen Felder (`cleanLook`), unbekannte Werte werden verworfen.

**Bewusst nicht geändert:** Die Brustpanzerung ab Level 25 verdeckt weiterhin das Oberteil, Helm (50) und Krone (100) verdecken den Hut. Gesicht und Extras bleiben sichtbar. Ob Oberteil/Hut auch mit Rüstung sichtbar bleiben sollen, entscheidet Ali.

**Getestet** (Chromium headless, Node)
- Alle Teile in drei Richtungen als Übersichtsbild gezeichnet und angesehen; danach Zylinder höher, Brille als zwei Rahmen, Pflaster und Stift sichtbarer gemacht.
- Editor: Pfeile, Auswahlliste, Farbfeld, Speichern; Ansicht am Desktop und in Handybreite (390 px). Alter Look (Sonnenbrille als Accessoire, Shorts an) wird richtig umgewandelt.
- Solo-Start: Spielerfigur trägt den Look, 226 Bots mit allen 31/21/40/20/19 Varianten, keine Fehler.
- Node-Server: `cleanLook` mit gültigen, ungültigen, alten und kaputten Daten; Beitritt per WebSocket aus dem Browser, der Client bekommt die neuen Felder und zeichnet sie.
- NICHT getestet: Mehrspieler über PeerJS (nutzt dieselben Funktionen wie der Node-Server, aber nicht extra geprüft), echte Handys, Firefox/Safari. Wie die Teile im Spiel bei 150 % Zoom wirken, nur auf Screenshots gesehen.
- BUILD r52.

## Runde 53 - Menü-Sounds, Ton trotz iPhone-Lautlos-Schalter, Test-Musik als MIDI (Chopin-Stil)
Wunsch: Klick-Sounds im Menü und beim Ändern der Figur ("tob dich aus"); am iPhone 14 Pro kam mit dem Lautlos-Schalter kein Ton; eine Test-Musik als MIDI im Stil von Chopin, nur in den Einstellungen.

**Menü-Sounds** (alle über die normale Effekt-Lautstärke, "Sound off" schaltet sie mit ab)
- Jeder Knopf klickt leise. Eigene Sounds für: Fenster öffnen/schließen (auch mit Esc), Fertig/Kopieren/Nochmal, Tabs im Guide und Blättern in der Anleitung, Ein/Aus (Häkchen, Musik, Online-Frage), Schieberegler (Tonhöhe folgt dem Wert), Tippen im Namensfeld, leises Ticken beim Überfahren mit der Maus (nicht am Handy).
- Figuren-Editor: jede Zeile klingt anders, die Tonhöhe folgt der Position in der Liste. Haare schnipp-schnapp, Haut "blubb", Oberteil/Hose Stoff-Wischen, Schuhe zwei Schritte, Hut Korken-Plopp, Gesicht "boing", Extra Glöckchen. Farbfelder spielen Marimba-Töne (pentatonisch, jedes Feld ein Ton), der Farbwähler gibt die Tonhöhe nach dem Farbton. Vorne/Seite/Hinten macht ein Dreh-Geräusch. Der Vorschau-Level-Regler klingelt metallisch, wenn man über eine Freischaltung (Rüstung usw.) zieht.
- Randomize dreht jetzt wie ein Spielautomat: neun schnelle Zufalls-Looks mit Ticken, dann ein Ta-da.
- Technik: `sfx.ui*`-Funktionen; ein Klick-Zuhörer am Dokument spielt den Standard-Klick nur, wenn für dasselbe Ereignis noch kein eigener Sound lief (`sfx.uiSince(e.timeStamp)`). Perk-Karten und die Dash/Run-Knöpfe bleiben ausgenommen.

**iPhone-Lautlos-Schalter**
- Web Audio (alle Effekte) folgt am iPhone dem Lautlos-Schalter. Jetzt fragt die Seite beim ersten Tippen nach "playback"-Audio (`navigator.audioSession.type`, Safari 16.4+). Ältere iOS-Versionen bekommen eine stumme, endlos laufende Audio-Datei, die denselben Effekt hat (pausiert, wenn die Seite im Hintergrund ist).
- Bei "Sound off" geht die Seite zurück auf "auto".
- Nebenwirkung: "playback" ist am iPhone nicht mischbar. Läuft z. B. Spotify im Hintergrund, stoppt es, sobald das Spiel Ton macht. Wer Spotify hören will, schaltet "Sound off". Falls das stört: Option in den Einstellungen nachrüsten.

**Test-Musik (MIDI, Chopin-Stil)**
- `tools/nocturne.py` schreibt `music/test/nocturne_test.mid` (kein Paket nötig): eine eigene Komposition, kein Chopin-Werk. Stil: Nocturne in Des-Dur, 6/8, weite Arpeggien links, singende Melodie rechts mit Doppelschlägen und Läufen, Mittelteil in b-Moll mit Sechzehnteln und Oktaven, Kadenz-Lauf zurück, verzierte Wiederkehr, Coda über Des-Orgelpunkt mit Moll-Subdominante, Rubato als Tempo-Kurve, Pedal (CC64) bei jedem Akkordwechsel. 39 Takte, 522 Noten, etwa 1:30.
- Im Spiel: Einstellungen > Sound > "Test music" (▶ Nocturne / ■ Stop, mit Zeitanzeige). Nicht in den Playlists. Die normale Musik pausiert, solange der Test läuft. Lautstärke folgt dem Musik-Regler.
- Abgespielt mit einem kleinen Klavier-Synth im Spiel (MIDI-Leser für Typ 0/1 mit Tempo-Karte und Pedal; pro Note zwei leicht verstimmte Saiten, ein dunkler werdender Filter, ein Hammer-Klick und etwas Raumhall). Klingt nach Synth-Klavier, nicht nach Flügel. In einer DAW mit einem echten Klavier-Instrument klingt die MIDI-Datei deutlich besser.
- `tools/build.py` bettet `music/test/*.mid` in `index.html` ein (wie die mp3s).

**Getestet** (Chromium headless, Node)
- Alle Menü-Sounds per Klick, Tastatur, Regler und Häkchen ausgelöst und mitgeschrieben: der richtige Sound kommt, nichts doppelt. Anfangs schluckte ein schneller zweiter Klick seinen Sound, behoben.
- iPhone-Weg simuliert: mit `audioSession` geht der Typ auf "playback", bei Sound off auf "auto" und zurück. Ohne `audioSession` (iPhone-Gerät emuliert) startet die stumme Schleife.
- MIDI: Datei geladen, 522 Noten, 1:30 Dauer, Start/Stop/Zeitanzeige. Das ganze Stück einmal offline mit dem Spiel-Synth gerendert: keine Fehler, Spitze 0,46 (keine Übersteuerung; vorher 1,13, Lautstärke gesenkt).
- Solo-Spiel, Host-Worker und Node-Server laufen ohne Fehler.
- NICHT getestet: echtes iPhone (Lautlos-Schalter, Spotify-Verhalten), Firefox/Safari. Wie die Sounds klingen, habe ich nicht gehört, nur geprüft, dass sie ausgelöst werden.
- BUILD r53.

## Runde 54 - Ganze Musik als MIDI: Menü, Spiel, Metal ab Level 30, Duell, Game Over
Wunsch: Die Nocturne (Chopin-Stil) gefällt, sie soll automatisch laufen, solange die Einstellungen offen sind. Die eigene Musik (mp3) ersetzen und entfernen, damit das Spiel klein bleibt; MIDI ist perfekt. Stile: Menü abwechselnd Rachmaninow (Klavierkonzert 2, 2. Satz), Liszt (Liebestraum) und FF7 "Forested Temple"; im Spiel Takanaka und T-Square (5 Stücke); ab höherem Level japanischer Symphonic Metal wie Imperial Circus Dead Decadence (mehrere); Duell Persona 3 bis 5; Game Over wie "Alleycat" (Persona 5). Instrumente sollen passen, der Klavierklang bleibt.

**Stücke** (alle eigene Kompositionen im jeweiligen Stil, keine übernommenen Melodien; `music/*.mid`, zusammen ca. 400 KB)
- Einstellungen: `nocturne` (Chopin, Des-Dur) läuft, solange das Fenster offen ist; danach geht die vorherige Musik an derselben Stelle weiter.
- Menü (wechseln sich ab): `menu_adagio` (Rachmaninow: E-Dur, Klavier-Triolen, Flöten- und Klarinettensolo, Streicher-Höhepunkt mit Horn und Pauke), `menu_dream` (Liszt: As-Dur 6/4, Melodie in der Mitte, Arpeggien rundherum, zwei Kadenzen, Mittelteil in H-Dur), `menu_temple` (FF7: d-Moll, Harfen-Ostinato, Panflöte, Oboe, Chor im Mittelteil, Glockenspiel).
- Spiel: `play_coast`, `play_tropic` (Samba), `play_twilight` (Ballade) im Takanaka-Stil mit singender Overdrive-Gitarre, Slap-/Fingerbass, Rhodes, Congas/Percussion, Bläsern; `play_skyline`, `play_runway` im T-Square-Stil mit Lyricon-Lead, Synth-Brass, Klavier, Glocken und Rückung nach oben im letzten Refrain.
- Ab Level 30 (zurück erst unter 25) und als König: `high_circus` (d-Moll, Cembalo-Intro, Blastbeats, Tremolo-Gitarren, Chor, Refrain mit "Royal Road"-Akkorden, zweistimmiges Solo), `high_requiem` (e-Moll, Klavier-Prélude, 7/8-Riff mit Orgel und Chor), `high_carnival` (a-Moll, Zirkus-Walzer im 3/4, der später als Metal-Walzer zurückkommt).
- Duell: `duel_moonlit` (Persona 3: Klavier-Hook über Hip-Hop-Beat, Rock-Gitarre), `duel_fog` (Persona 4: Disco-Funk-Rock, Streicherläufe, Oktav-Slapbass), `duel_heist` (Persona 5: Acid-Jazz-Rock, Rhodes-Stabs, Altsax).
- Game Over: `dead_alley` (Alleycat-Stil: d-Moll, Rhodes, Altsax, gebürstetes Schlagzeug), läuft als Schleife.
- Die mp3s sind gelöscht (`index.html` 8,4 MB -> 1,1 MB). In der Git-Historie stecken sie noch (Umschreiben nur auf Wunsch).
- Musik ist jetzt standardmäßig AN (der Knopf "Music off" schaltet aus und merkt sich das).

**Werkzeug** (`tools/compose.py`, `tools/musiclib.py`, ohne Pakete): Akkorde mit Namen (Cmaj9, G#7/C ...), Voicings mit Stimmführung, Melodie-Notation mit Taktprüfung (ein Fehler in einer Notenlänge bricht ab), Schlagzeug-Raster, Bass-/Begleit-/Pad-/Arpeggio-Generatoren, Powerchords, Bends. `python3 tools/compose.py` schreibt alle Stücke neu, `python3 tools/compose.py play_coast` nur eins. Die Dateien sind normales General MIDI und gehen in jeder DAW auf.

**Synth im Spiel**: Ein General-MIDI-Synth ersetzt den mp3-Player: Klavier (unverändert aus r53), Rhodes (FM), Cembalo, Mallets, Orgel, Gitarren (clean, Overdrive-Lead, verzerrte Rhythmusgitarre mit Amp pro Kanal), Bässe (finger, slap, synth), Streicher, Solo-Streicher, Chor (Vokal-Formanten), Bläser, Sax, Holz, Flöten, Synth-Leads, Pads, Pauke, Schlagzeug. Lautstärke, Expression, Panorama, Pedal und Pitch-Bend kommen aus der MIDI-Datei. Wechsel mit Ausblenden, Spiel-/Menümusik läuft nach Duell oder Einstellungen an derselben Stelle weiter, im Hintergrund-Tab pausiert die Musik.

**Rechenlast** (wichtig, gefunden beim Testen): Die erste Fassung schaffte beim Metal-Stück offline nur 0,73-fache Echtzeit, hätte also live geknackst. Umgebaut: Schlagzeug wird einmal vorberechnet und dann als Sample abgespielt, Powerchords sind ein Oszillator mit passender Wellenform, Streicher/Chor/Pads/Clean-Gitarre ohne Filter pro Stimme, Vibrato nur bei Solo-Instrumenten, Filter "k-rate", kürzere unhörbare Ausklänge. Danach (offline, 48 kHz, Alis PC): Metal 3,2x, Fusion 3,4x, Duell 2,6x, Klavierstücke 8x Echtzeit.

**Lautstärke**: Alle Stücke offline gerendert und pro Kanal gemessen; Lead-Instrumente angehoben (vorher teils 9 dB unter dem Klavier), Chor im Metal gesenkt, pro Stück ein Ausgleich (`DB`), damit Menü, Spiel, Metal und Duell ähnlich laut sind (Metal bleibt etwas lauter).

**Getestet** (Chromium headless, Node)
- Alle 16 MIDI-Dateien gebaut (Taktprüfung bestanden), geparst und mit dem Spiel-Synth offline gerendert: keine Fehler, keine Übersteuerung (Spitzen 0,14 bis 0,41).
- Live im Browser: Menü startet nach dem ersten Klick mit `menu_adagio`, Einstellungen -> Nocturne, schließen -> Adagio an derselben Stelle, Spielstart -> Fusion, Level 40 (König) -> Metal, Duell -> Persona-Stil, Musik aus/an. Keine Fehler.
- Behoben beim Testen: negative Startzeit beim Fortsetzen nach Duell/Einstellungen (hätte die Musik abgebrochen).
- Gebaute `index.html` (1,1 MB), Host-Worker und Node-Server laufen ohne Fehler.
- NICHT getestet: wie es klingt (ich höre nichts, nur Messwerte); Last auf Handys und schwachen PCs; Hintergrund-Tab und Rückkehr; Rückkehr ins Spiel nach einem echten Duell-Ende (gleiche Logik wie Einstellungen -> Menü, das geprüft ist); Firefox/Safari.
- BUILD r54.

## Runde 55 - Musik-Übergänge, Hz-Anzeige, Bewertungsordner
- **Musik-Übergänge** (Menü -> Spiel, Spiel -> Duell, alle Wechsel): Die alte Musik blendet 1 s lang aus (läuft dabei weiter), danach startet die neue und blendet 0,5 s lang von leise auf die eingestellte Lautstärke ein. Vorher: schneller, im Duell fast abrupt. Das nächste Stück wird schon während des Ausblendens vorbereitet. Gemessen (Lautstärkeverlauf): Menü -> Spiel 1,19 -> 0,07 in 1,1 s, dann 0,29 -> 1,22 in 0,5 s; Spiel -> Duell genauso.
- **Hz-Anzeige**: Die Zahl ist das, was der Browser dem Spiel liefert (Bildwiederholrate der Seite), nicht unbedingt die des Monitors: bei Monitoren mit verschiedenen Raten (PC: 100 statt 280) oder im Stromsparmodus am iPhone liefert der Browser weniger. Die alte Messung lief während das Spiel zeichnete, dadurch zu niedrig. Neu: `calibHz()` pausiert die Spiel-Frames etwa 1 s (1,5 s nach dem Start und jedes Mal beim Öffnen der Einstellungen, Anzeige "measuring...") und misst mit einer leeren rAF-Schleife den Median; 200, 280, 300 und 540 Hz sind bekannte Werte. Im Menü steht ein Hinweis, warum die Zahl niedriger sein kann.
  - Getestet mit simulierter Bildwiederholrate (60, 120, 144 genau erkannt, 280 wurde als 240 erkannt, vermutlich Grenze des Timer-Simulators, nicht des Spiels). NICHT getestet: echtes iPhone 14 Pro, echte 280-Hz-Monitore. Wenn der Browser wirklich nur 100 Hz liefert (Windows mit gemischten Monitoren richtet sich oft nach dem Hauptmonitor), kann das Spiel das nicht ändern: Spiel-Fenster auf den 280-Hz-Monitor und diesen als Hauptmonitor setzen, oder in Windows beide gleich einstellen. Am iPhone: Stromsparmodus aus.
- **Bewertung**: Ordner `bewerten/` (nicht im Git) mit den 16 MIDI-Stücken nummeriert und `bewertung.md` als Tabelle für Note und Änderungswünsche.
- BUILD r55.

## Runde 56 - Feedback zu den 16 Stücken
Ali hat alle Stücke in Windows' eingebautem MIDI-Synth (Microsoft GS Wavetable, `gm.dls`) angehört. Dort klingen sie gut, im Spiel mit dem eigenen Synth schlechter.
- **Neue Zuordnung:** Charakter-Editor `play_coast`; Anleitung `play_twilight`; Spiel `play_tropic`, `play_skyline`, `play_runway` (die beiden "perfekten"); Hauptmenü bis auf Weiteres `play_tropic`, `play_runway`; Game Over `dead_alley` + die drei traurigen Menüstücke (Adagio, Liebestraum, Tempel); Duell `high_circus` + Moonlit + Fog + Heist; ab Level 30 / König `high_requiem`, `high_carnival`.
- **Overworld-Metal langsamer:** Requiem 184 -> 138 BPM, Carnival 208 -> 150 BPM, Blastbeats durch Double-Bass-Beat ersetzt, Melodien unverändert.
- **Kampfmusik beginnt sofort:** Die ersten 4 Takte (Intro) von `high_circus`, `duel_moonlit`, `duel_fog` sind abgeschnitten, ab der ersten Note spielen 4-8 Stimmen. Heist behält das Bass-Intro (gefiel).
- **Sax ersetzt:** In `duel_heist` und `dead_alley` spielt statt des Saxofons der Lead (GM 81), den Ali bei Skyline/Runway mochte. Das Saxofon des Spiel-Synths war nicht gut genug.
- Die Nocturne ("komische Wirbel") bleibt vorerst, Stelle erfragt.
- **Offen: Soundfont.** Das Spiel hat einen selbstgebauten Synth, Windows hat Roland-Samples (`gm.dls`, 3,4 MB, nicht weitergebbar). Optionen sind in der Antwort an Ali beschrieben.
- Bewertungsordner `bewerten/` neu sortiert. BUILD r56.

## Runde 57 - Echte Instrument-Samples (SoundFont) und drei neue Stücke
Ali hört die MIDI-Dateien mit dem Windows-Synth (Roland-Samples, `gm.dls`), im Spiel klang der eigene Synth schlechter. Windows' Klänge dürfen nicht mitgeliefert werden und gibt es auf iPhone/Mac nicht. Entscheidung: ein freies SoundFont mitliefern.
- **Soundfont:** GeneralUser GS 2.0.3 (S. Christian Collins), klingt dem GS-Klang von Windows ähnlich. Aus den 32 MB sind nur die von den Songs genutzten Instrumente (34 Programme) und Schlagzeug-Töne (22) übrig, 385 Samples, als 4-Bit-ADPCM (SNR bei Klavier/Flöte/Streicher 37-47 dB, bei verzerrter Gitarre und Klick-Trommeln um 14 dB, was bei rauschartigen Klängen nicht stört): **4,2 MB** (`music/gm.sf`). `index.html` ist damit 6,6 MB (vorher 1,1 MB). Gebaut mit `tools/sfbuild.py`, das die MIDI-Dateien nach den benutzten Instrumenten durchsucht.
- **Lizenz:** frei auch kommerziell nutzbar, aber der Autor schreibt, dass er die Herkunft einiger Samples nicht zu 100 % belegen kann (bisher nie eine Beschwerde). Für Werbung/Shop/Steam muss Ali entscheiden, ob er das Risiko eingeht (Eintrag in `THIRD_PARTY.md`, Lizenz in `tools/LICENSE-GeneralUser-GS.txt`).
- **Spieler im Browser:** SoundFont-Sampler mit Tastenzonen und Anschlagstärke-Schichten, Schleifen, Hüllkurve, Tiefpass, Stereo, Pedal und Pitch-Bend. Der alte eingebaute Synth bleibt als Notlösung, falls die Datei nicht lädt. Lautstärke: jedes Instrument auf gleiche Lautheit gemessen (`TRIM`), jedes Stück auf ähnliche Gesamtlautstärke (`DB`); Bass und Schlagzeug etwas leiser im MIDI-Mix, Leads vorn.
- **Rechenlast:** Metal rechnet jetzt 3,3x Echtzeit (Offline, Alis PC), Duell 7x, Menü bis 15x; dafür spielt die Metal-Rhythmusgitarre nur noch einmal (das SoundFont liefert die Breite selbst), das halbiert die Stimmen.
- **Drei neue Stücke:** `play_sunrise` (T-Square-Stil, A-Dur, 140 BPM), `play_harbor` (Takanaka-Stil, G-Dur, funky, 108 BPM), beide im Spiel; `menu_welcome` (ruhig und hell, C-Dur, Nylon-Gitarre, Flöte, Vibraphon) im Hauptmenü, abwechselnd mit der Samba. Im Spiel laufen jetzt 5 Stücke.
- Beim Testen gefunden und behoben: Meine Messung lief beim ersten Stück noch mit dem alten Synth, deshalb waren zwei Lautstärkewerte falsch.
- **Getestet:** Sampler offline gerendert (alle 19 Stücke, Pegel und Geschwindigkeit), Moduswechsel live im Browser. NICHT getestet: wie es klingt; Handy-Speicher (alle Samples decodiert ca. 33 MB); echtes iPhone.
- BUILD r57.

## Runde 58 (BUILD r59) - Klavier und Bass wie im Original-SoundFont, V-Sync, Zoom, Kartenrand, Perks
Feedback von Ali: Klavier nervig wie ein hoher Synth, Bass schwammig statt knackig (Slap); Hz-Anzeige falsch; Zoom lässt das Bild weiß aufblitzen und zittern; Kartenrand zeigt einen Streifen Boden außerhalb; Host-Step und "Monitor X Hz" weg; "Network delay" falsch beschrieben; Perks, die Wörter sparen, kommen viel zu leicht.
- **Klang:** Die Ursache war messbar. Ich habe eine Referenz gebaut (`spessasynth_core`, ein fertiger SoundFont-Player) und dasselbe Stück damit und mit meinem Sampler gerendert, dazu das Windows-`gm.dls`. Mein Sampler war bei Klavier und Bass im Bereich 1,5-4 kHz um 15 bis 27 dB dunkler als die Referenz: GeneralUser GS öffnet den Filter mit Modulatoren (Anschlagstärke und Tonhöhe) und einer Filter-Hüllkurve (bis 8800 Cent beim Slap-Bass). Das hatte ich ignoriert, deshalb klang es dumpf. Jetzt eingebaut (`MODF`, Filter folgt der Modulationshülle, Dämpfung nach Anschlagstärke aus den Modulatoren statt meiner Näherung). Ergebnis in den Bändern: Klavier, Slap- und Finger-Bass liegen jetzt innerhalb von 0,3 bis 1 dB der Referenz, Gitarren, Streicher, Flöte, Blech waren schon gleich. Pick-Bass und E-Piano sind etwas heller als die Referenz.
- **Bass:** Slap-Bass (GM 36) statt Fingerbass in `play_tropic`, `play_harbor`, `duel_heist` (Balladen und Menü bleiben beim Fingerbass).
- **Klavier:** Begleit-Akkorde eine Oktave tiefer (Mitte G3 statt F#4) und leiser, weil hohe Klaviertöne dünn und "plinkend" klingen; Melodien bleiben.
- **Lautstärke:** Jedes Instrument und jedes Stück neu vermessen; zusätzlich ein Limiter am Ende der Musik-Kette, damit Beckenschläge und Slap nie übersteuern.
- **V-Sync:** "Match monitor refresh rate" ist weg. Neu: Häkchen "V-Sync" (standardmäßig aus) und das Limit steht standardmäßig auf 240 FPS, am Handy 120. Mit V-Sync an zeigt das Menü "(your screen: X fps)", das Spiel misst es selbst (Hinweis: der Browser liefert dem Spiel manchmal weniger als der Monitor kann). Alte Einstellungen werden übernommen (0 wurde 240). "Monitor X Hz" und "Host step" in den Details sind entfernt, "Network delay" heißt "Ping (delay to the host)". Hinweis: 240 FPS auf einem 60-Hz-Bildschirm rendert 4x so viele Bilder wie nötig; wer einen schwachen PC hat, schaltet V-Sync an.
- **Zoom:** Beim Zoomen wurde die Zeichenfläche bei jedem Schritt neu gesetzt (das löscht das Bild, deshalb das weiße Aufblitzen und Zittern). Jetzt ändert sich nur der Zoomfaktor. Getestet: 25 Zoomschritte setzen die Breite 0 Mal neu.
- **Kartenrand:** Die letzten Boden-Kacheln ragten bis zu 49 Einheiten über den Rand. Der Boden wird jetzt auf das Spielfeld beschnitten.
- **Perks:** `short`, `warm`, `underdog` jetzt Epic (halb so oft, nur 1 Rang), `head`, `forgive`, `plunder` Epic, `curse` Legendary (`site/config.js`). Typist-Karten zeigen damit meist nur noch Bounty oder Plunder; die starken Duell-Vorteile erscheinen nur bei Epic/Legendary-Karten (9 % und 3 %, Legendary erst ab 4 Punkten im Baum). Falls das zu hart ist: Stufen in der Datei ändern.
- NICHT getestet: wie es klingt (ich höre nichts, nur Messwerte gegen die Referenz); Ali hat zwei Kartenränder gemeint, links/rechts: nur rechts/unten war ein sichtbares Problem, links nicht reproduziert; Zoom-Aufblitzen auf echten Geräten; V-Sync-Anzeige auf iPhone und 280-Hz-Monitor.

## Runde 59 (BUILD r60) - Menümusik-Fehler, weniger Spieler, Leistung, große Karte, HUD
- **Fehler Menümusik:** Nach "Settings > Close" spielte die Spielmusik, weil `play_tropic` in der Menü-Liste stand. Das Hauptmenü spielt jetzt nur `menu_welcome`. Getestet: Menü -> Settings (Nocturne) -> Close -> wieder Menü.
- **Weniger Spieler:** `players.bots` 240 -> 100, `botRespawn` 2 -> 1. Gemessen mit dem Server-Simulator: 97 bis 101 Spieler auf der Karte statt etwa 165. Zahlen in `site/config.js` änderbar. (Ali schrieb "keine vierzehn Spieler... ein bisschen mehr": als "normal voll" gedeutet, nicht übervoll.)
- **Leistung:** Profil (Chrome-Profiler, 8 s Spiel): Der Spiel-Code selbst ist klein (unter 5 % der Zeit), aber bei Limit 240 auf einem Bildschirm mit weniger Hz lief eine Zusatzschleife (Nachrichten-Kanal), die mehr Bilder zeichnete, als der Bildschirm anzeigen kann, und die Kerne wach hielt (etwa 11 % der Zeit, dazu das Zeichnen). Diese Schleife ist abgeschaltet: pro Bildschirm-Aktualisierung genau ein Bild, nie mehr. Leerlauf stieg von 45 % auf 75 %. Das Limit wirkt nur noch, wenn es unter der Bildschirmrate liegt; sonst steht im Menü ein Hinweis. Am Handy außerdem Musik-Sparmodus (`LITE`): eine Stimme pro Stereopaar, kein Raumhall, Filter nur wo der Klang sie braucht (etwa 1,6-fach schneller als vorher). Grafik unverändert.
- **Große Karte (M oder Klick auf die Minikarte):** wird jetzt in 1000 Pixel gezeichnet: weiche Biom-Farben, Raster (ein Feld = ein Zehntel), Teiche mit Ufer, Bäume in Biomfarben, jedes Gebäude mit Dach, Schatten und Symbol (Burger, Pizza, Bibliothek ...). Die kleine Karte unten rechts bleibt wie sie war.
- **HUD:** Die Figur läuft weiter, wenn die Maus über der Anzeige unten links liegt (vorher blieb sie stehen). Getestet: 246 Einheiten in 1,5 s mit der Maus auf dem HUD.
- NICHT getestet: Wärme am Handy, GPU-Last am echten PC (nur Profil im Headless-Browser), Touch-Sparmodus klanglich.

## Runde 60 (BUILD r61) - FPS-Limit wieder frei, Logo, zoombare Karte
- **FPS-Limit:** Das Limit lässt sich wieder beliebig von 30 bis 1000 einstellen und die Anzeige folgt (gemessen im Headless-Browser: 30 -> 31, 99 -> 99, 300 -> 301, 1000 -> 583, die Software-Grafik schafft nicht mehr). Damit das Spiel nicht immer unnötig Bilder zeichnet, gilt das nur, wenn man den Regler selbst bewegt hat (`fpsUser`). Unberührt steht dort "auto": ein Bild pro Bildschirm-Aktualisierung, kühl. Mit Regler über der Bildschirmrate erscheint ein Hinweis, dass das mehr Strom braucht.
- **Logo:** Keks mit Biss und einem T (Tippen + Biss), passend zum alten App-Symbol. Quelle `tools/brand/mark.svg`, erzeugt mit `node tools/makebrand.js`: Favicon (SVG, 32/64 PNG, ICO) für den Browser-Tab, Apple-Touch-Icon (iPhone-Startbildschirm), App-Symbole 192/512 für Android (`manifest.webmanifest`, auch als maskierbare Symbole), und ein Vorschaubild 1200x630 (`site/og.png`) für WhatsApp, Discord, Twitter usw. (Open-Graph- und Twitter-Karten-Tags im Kopf). Das Banner zeigt Name, Spruch und vier Figuren plus Snacks aus dem Spiel selbst. Der Name oben links im Spiel und der Titel im Menü haben jetzt das Keks-Symbol davor. Nicht final, nur ein erster Entwurf.
- **Karte zoomen:** Mausrad, + und - oder die Knöpfe oben rechts auf der großen Karte; ziehen verschiebt, zwei Finger zoomen am Handy; ◎ springt zur eigenen Figur, ✕ schließt, 0 setzt zurück. Je weiter hinein, desto mehr Details: ab 2x echte Bäume statt Punkten, Gebäude mit Boden, Wänden, Türen und Namen, andere Spieler als Punkte (rot = stärker, grün = schwächer); ab 3x der echte Boden des Spiels mit seinen Verzierungen; ab 3,5x Snacks (nach Seltenheit gefärbt); ab 4x Namen und Level der Spieler. Solange die Maus auf der großen Karte liegt, läuft die Figur nicht dorthin.
- Getestet im Browser: Zoom per Mausrad auf 8,7x, Ziehen, Schließen-Knopf, Screenshots bei 2x und 4,5x. NICHT getestet: Pinch am echten Handy, Vorschau in WhatsApp (braucht die Seite online mit dem neuen `og.png`; manche Apps merken sich alte Vorschauen).

## Runde 61 (BUILD r62) - Bass lauter
Ali: Bass sehr gut, aber lauter. `TRIM` für alle Bässe (Finger 33, Pick 34, Slap 36, Synth 38) um 7 dB angehoben (etwa 2,2-fache Amplitude); der Limiter am Ende der Musik-Kette fängt Spitzen ab. Die Gesamtlautstärke pro Stück (`DB`) bleibt, die Stücke werden dadurch insgesamt etwas lauter. Wenn es zu viel ist: die Zahlen in `TRIM` senken.

## Runde 62 (BUILD r63) - Vorbereitung öffentliche Alpha
- Online-Spiel ist immer an. Entfernt: Einwilligungsfeld "Play online with friends?", "Friends: room and server options" (Raum, Server-Adresse, Online-Schalter; die Elemente bleiben versteckt im Code). Der alte Test-Schalter ist jetzt `window.SNACK_OFFLINE=1` bzw. `?offline=1` (die Tests setzen ihn).
- Im Menü steht ein gelber ALPHA-Hinweis (Fehler möglich, neue Items/Perks/Karten/Skins kommen, PeerJS sieht die IP, Link zur Datenschutzseite), unten "Alpha · Build r63".
- `site/datenschutz.html` angepasst: kein "nur nach Einwilligung" mehr, Rechtsgrundlage Art. 6 Abs. 1 lit. b und f DSGVO, Widerspruch per Schließen oder E-Mail. VON MIR UMGESCHRIEBEN, NICHT VON EINEM ANWALT GEPRÜFT. Offene Frage (Datenschutz): Das Spiel meldet sich beim Öffnen des Menüs beim PeerJS-Dienst (USA). Wer das ohne Zustimmung vermeiden will, braucht einen eigenen Vermittlungsserver (steht in docs/release-plan.md).
- Getestet: Menü ohne die entfernten Teile, Spielstart bei nicht erreichbarem Vermittlungsdienst (Spiel startet sofort und hostet selbst), Worker/Musik/Modi. NICHT getestet: echtes Mehrspiel über den öffentlichen PeerJS-Dienst (aus der Sandbox nicht erreichbar), Beitritt von zwei echten Geräten.

- (r63, Nachtrag) ALPHA-Hinweis auf Alis Wunsch gekürzt: "This game is still being built: expect bugs. Items, perks, maps and skins are coming." Cookies: keine nötig. Das Spiel setzt keine Cookies, nur Einstellungen im lokalen Speicher des Browsers (technisch notwendig, in Österreich nach § 165 Abs. 3 TKG 2021 ohne Einwilligung erlaubt); Seite, Konfigurationsdatei, Bilder und Fehlerdienst senden keinen Set-Cookie-Header (geprüft). Ein Cookie-Banner wird erst nötig, wenn Werbung oder Analyse dazukommt.

## Runde 63 (BUILD r64) - Host-Wechsel ohne Absturz
Ali hat das Spiel über Discord getestet: Als der Host das Spiel verließ, hing es bei dem Mitspieler. Jetzt übernimmt automatisch der Mitspieler mit dem besten Ping.
- **Ablauf:** Alle drei Sekunden schickt der Host jedem Spieler die Reihenfolge der Nachfolger (bester Ping zuerst; die Spieler melden ihren Ping beim Host) und dem besten Kandidaten eine Kopie des Spiels (Spieler komplett mit Level, Items, Perks und Position, Bots gekürzt, Snacks und Boxen kompakt; etwa 60 KB in kleinen Stücken, jedes vierte Mal auch an den Zweiten). Geht der Host weg (Menü, Tab zu: er sagt "bye"; oder die Verbindung bricht ab; oder 3,5 Sekunden lang kommt nichts, z. B. ein hängender Tab), startet der erste Kandidat im eigenen Browser einen neuen Server mit derselben Welt und der gespeicherten Uhr, die anderen verbinden sich zu ihm und bekommen ihre Figur zurück (gleicher Schlüssel). Der neue Host registriert den Lobby-Namen für Neue, so steht das Spiel weiter in der Liste.
- **Was man merkt:** kein Ladebildschirm, die Welt bleibt, Figuren und Level bleiben, kurz eine Meldung "The host left. The game goes on.". Ein Duell, das gerade lief, wird abgebrochen; die letzten bis zu drei Sekunden gehen verloren; Spieler, die nicht innerhalb von 25 Sekunden zurückkommen, werden entfernt. Tote Spieler (Todesbildschirm) kehren ins Menü zurück. Ein Server mit `start-server` hat keinen Wechsel.
- **Getestet** (lokaler PeerJS-Vermittler, drei Browserfenster Host, Anna, Ben): Host schließt die Seite -> Anna (bester Ping) ist nach 1,5 s Host, Ben verbindet sich, gleiche Welt, gleiche Figuren-Nummern, kein Ladebildschirm, ein Neuer sieht "Anna's game" in der Liste. Host verlässt über das Menü: genauso. Host-Tab hängt 30 s: Wechsel nach etwa 4,5 s. Zweimal hintereinander (der neue Host geht auch): der Übrigbleibende wird Host, gleiche Welt. Im Simulator: Level 7,3, Item, Perk, Position und Siege bleiben nach Wiederherstellung erhalten; ein Fremder mit falschem Schlüssel bekommt eine neue Figur. Gefundene und behobene Fehler: Nachrichten über etwa 16 KB gehen im Datenkanal ohne Fehler verloren (jetzt kleine Stücke); ein toter Kandidat kostete 9 s (jetzt sofort der nächste); ein Absturz beim Verabschieden.
- NICHT getestet: über das echte Internet (nur lokal), mit mehr als drei Spielern, mit schlechtem Netz; das Spiel danach hat den neuen Host als Engpass (sein Upload).
- Nebenbei: Der Node-Server ist durch die r63-Änderung kurz abgestürzt (`location` fehlte), behoben.

- (r65) ALPHA-Hinweis im Menü um einen Satz ergänzt: "All of the OST in this game is made with MIDI."

## Runde 66 (BUILD r66) - Aktivitätszähler und Warn-Mail
Ali wollte per Link sehen, wie viele Leute gerade aktiv sind, und eine Mail bekommen, wenn etwas überlastet ist (keine feste Spielerzahl als Grenze).
- **Spiel:** Jeder offene Tab schickt etwa einmal pro Minute einen anonymen Herzschlag (`hbSend`): zufällige Tab-Kennung, Version, Menü oder Spiel, Rolle (Host/Client/Solo), Spieler in der Runde, Schrittzeit des Hosts, Ping. Der Zähler antwortet mit dem nächsten Abstand (wird länger, wenn der Tag voll wird). Kein Herzschlag von localhost, von Testbrowsern (`navigator.webdriver`) und vom Node-Server.
- **Zähler** (`tools/stats-worker/`, Cloudflare Worker + Durable Object): zählt aktive Tabs, Spitze, Tabs und "im Spiel" pro Tag (30 Tage), Seite `/?k=SCHLÜSSEL` (aktualisiert sich selbst), `/json`, `/test` (Testmail). Ein Durable Object fliegt wenige Sekunden nach der letzten Anfrage aus dem Speicher, deshalb wird jeder Tab sofort gespeichert (die erste Version hat das verloren, im Test aufgefallen). Einrichtung: `docs/statistik.md`.
- **Überlastet heißt** (Zahlen oben in `worker.js`): (1) ein Host schafft die 60 Schritte pro Sekunde nicht (Schrittzeit über 14 ms, 3 Minuten in Folge), (2) die Verbindungen sind langsam (mittlerer Ping der Clients über 500 ms bei mindestens 3 Clients), (3) das Gratis-Tageslimit von Cloudflare wird knapp (40000 von etwa 50000 Herzschlägen). Je Art höchstens eine Mail alle 3 Stunden.
- **Datenschutz:** Abschnitt 6 und Kurzfassung angepasst (anonymer Aktivitätszähler, nur Tageswerte bleiben). Nicht von einem Anwalt geprüft.
- **Getestet** (lokal mit `wrangler dev`): Herzschläge mit 6 Tabs, genaue Zähler nach dem Auswerfen des Objekts, Warn-Mail "Verbindungen langsam" nach 1 Minute, "Host überlastet" nach 3 Minuten, Testmail (als .eml-Datei erzeugt), Seite ohne Schlüssel = 403, ungültige Anfragen = 400; das echte Spiel (`index.html`) meldet sich beim lokalen Zähler (Menü-Tab und Spiel-Tab), ein Testbrowser ohne Hook sendet nichts. NICHT getestet: echtes Cloudflare (Deploy, Email Routing, ob die Mail im Postfach oder im Spam landet), echte Spieler, Zähler unter Last, die Seite im Browser angesehen (nur HTML erzeugt).
- (r66, Nachtrag) Statusseite fürs Handy (`tools/stats-worker/page.html`): Spieler online, Ampel, Auslastung in Prozent (Host-Rechenzeit, Ping, Tageslimit; 100 % = Grenze der Warn-Mail), Verlauf 6/24/48 h (alle 5 Minuten ein Punkt, im Durable Object gespeichert), Hosts mit Last, letzte Tage, Versionen, Warn-Mails; lädt alle 15 s selbst nach. Lokal im Handyformat angesehen (dunkel), mit künstlichen Spielern getestet, dann auf Alis Cloudflare veröffentlicht (Seite 200, ohne Schlüssel 403). NICHT getestet: helles Design, Verlauf über viele Stunden, echte Spieler.

## Runde 67 (BUILD r67) - öffentliche Statusseite
Ali wollte die Statusseite unter typebite.io/status, für alle sichtbar, und einen Link im Menü unten neben Impressum.
- `site/status.html` (erzeugt von `tools/stats-worker/make-status.js` aus `page.html`): gleiche Seite im öffentlichen Modus, holt die Daten vom Worker-Endpunkt `/public` (ohne Hosts, Versionen, Warn-Mails; 15 s im Cache). Der private Link mit Passwort zeigt weiter alles.
- Menü: Link "Status" neben Impressum und Datenschutz.
- Seite lädt beim Zurückkommen in den Tab sofort neu und pausiert im Hintergrund.
- **Getestet** (lokal, Handyformat): öffentliche Seite lädt die Zahlen und blendet Hosts/Versionen aus, `/public` enthält keine Hosts/Builds/Mails, privater Link und 403 ohne Passwort unverändert. NICHT getestet: auf dem echten typebite.io, die Seite hell, viele gleichzeitige Besucher.

## Runde 68 (BUILD r68) - Play tritt laufenden Spielen bei, Lobby-Anzeige, genauere Statusseite
Ali: (1) die Statusseite soll sich jede Sekunde aktualisieren, ohne nach oben zu springen; (2) beim Spielen und Neuladen der Seite passiert nichts mit der Spieleranzahl; (3) Play soll einer laufenden Lobby beitreten statt eine neue zu öffnen, und man soll sehen, in welcher Lobby man ist.
- **Statusseite:** fragt jede Sekunde ab (nach 5 Minuten ohne Bedienung alle 10 s, im Hintergrund-Tab pausiert), zeichnet nur neu, was sich geändert hat (Tabellen, Verlauf), also kein Flackern und die Scroll-Position bleibt. Der öffentliche Endpunkt `/public` ist nur 2 s im Cache (vorher 15 s).
- **Zähler:** Das Spiel meldet sich auch aus Hintergrund-Tabs (vorher nicht: wer zur Statusseite wechselte, galt nach 2 Minuten als weg), sofort bei jedem Moduswechsel (Play gedrückt, Host geworden; vorher erst mit dem nächsten Minuten-Herzschlag) und mit einem Abschied (`{bye:1}`, sendBeacon bei `pagehide`), der den Tab sofort aus der Zählung nimmt. Der Zähler nimmt einen Moduswechsel auch innerhalb der 15 s Mindestabstand an.
- **Play:** Die Lobby-Liste im Menü wird alle 5 s erneuert und konnte beim Klick alt oder leer sein (dann wurde eine zweite Lobby aufgemacht, mit dem alten Stand r65 im Test nachgestellt: zwei Hosts). Jetzt scannt Play sofort (`pollOnline(true)`) und noch einmal, bevor es selbst hostet. Und wenn beim Registrieren der Lobby-Name schon belegt ist, während man noch allein ist und gerade erst gestartet hat, gibt man die leere Welt auf und tritt dieser Lobby bei (`joinInstead`, einmal pro Play).
- **Anzeige:** `#lobbytag` unter dem Logo: 'Lobby 2 · Anna's game · 5 players', 'Lobby 1 · your game · 1 player' oder 'Solo game' (Touch: oben links, kleiner).
- **Getestet** (lokaler PeerJS-Vermittler, 3 Browser): Host fertig gestartet, zweiter Tab drückt sofort Play -> 3 von 3 Läufen treten bei (1 Host); gleichzeitiger Start zweier Spieler -> 3 von 3 Läufen genau 1 Host (einmal über `joinInstead`); Lobby-Anzeige mit 2 bzw. 3 Spielern; Host-Wechsel (r64) läuft weiter (Test 'bye'); Statusseite 10 Abrufe in 10 s, Scroll-Position und Höhe unverändert, 0 DOM-Änderungen bei gleichen Daten; `bye` und Moduswechsel am Zähler. NICHT getestet: über das echte Internet und den öffentlichen PeerJS-Dienst, mit langsamem Vermittler, auf dem Handy, `joinInstead` bei einem Host, der inzwischen weg ist (dann startet man nach dem Fehlversuch wie vorher eine eigene Lobby).

## Runde 69 (BUILD r69) - FPS-Anzeige stabil, automatische FPS-Grenze
Ali: Bei Limit 60 gehen die FPS bis 70 und es ist nicht stabil; danach eine automatische Einstellung nach einer Minute; Frage, ob ein Host 10 Spieler schafft; Host-Wechsel soll ohne Pause und Verlust klappen.
- **Ursache der "70":** Die Anzeige mittelte 1/Bildzeit. Bei einem Bildschirm, dessen Wiederholrate kein Vielfaches des Limits ist (100 Hz, Limit 60: Bildabstände 10 und 20 ms), springt das nach oben (gemessen 65 bis 69). Der Limiter selbst war im Mittel immer genau (60, 120, 240 über 10 s gezählt, Bildschirm 60/100/144/240 Hz nachgestellt). Jetzt zeigt die Anzeige die Bilder der letzten Sekunde: gemessen 59 bis 60 bei Limit 60 und 120 bis 121 bei Limit 120.
- **Was bleibt:** Bei Bildschirmraten, die kein Vielfaches des Limits sind, sind die Bildabstände ungleich (Standardabweichung 4 bis 5 ms bei 100 Hz und Limit 60). Das kann kein Limiter im Browser ändern. Die Einstellungen zeigen jetzt "Even rates" (Bildschirmrate, halbe, drittel, viertel), der Regler rastet darauf ein.
- **Automatische Grenze:** `autoFps` in `site/config.js`. Nur beim ersten Mal pro Browser, nach 60 s Spiel, nur wenn der Durchschnitt über 60 und unter 240 liegt, nicht schon im Takt des Bildschirms ist (Durchschnitt innerhalb 4 % der Bildschirmrate) und der Spieler weder ein Limit noch V-Sync selbst gewählt hat: Limit 120 und eine Meldung. Beurteilt nur nach dem Durchschnitt (keine 0,1-%-Lows).
- **Host-Last:** 100 Bots + N Spieler im Node-Simulator (Schritt + JSON): 1 Spieler 0,87 ms (6 % von 14 ms), 4: 1,17 ms, 8: 1,58 ms, 12: 1,97 ms (14 %), Upload des Hosts 57 / 194 / 374 / 616 KB/s. Im Browser-Worker ist der Schritt etwa 2,5-mal so teuer (Statusseite: 16 % bei einem Spieler), 12 Spieler also rund 35 %. Der Upload (bis etwa 5 Mbit/s bei 12 Spielern) ist die eigentliche Grenze und steckt NICHT in der Auslastung der Statusseite.
- **Host-Wechsel gemessen** (lokal, 3 Browser, Host mit Spielern, die laufen): Host schließt den Tab oder drückt Leave -> längste Pause ohne Weltdaten bei den Spielern 0,15 bis 0,19 s, gleiche Figuren-Nummern, Level und Position laufen weiter, genau ein neuer Host. Nur ein laufendes Duell wird abgebrochen. Stürzt der Host ab oder friert er ein: etwa 4 s Pause (3,5 s Erkennung), bis zu 3 s Spielstand gehen verloren.
- **Getestet:** siehe oben (Playwright, nachgestellte Bildwiederholrate; die Messung mit einer künstlichen Bildwiederholrate hat selbst etwas Zeitrauschen). NICHT getestet: echter 100/144/165-Hz-Monitor, Handy.

## Runde 70 (BUILD r70) - Host-Wechsel auch beim Absturz schnell
Ali: Auch wenn der Host abstürzt oder einfriert, soll der Wechsel sofort passieren (vorher etwa 4 s Pause und bis zu 3 s Spielstand weg).
- **Erkennung:** Stille vom Host für `network.hostSilence` = 1,2 s statt 3,5 s, alle 250 ms geprüft. Kein Fehlalarm, wenn der eigene Tab gerade hing (Welt bauen, aufwachen): dann wird die Uhr zurückgesetzt.
- **Vorbereitete Verbindung:** Jeder Spieler hält schon eine Leitung zum ersten Nachfolger (`standbyLink`). Der Nachfolger übernimmt diese Leitungen samt dem, was darüber schon ankam, wenn er Host wird. Beim Wechsel wird nichts mehr aufgebaut (Rückfall auf das alte Verbinden nach 2,5 s).
- **Sicherungen:** `network.checkpointsPerSecond` = 2 statt alle 3 s (Kopie 60-90 KB, 1 ms Rechenzeit, bei mehr als 6 Spielern jedes zweite Mal), der zweite Kandidat jede achte.
- **Gemessen** (lokal, 3 Browser, Host eingefroren bzw. Renderer hart beendet, alt = r69 gegen neu): Pause bei den Spielern Einfrieren 4,5 s -> 1,5 s, Absturz 4,7 bis 7,5 s -> 1,65 s; Figuren, Namen, Level bleiben, genau ein neuer Host; der Nachfolger bekommt 10 Kopien in 5 s; 30 s ruhiges Spiel ohne Fehlalarm (größte Lücke 0,08 s); normales Verlassen unverändert gut. Verlust: höchstens die letzte halbe Sekunde (einmal fehlte der zuletzt gegessene Snack).
- **Grenzen:** Eine echte Pause von null geht beim Absturz nicht, weil niemand sofort wissen kann, ob der Host tot oder nur langsam ist; 1,2 s ist der Kompromiss (ein Host, der kurz länger hängt, löst einen Wechsel aus; `hostSilence` in `site/config.js`). Duelle in Arbeit werden weiter abgebrochen. NICHT getestet: über das echte Internet, mit 12 Spielern, Handy als Host.
