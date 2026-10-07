# Selbsttest: ein Link, der das ganze Spiel prüft

**Link:** `https://typebite.io/?selftest=1` öffnen und auf „Start the test" klicken. Dauer etwa 1 bis 2 Minuten (Chrome auf dem PC), auf schwachen Geräten bis 5 Minuten.
Die lange Version mit mehr Durchläufen (4 bis 6 Minuten, auf schwachen Geräten bis 12): `https://typebite.io/?selftest=1&deep=1`.
Das Tab muss offen und sichtbar bleiben, solange der Test läuft. Es wird nichts an andere Spieler geschickt.

**Mit Gerätecode (Ergebnis kommt automatisch zu mir):** den Link aus `grafiken/geraete-links.txt` nehmen und hinten `&selftest=1` anhängen, zum Beispiel
`https://typebite.io/?dev=Arbeits-PC&dk=CODE&selftest=1`. Dann schickt das Gerät den Bericht am Ende selbst an die Statistik-Datenbank (Art `test`), und ich lese ihn dort.
Ohne Code gibt es unten „Copy the report" (Text) und „Download (.json)".

## Wie lese ich das Ergebnis?
- **Grün (ok):** geprüft und in Ordnung.
- **Gelb (warning):** es funktioniert, aber die Messung zeigt etwas, das man ansehen sollte (zum Beispiel „Level 30 verliert 100 % gegen Level 10 bei gleichem Tippen").
- **Rot (FAIL):** etwas ist kaputt oder weicht von dem ab, was die Einstellungen oder der Text im Spiel versprechen. Ein Klick auf die Zeile zeigt, was genau.
- Jede Zeile hat Messwerte in Blau (zum Beispiel FPS, Zeit des Hosts, Datenmenge), damit man Geräte vergleichen kann.

## Was geprüft wird (alles mit dem echten Spielcode)
Die **Regeln** laufen in einem privaten Server im Hintergrund (Web Worker), mit eigener Welt und einer Uhr, die schneller läuft als die echte. Nichts davon betrifft ein laufendes Spiel.

| Gruppe | Inhalt |
|---|---|
| Einstellungen und Tabellen | `config.js` ohne Fehler, 24 Items, 38 Perks, 57 Snacks mit Texten, Seltenheiten, Durchschnitt 1,0, Level-Kosten, Slots, Perk-Zeitpunkte |
| Seltenheit | 20000 bis 60000 Würfe: Geschenkboxen, Unterwasserboxen, Snacks, Perk-Karten, Glück/Fortune, jedes Item und jeder Snack kann fallen, Legendär selten |
| Karte | Gleiche Seed gleiche Karte, Gebäude, keine Überlappung, Türen, freie Spawn-Plätze, Snacks nicht in Wänden |
| Bewegung | Lauftempo je Level, Sprint und Ausdauer, Dash und Aufladen, Schwimmen, Eis, Wände, Kartenrand, in jedes Gebäude durch die Tür |
| Level und XP | XP exakt, **alle 57 Snacks einzeln gegessen** (XP und Essenszeit), Epic/Legendär-Boni, Boxen, Orbs, König |
| Items | **alle 24** einzeln (Wirkung, Dauer, Stapeln, Grenzen), Slots, Bedienung per Nachricht |
| Perks | **alle 38** auf jedem Rang (Zahlen und Verhalten), Angebote, Auswahl im Spiel, alle Perks gleichzeitig |
| Duelle | Ablauf zwischen zwei Spielern, Countdown, XP-Abrechnung, Orbs, Verlierer, Aussteigen, Zeitlimit, Schutz, Fairness (gleiche Tipper, schneller gewinnt, Levelabstand), Head Start und Flow auch gegen Spieler |
| Schummeln | Ganze Phrase auf einmal, „fertig"-Nachrichten, falsche Buchstaben, Nachrichtenflut, Unsinn und Riesenzahlen |
| Gegner (Bots) | Arten, Lauftempo, Tippgeschwindigkeit, Entscheidungen (Flucht, Jagd, Beute, Boxen, Orbs, Gefahr, Items, Festhängen), 100 Bots für 2,5 Minuten auf der echten Karte |
| Balance | Skript-Spieler (40 WPM, in der langen Version 25/40/55/80) gegen die Bots: Level, Tode, Siege, Snacks pro Minute |
| Server | Namensfilter, Aussehen, Beitritt von 50 Spielern, Snapshots (nur Nahes, keine Geheimnisse), Snack-Listen, Übergabe-Kopie speichern und wiederherstellen, Müllnachrichten, Aufträge, volle Lobby (Rechenzeit, Datenmenge) |

Die **Seite** wird im Tab selbst geprüft:

| Gruppe | Inhalt |
|---|---|
| Dieser Browser | Was er kann (Worker, WebRTC, Audio, Canvas ...), Gerät, Bildschirm, Grafik |
| Bilder | Jede Frisur, jeder Hut, jedes Oberteil, jede Hose, jedes Gesicht, jedes Extra: gezeichnet und unterschiedlich, Rüstung nach Level, alle 57 Snack-Bilder |
| Menüs | Anleitung (Items, Perks, Snacks), alle Tutorial-Szenen, Einstellungen, Fehlerbericht, Stats-Fenster |
| Musik und Ton | Alle 19 Lieder laden, alle Soundeffekte laufen (lange Version: Lieder werden zu Klang gerechnet, nicht stumm, nicht übersteuert) |
| Ein echtes Spiel | Solo-Spiel 12 Sekunden (lang 25): laufen, essen, Tasten, Karte; FPS, 1 %-Tiefstwerte, Fehler; ein Tipp-Duell mit Tippfehler und Sieg; zurück ins Menü; die Welt an neun Orten |
| Netzwerk | Vermittlungsserver antwortet, zwei Verbindungen untereinander über den echten Server (Zeit, Rundlauf, 12-KB-Nachricht), Adressen der Seite |

## Was der Test NICHT kann
- Keine echten Menschen, keine echte Internetverbindung zwischen zwei Geräten (nur zwei Verbindungen im selben Tab über den echten Server), keine Mobilfunk-Netze.
- Handy: der Test läuft auch auf dem Handy (dann mit dem virtuellen Joystick), aber Tastatur und Ton auf echten Geräten nur so weit, wie der Browser es zulässt.
- Skript-Spieler sind keine Menschen: Zahlen zur Balance sind Anhaltspunkte, kein Urteil über Spaß.

## Für mich (Entwickler)
- Quellen: `tools/selftest/*.js` (in Dateinamen-Reihenfolge), `python3 tools/build.py` baut daraus `site/selftest.js` (die Seite lädt es nur auf typebite.io, nicht in der einzelnen Download-Datei).
- Die Regeln laufen auch ohne Browser: `node tools/selftest-node.js [deep] [Filter]`; `ONLY=duels,bots` wählt Teile (data, move, items, perks, duels, bots, balance, server, client). Für andere Spielstände: `SNACK_GAME=pfad/game.html`, `SNACK_CONFIG=pfad/config.js`.
- Seite im Browser automatisch: Playwright öffnet `/?selftest=1&autorun=1` und liest `window.__stResult`.
- Berichte lesen: `K=$(sed 's/.*k=//' grafiken/stats-link.txt); curl -s "https://typebite-stats.alikesan2004.workers.dev/diag.json?k=$K&kind=test&hours=48&limit=5"` (Felder: `summary`, `tests` als `[Gruppe, Name, Status p/f/w/s, ms, Details, Messwerte]`).
- Neue Tests: in `tools/selftest/NN_name.js` mit `SUITE.parts.push({name, async run(env, R){ R.group(..); await R.test(name, t => { t.ok(..); t.near(..); t.range(..); t.warn(..) }) }})`. `env.X` ist die Brücke ins Spiel (`ents`, `useItem`, `finishDuel` ...), `env.run(sek)` lässt die Welt laufen, `env.ent(...)` / `env.human(...)` legen Figuren an, `env.clean(true)` nimmt die echte Karte (sonst leeres Feld). Jeder Test setzt `SUITE.seed(n)` für gleiche Zufallszahlen.
- Das Prüfen der Prüfung: 6 absichtlich eingebaute Fehler im Spiel (zu schwacher Gourmet, Schild ohne Schutz, „fertig"-Schummeln wieder an, falscher Last-Stand-Wert, falsche Sieg-XP, falsche Snack-XP) wurden alle gefunden.
