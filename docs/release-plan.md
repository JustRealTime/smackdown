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

## Beste und günstigste Technik für den Start (Preise: Stand meines Wissens, vor dem Kauf prüfen)
- **Dateien ausliefern:** Cloudflare Pages (kostenlos, keine Trafficgrenze für statische Dateien) oder Netlify/GitHub Pages. Eigene Domain (.com oder .at) ca. 10-15 EUR/Jahr.
- **Vermittler (PeerJS-Server, Open Source `peer`):** ein kleiner VPS, z. B. Hetzner Cloud CX-Klasse ca. 4-6 EUR/Monat, mit Caddy für TLS. Auf demselben Server läuft später die Lobby-Verwaltung.
- **TURN-Relay für strenge Router:** am günstigsten ein verwalteter Dienst mit Gratisvolumen (z. B. Cloudflare Realtime TURN oder Metered), erst bei Bedarf coturn auf dem eigenen VPS (Hetzner hat viel Inklusivtraffic).
- Gesamt: grob 5-10 EUR pro Monat, solange Spieler in Browser-Lobbys hosten. Erst für Ranglisten, Konten und bezahlte Skins braucht es einen eigenen Spielserver, der entscheidet (`server/server.js`, mehrere Räume, ca. 6 ms pro Rechenschritt bei 160 Bots).

## Nächste Schritte bis "release ready"
1. **Name, Domain, Marke:** Namen festlegen, Domain sichern, Recherche beim Patentamt/EUIPO.
2. **Spieltests:** 5-10 Leute spielen lassen (auch Firefox, Safari, Edge, schwache Laptops), Balancing nach Rückmeldung, Fehler sammeln. Fehlerüberwachung einbauen (z. B. Sentry-Gratisstufe, mit Zustimmung), `reportErr` ist schon vorbereitet.
3. **Technik fertigstellen:** eigener Vermittler + TURN + TLS, Musik in kleinere Dateien (Ogg/MP3 96 kbit/s) und nachladen statt alles in einer 8-MB-Datei, Lobby-Registry, Begrenzung/Anti-Missbrauch, Namensfilter gegen Beleidigungen.
4. **Plattformen:** entscheiden ob Handy-Steuerung kommt (aktuell nur PC mit Tastatur). Webseite mit Startseite, Vorschaubild, Favicon, Open-Graph-Bild, Datenschutz-freundlicher Statistik (z. B. Plausible/Umami).
5. **Recht auf der Seite:** Impressum, Datenschutzerklärung (Vermittler/TURN, Spielername, IP), Cookie-/Einwilligungsbanner (CMP) bevor Werbung kommt. Einmal Anwalt oder Erstberatung drüberschauen lassen.
6. **Gewerbe anmelden**, sobald Einnahmen kommen (Werbung zählt auch), SVS/Steuerberater klären.
7. **Danach:** Werbung testen, dann Konten + Zahlungsanbieter als "Merchant of Record" (Paddle oder Lemon Squeezy übernehmen EU-Umsatzsteuer), nur direkte Kosmetik-Käufe, dann Steam (Electron-Verpackung mit Steamworks, Steam-Direct-Gebühr).
