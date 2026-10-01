# Automatischer Fehler-Upload nach GitHub (ab Build r32)

Jeder Fehler, der bei einem Spieler auftritt, landet automatisch als Zeile in einer Datei in einem **privaten** GitHub-Repo, z. B. `errors/2026-10-01.jsonl`. Dazu kommen manuelle Berichte (F8 oder „Report a problem“) mit der Beschreibung des Testers.

## Warum über einen Zwischendienst
Das Spiel kann nicht direkt nach GitHub schreiben. Dafür müsste ein GitHub-Schlüssel (Token) in `index.html` stehen, und jeder mit der Datei könnte damit das Repo verändern. GitHub sperrt solche Token in öffentlichen Repos außerdem automatisch. Deshalb:

```
Spiel (index.html)  --POST-->  Cloudflare Worker (hält den Token geheim)  -->  privates Repo smackdown-errors
```

Das Log-Repo ist privat, weil die Berichte Browserdaten der Tester enthalten. Das Spiel-Repo ist öffentlich.

## Einrichtung (einmalig, ca. 10 Minuten, kostenlos)

**1. Privates Repo anlegen**
- https://github.com/new
- Name: `smackdown-errors`, **Private**, „Add a README file“ anhaken (damit es den Branch `main` gibt). Create repository.

**2. Token erstellen (nur für dieses Repo)**
- https://github.com/settings/personal-access-tokens/new (Fine-grained token)
- Name: `snackdown error relay`, Ablauf: 90 Tage
- Resource owner: `JustRealTime`
- Repository access: **Only select repositories** → `smackdown-errors`
- Permissions → Repository permissions → **Contents: Read and write** (sonst nichts)
- Generate token, Token kopieren (beginnt mit `github_pat_`). Nirgends speichern außer in Schritt 4.

**3. Cloudflare Worker anlegen**
- https://dash.cloudflare.com, kostenloses Konto
- Workers & Pages → Create → Worker („Hello World“), Name `snackdown-errors` → Deploy
- „Edit code“: den ganzen Inhalt durch `tools/error-relay/worker.js` aus diesem Repo ersetzen → Deploy

**4. Einstellungen im Worker**
- Worker → Settings → Variables and Secrets → Add
  - `GITHUB_TOKEN`, Typ **Secret**, Wert: der Token aus Schritt 2
  - `REPO`, Typ **Text**, Wert: `JustRealTime/smackdown-errors`
- Speichern bzw. Deploy

**5. Testen**
- Die Worker-Adresse im Browser öffnen (z. B. `https://snackdown-errors.DEINNAME.workers.dev`). Es muss „snackdown error relay is running“ erscheinen.
- Testbericht schicken (Windows PowerShell):
  ```
  Invoke-RestMethod -Method Post -Uri https://snackdown-errors.DEINNAME.workers.dev -Body '{"kind":"report","build":"test","note":"Hallo"}'
  ```
  Antwort `saved errors/<Datum>.jsonl`, und die Datei ist im Repo `smackdown-errors` zu sehen.
- Bei `GitHub read 401` oder `403` stimmt der Token nicht (Schritt 2 und 4 prüfen), bei `404` stimmt `REPO` nicht.

**6. Adresse an Claude geben**
Die Worker-Adresse schicken. Claude trägt sie im Spiel ein (`ERR_URL` in `game.html`), baut `index.html` neu und pusht. Erst ab dann wird hochgeladen. Danach allen Testern die neue `index.html` schicken.

## Wie Claude die Fehler liest
In einer Sitzung einfach sagen: „Lies die Fehler aus smackdown-errors.“ Claude hängt das private Repo an die Sitzung an und liest `errors/*.jsonl`.

## Was gesendet wird
Pro Upload eine Zeile (JSON): Zeit, Build, Art (`error` oder `report`), eine zufällige Kennung pro Tab (nicht dauerhaft), Browser (User-Agent), Bildschirm, Modus (Host/Client/Solo, Raumname, Spielerzahl, Vermittler), Spielzustand (Level, Duell), FPS, Fehlermeldungen mit Codezeile und Anzahl, bei manuellen Berichten die Beschreibung des Testers.

**Nicht** gesendet bzw. gespeichert: Spielername, IP-Adresse (Cloudflare sieht sie technisch beim Empfang, der Worker speichert sie nicht), Dateipfade.

Grenzen gegen Spam und Kosten: Das Spiel schickt den ersten Upload 5 Sekunden nach einem Fehler (gebündelt), danach höchstens einen pro Minute und maximal 30 pro Tab. Gleiche Fehler werden nur hochgezählt. Der Worker nimmt höchstens 20 Berichte pro Minute und IP an, maximal 16 KB pro Bericht. Jeder Bericht ist ein Commit im Log-Repo.

## Kosten und Wartung
- Cloudflare Workers (Gratisstufe) und ein privates GitHub-Repo kosten nichts (Stand meines Wissens: 100.000 Anfragen pro Tag gratis, vor dem Release prüfen).
- Der Token läuft nach 90 Tagen ab. Dann kommen keine Fehler mehr an (der Worker antwortet mit 502). Neuen Token erstellen und das Secret `GITHUB_TOKEN` ersetzen.
- Abschalten: im Worker auf „Disable“ oder Claude bitten, `ERR_URL` zu leeren.

## Datenschutz
Für den Spieltest mit Freunden: vorher sagen, dass Fehler automatisch gesendet werden (steht auch im Menü). Vor einem öffentlichen Release muss das in die Datenschutzerklärung (Empfänger: Cloudflare, GitHub, beide USA). Dann klären, ob es eine Einwilligung braucht (Teil der Anwalts-Erstberatung).
