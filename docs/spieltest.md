# Spieltest-Anleitung (ab Build r32)

Ziel: 5-10 Leute auf verschiedenen Geräten und Browsern, Fehler sammeln, danach Balancing nach den Rückmeldungen.

## Vorbereitung
- **Alle brauchen dieselbe `index.html`.** Die Build-Nummer steht im Menü unten (z. B. "Build r32"). Nach jeder neuen Version die Datei allen neu schicken. Wer eine alte Datei hat, bekommt beim Beitreten eine Versions-Meldung.
- **Eigener Raumname** für die Testgruppe, z. B. `test1`. Jeder trägt ihn im Menü unter "Friends: room and server options" ein. So landet niemand in einer fremden Lobby.
- **Host:** der stärkste PC, am besten mit LAN-Kabel. Der Host lässt den Tab offen und im Vordergrund. Schließt er ihn, ist das Spiel für alle vorbei. Bei 8 oder mehr Spielern auf Ruckler achten (Lobby-Maximum 12).
- Vor dem Test nichts erklären. Beobachten, wo die Leute hängen bleiben, ist die wertvollste Information.

## Ablauf einer Runde (ca. 40 Minuten)
1. **10 Min. allein** (Play ohne Raumname oder "or play alone"): erster Eindruck ohne Hilfe.
2. **20-25 Min. zusammen** in einer Lobby mit Raumname.
3. **5 Min. Fragen** (siehe unten), Antworten sammeln.

## Testaufgaben (abhaken)
- [ ] Menü: Name eingeben, Customize, How to play, Guide öffnen
- [ ] Allein: bis Lv 5 essen, Perk mit 1/2/3 wählen, ein Item mit Q/W/E benutzen
- [ ] Duell gegen einen Bot gewinnen und eins verlieren
- [ ] Zusammen: Join über die Lobby-Liste, Duell gegen einen Freund
- [ ] Nach dem Tod mit Enter neu starten
- [ ] Zoom (Mausrad, + / -), Sound und Musik aus und an, Fenstergröße ändern, Vollbild (F11)
- [ ] Lange Runde: 20+ Minuten, möglichst Lv 30+ (Balancing bei hohen Levels)
- [ ] Host verlässt das Spiel: was sehen die anderen?

## Browser- und Gerätematrix
Möglichst jede Zeile mindestens einmal abdecken:

| Gerät / System | Browser | Tester | Läuft? | FPS (aus Bericht) | Probleme |
|---|---|---|---|---|---|
| Windows-PC | Chrome | | | | |
| Windows-PC | Edge | | | | |
| Windows-PC | Firefox | | | | |
| Mac | Safari | | | | |
| Mac | Chrome oder Firefox | | | | |
| Schwacher Laptop (Office, alt) | beliebig | | | | |
| Host mit 6+ Spielern | beliebig | | | | |

Safari: ab Version 16 sollte alles gehen, 14-15 wurde mit r31 vorbereitet (Ersatz für `roundRect`), ist aber ungetestet. Handys gehen nicht (nur Tastatur).

## Fehler melden
- **Automatisch:** Sobald der Fehler-Upload eingerichtet ist (`docs/fehler-upload.md`), landet jeder Fehler ohne Zutun im privaten Repo `smackdown-errors`. Das steht dann auch im Menü. Testern vorher sagen.
- **Im Spiel F8 drücken:** ein Bericht wird gesendet (mit Upload) und in die Zwischenablage kopiert. Gut für Dinge, die kein Fehler im Code sind (Ruckeln, Lag, komisches Verhalten): kurz in den Chat schreiben, was passiert ist.
- **Im Menü "Report a problem":** Feld für die Beschreibung, dann "Send report" (ohne Upload: "Copy report").
- **Rote Leiste unten:** "Copy bug report" drücken.
- Wenn möglich zusätzlich ein Screenshot (Windows: Win+Shift+S, Mac: Cmd+Shift+4).
- Der Bericht enthält Build, Browser, Bildschirm, Modus (Host/Client/Solo), FPS, Ruckler und die letzten Fehlermeldungen. Spielernamen und Dateipfade werden nicht mitgeschickt.

## Fragen nach dem Spielen
1. Was hat am meisten Spaß gemacht? Was hat genervt?
2. Hast du ohne Erklärung verstanden, wie Duelle funktionieren? Was war unklar?
3. War ein Duell unfair? Warum (Level, Items, Wortanzahl, Weglaufen)?
4. Welches Item oder welcher Perk war zu stark, welcher nutzlos?
5. Ging das Leveln zu schnell oder zu langsam?
6. Lief es flüssig? Gab es Ruckler oder Lags im Mehrspieler?
7. Was hat gefehlt?
8. Wie wahrscheinlich spielst du nochmal (1-10)?

## Bekannte Grenzen (vorher sagen)
- Nur PC mit Tastatur.
- Der Host muss den Tab offen lassen.
- In Firmen- oder Schulnetzen und über manche Handy-Hotspots kann das Verbinden scheitern (noch kein eigenes Relay).
- Musik und Sound starten erst nach dem ersten Klick.

## Auswertung
Fehlerberichte und Antworten sammeln (einfach in einen Chat oder eine Datei kopieren) und Claude geben. Daraus werden die Bug-Liste und die Balancing-Änderungen für die nächste Runde.
