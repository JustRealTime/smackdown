# typebite.io online stellen (Cloudflare Pages, kostenlos)

Voraussetzung: Die Domain typebite.io liegt im Cloudflare-Konto (ist so). Es wird nur eine statische Datei ausgeliefert (`index.html`, enthält Spiel, Musik, Schriften und PeerJS). Mehrspieler läuft weiter über die Browser der Spieler.

## Einmalig einrichten
1. Cloudflare Dashboard > **Workers & Pages** > **Create** > Reiter **Pages** > **Connect to Git**. GitHub-Konto verbinden und das Repo `JustRealTime/smackdown` wählen. (Zeigt die Oberfläche nur "Workers", dort "Looking to deploy Pages? Get started" anklicken.)
2. Einstellungen:
   - Production branch: `main`
   - Framework preset: `None`
   - Build command: `mkdir -p site && cp index.html site/index.html`
   - Build output directory: `site`
3. **Save and Deploy**. Nach etwa einer Minute gibt es eine Adresse wie `xyz.pages.dev`. Dort muss das Spiel laufen.
4. Im Pages-Projekt **Custom domains** > **Set up a custom domain** > `typebite.io` (und optional `www.typebite.io`). Weil die Domain im selben Konto liegt, setzt Cloudflare die DNS-Einträge selbst. Es kann ein paar Minuten bis eine Stunde dauern, bis `https://typebite.io` erreichbar ist (HTTPS gibt es automatisch).

## Danach bei jeder Änderung
`python3 tools/build.py`, `index.html` committen und auf `main` pushen. Cloudflare veröffentlicht automatisch neu.

## Vor dem öffentlichen Bewerben
Impressum, Datenschutzerklärung (PeerJS-Vermittler, Fehler-Upload), später Cookie-Banner. Siehe `docs/release-plan.md`.
