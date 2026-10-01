# typebite.io online stellen (Cloudflare Pages, kostenlos)

Voraussetzung: Die Domain typebite.io liegt im Cloudflare-Konto (ist so). Es wird nur eine statische Datei ausgeliefert (`index.html`, enthält Spiel, Musik, Schriften und PeerJS). Mehrspieler läuft weiter über die Browser der Spieler.

## Einmalig einrichten (Cloudflare "Workers Builds", so zeigt es das Dashboard jetzt)
1. Dashboard > **Workers & Pages** > **Create application** > **Connect GitHub**. Das Repo `JustRealTime/smackdown` freigeben (nur dieses eine Repo).
2. Einstellungen:
   - Project name: **`typebite`** (muss zum Namen in `wrangler.jsonc` passen)
   - Build command: `mkdir -p site && cp index.html site/index.html`
   - Deploy command: `npx wrangler deploy` (Standard lassen; die Datei `wrangler.jsonc` im Repo sagt, dass der Ordner `site` ausgeliefert wird)
3. **Deploy**. Danach läuft das Spiel unter `typebite.<dein-subdomain>.workers.dev`.
4. Im Worker **Settings > Domains & Routes > Add > Custom domain** `typebite.io` eintragen (und optional `www.typebite.io`). Die Domain liegt im selben Konto, Cloudflare richtet DNS und HTTPS selbst ein (Minuten bis ca. eine Stunde).

## Danach bei jeder Änderung
`python3 tools/build.py`, `index.html` committen und auf `main` pushen. Cloudflare veröffentlicht automatisch neu.

## Vor dem öffentlichen Bewerben
Impressum, Datenschutzerklärung (PeerJS-Vermittler, Fehler-Upload), später Cookie-Banner. Siehe `docs/release-plan.md`.

## HTTPS ("Nicht sicher" im Browser)
- Die Adresse muss mit `https://` beginnen. `http://typebite.io` zeigt "Nicht sicher". Das Zertifikat stellt Cloudflare automatisch aus (nach dem Hinzufügen der Domain einige Minuten).
- Einmal im Dashboard einschalten: Domain `typebite.io` > **SSL/TLS** > **Edge Certificates** > **Always Use HTTPS** = an. Optional später **HSTS** (erst aktivieren, wenn sicher ist, dass alles über https läuft).
- Zusätzlich leitet das Spiel selbst von http auf https um (ab r38).

## Automatische Updates
Jeder Push auf `main` startet bei Cloudflare einen neuen Build und veröffentlicht ihn (ca. 1 Minute, Status unter dem Worker > Deployments). Wichtig: `index.html` muss vorher gebaut und mit eingecheckt sein. Besucher mit offener Seite müssen neu laden; Spieler mit unterschiedlichen Versionen bekommen im Mehrspieler eine Versions-Meldung.
