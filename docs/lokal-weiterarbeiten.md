# Lokal weiterarbeiten (Übergabe aus der Cloud-Sitzung, Stand r51)

## Zustand
- `main` auf GitHub = lokaler Stand der Cloud-Sitzung (Commit `df6e3dd`, BUILD r51). Nichts liegt nur in der Cloud. `index.html` ist frisch gebaut (Neubau ergibt keinen Unterschied).
- Alle Entscheidungen stehen in `CLAUDE.md` (Überblick, Architektur, Regeln, offene Punkte) und `docs/konzept.md` (Runde 1-51). Rechtliches: `docs/release-plan.md`, `docs/legal/`. Hosting: `docs/deploy.md`. Fehler-Upload: `docs/fehler-upload.md`. Einstellungen: `docs/konfiguration.md` und `site/config.js`.

## Einrichten auf dem eigenen PC
1. `git clone https://github.com/JustRealTime/smackdown` (oder `git pull` im vorhandenen Ordner).
2. Installieren: Python 3, Node.js 18+, Git. Für Browser-Tests zusätzlich `npm i playwright` und einmal `npx playwright install chromium` (in der Cloud war Chromium vorinstalliert, lokal nicht).
3. Claude Code im Ordner starten: es liest `CLAUDE.md` automatisch.
4. Spiel ansehen: `python3 -m http.server` im Ordner, dann `http://localhost:8000/game.html` (Quelle) oder `index.html` (gebaut).

## Arbeitsablauf (gilt weiter)
- Nur `game.html` und `site/config.js` bearbeiten, nie `index.html`. Danach `python3 tools/build.py`, `BUILD` hochzählen (Code und Text im HTML), Runde in `docs/konzept.md`, commit, push auf `main`. Cloudflare veröffentlicht automatisch.
- Zahlen ändern geht ohne Claude: `site/config.js` auf GitHub bearbeiten.

## Unterschiede zur Cloud
- Keine GitHub-Werkzeuge von Claude und kein vorinstalliertes Chromium; `git` und `gh` laufen auf deinem PC mit deinen Zugangsdaten. Das Löschen des alten Branches `claude/trusting-faraday-bg2wly` geht dort oder auf GitHub.
- Die Cloud-Sandbox kam nicht an workers.dev, 0.peerjs.com oder unpkg. Lokal geht das, also lassen sich Fehler-Upload und Mehrspieler mit echtem Broker prüfen.
- Qualität hängt vom gewählten Modell und Plan ab, nicht vom Ort. Teste Claude beim ersten Auftrag kurz mit einer kleinen Änderung.

## Offen (aus CLAUDE.md und Gesprächen)
- Spielbalance der r51-Werte ungespielt (Karte 10000, 240 Bots, Seltenheiten, Snack-Nachwuchs 16/4).
- Playtests mit 5-10 Leuten (`docs/spieltest.md`), Handy (iPhone Vollbild, Touch) nur emuliert, Firefox/Safari ungetestet.
- Vor öffentlichem Werben: eigener PeerJS-Broker + TURN, Namensfilter, Cookie-Banner/Datenschutz prüfen, Markenprüfung "Typebite" mit Anwalt, Gewerbe bei Einnahmen.
- Später: Werbung, dann nur direkt gekaufte Kosmetik (keine Zufallskisten), dann Steam.
- Nicht in `site/config.js`: Texte/Icons, Freischaltlevel der Looks, Rang-Titel, Musik, Tasten.
- Musik ist standardmäßig aus; alte Fremdmusik steckt noch in der Git-Historie (Umschreiben nur auf Wunsch).
