# Release-Plan und Rechtliches (Stand: Notizen, keine Rechtsberatung)

Plan des Entwicklers: 1. Balancing, 2. eigene Webseite mit vielen Spielern, 3. Werbung, 4. Mikrotransaktionen (Skins, Flaggen), 5. Steam.

## Erledigt
- Fremde Musik entfernt (personaxmother, peronamorhwr, minecraft, sadmarioinb4, sadmariosda). Der Rest ist laut Entwickler komplett selbst komponiert, ohne Loops. Wichtig: Beweise aufheben (Projektdateien/DAW-Sessions, Datumsstempel), falls es je Streit gibt.
- Schriften sind eingebettet (kein Google-Aufruf), Lizenzen in `fonts/`, `THIRD_PARTY.md` angelegt.
- Beim Öffnen des Menüs fragt das Spiel den PeerJS-Vermittler (peerjs.com) ab. Dabei geht die IP-Adresse dorthin. Für den echten Release entweder eigenen Vermittler betreiben oder die Abfrage erst nach Zustimmung/Klick starten und in der Datenschutzerklärung nennen.

## Vor dem ersten öffentlichen Release (Österreich/EU)
- **Musik klären (wichtigster Punkt):** Eigene Kompositionen sind frei nutzbar. Nachbauten fremder Lieder (auch als MIDI/Cover) bleiben urheberrechtlich geschützt (Komposition) und brauchen eine Lizenz oder müssen raus. Dateinamen im Ordner `music/`, die nach Fremdmaterial aussehen und geprüft werden müssen: `personaxmother`, `peronamorhwr`, `minecraft`, `sadmarioinb4`, `sadmariosda`, `africa`, `dead_inside`, `chase_action`. Dazu prüfen: Samples, Loops, Soundfonts mit eigener Lizenz. AKM-Mitgliedschaft prüfen (Rechteübertragung).
- **Name:** "Snackdown" klingt nach WWE "SmackDown" (Marke). Vor einem Release Markenrecherche (Österreichisches Patentamt, EUIPO) und besser einen eigenen, unterscheidbaren Namen wählen.
- **Schriftarten:** Lilita One, Nunito, JetBrains Mono (SIL OFL, kommerziell erlaubt) werden aktuell von Google-Servern geladen. In der EU besser selbst hosten (DSGVO).
- **Bibliotheken:** PeerJS (MIT) enthält einen Lizenzhinweis, der mitgeliefert werden muss.
- **Impressum** (E-Commerce-Gesetz, Mediengesetz) und **Datenschutzerklärung** auf der Webseite. Spielernamen und IP-Adressen sind personenbezogene Daten.
- **Werbung:** Einwilligung (Cookie-Banner mit zertifiziertem CMP) nötig, z. B. für Google AdSense im EWR.
- **Mikrotransaktionen:** Digitale Inhalte: Widerrufsrecht (FAGG) mit ausdrücklicher Zustimmung ausschließen, Preise inkl. USt, AGB. Keine zufälligen kaufbaren Boxen (Glücksspiel-Debatte), nur direkt gekaufte Kosmetik. Minderjährige (unter 14/18) beachten. Flaggen: keine verbotenen Symbole (Symbole-Gesetz).
- **Gewerbe/Steuer:** Verkauf und Werbeeinnahmen sind in Österreich normalerweise ein (freies) Gewerbe mit Gewerbeschein, SVS-Versicherung, Einkommensteuer, ggf. Kleinunternehmerregelung bei der USt. WKO-Gründerservice oder Steuerberater fragen.
- **KI-Unterstützung:** Die Nutzungsbedingungen von Anthropic regeln, dass Ausgaben dir gehören bzw. du sie nutzen darfst. Aktuelle Bedingungen selbst lesen. Urheberrechtlich schützt das österreichische Recht nur menschliche, eigentümliche Schöpfungen: Spielidee, Auswahl, Design-Entscheidungen, Musik, Texte von dir sind geschützt, rein maschinell erzeugte Codeteile eventuell nicht. Verkaufen und Geld verdienen ist damit trotzdem erlaubt.

## Technik für viele Spieler
- Der Host im Browser reicht für Freundesgruppen, nicht für Hunderte. Für die eigene Seite: Node-Server (`server/server.js`) auf einem VPS (z. B. Hetzner), mehrere Räume/Prozesse (je Raum ca. 20-40 Spieler), WebSocket hinter Reverse-Proxy (Caddy/nginx) mit TLS, statische Dateien über ein CDN.
- Serverseitig prüfen: Tippgeschwindigkeit plausibel (WPM-Grenze), Anfragenrate, Namensfilter.
- Steam: Verpackung als Desktop-App (Electron/NW.js + Steamworks), Steam-Direct-Gebühr, Steuerformulare, eigene Musikrechte nachweisbar.
