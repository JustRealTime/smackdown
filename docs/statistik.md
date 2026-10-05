# Aktivitätszähler und Warn-Mail einrichten (einmalig, ca. 10 Minuten)

Was du danach hast: einen Link, der zeigt, wie viele Leute gerade spielen (und Spitze und Tabs pro Tag), und eine Mail an dich, wenn etwas überlastet ist.
Der Zähler ist ein eigener kleiner Cloudflare-Worker (`tools/stats-worker/`). Er kostet nichts (Gratis-Plan).

## 1. Mail-Weiterleitung bei Cloudflare einschalten
1. Cloudflare-Dashboard -> deine Domain **typebite.io** -> **E-Mail** -> **E-Mail-Routing** -> aktivieren (Cloudflare trägt die nötigen DNS-Einträge selbst ein).
2. Unter **Zieladressen** deine eigene Adresse hinzufügen und den Bestätigungslink in der Mail anklicken. Ohne diese Bestätigung verschickt Cloudflare nichts.

## 2. Worker veröffentlichen (im Ordner des Projekts)
```
cd tools/stats-worker
npx wrangler login
npx wrangler deploy
```
`login` öffnet den Browser, dort mit dem Cloudflare-Konto bestätigen. Nach `deploy` steht die Adresse da, sie sollte `https://typebite-stats.alikesan2004.workers.dev` sein. Wenn sie anders lautet, sag es mir, dann ändere ich die Adresse im Spiel (`STATS_URL` in game.html).

## 3. Drei Geheimnisse setzen (jeweils eingeben und Enter)
```
npx wrangler secret put KEY
npx wrangler secret put MAIL_TO
npx wrangler secret put PUBLIC_URL
```
- `KEY`: ein langes zufälliges Passwort (z. B. 30 Zeichen). Es ist das Passwort in deinem Link.
- `MAIL_TO`: deine E-Mail-Adresse (die bestätigte aus Schritt 1).
- `PUBLIC_URL`: dein voller Link, also `https://typebite-stats.alikesan2004.workers.dev/?k=DEIN_KEY`. Er steht dann in den Warn-Mails.

## 4. Testen
- `https://typebite-stats.alikesan2004.workers.dev/?k=DEIN_KEY` öffnen: die Seite mit "offene Tabs gerade". Als Lesezeichen speichern.
- `.../test?k=DEIN_KEY` öffnen: schickt eine Testmail. Wenn nichts kommt: im Spam nachsehen; sonst steht auf der Seite `/` unten "Letzter Mail-Fehler", das schickst du mir.

## 5. Spiel veröffentlichen
Die Zählung beginnt erst, wenn Build r66 online ist (`git push`, Cloudflare baut die Seite wie immer).

## Was als "überlastet" gilt (Zahlen oben in `worker.js`)
- Ein Host schafft die 60 Spielschritte pro Sekunde nicht (Schrittzeit über 14 ms, 3 Minuten lang). Das merken seine Mitspieler als Ruckeln.
- Die Verbindungen sind langsam: der mittlere Ping der Clients liegt über 500 ms (mindestens 3 Clients).
- Das Gratis-Tageslimit des Zählers wird knapp (40000 von etwa 50000 Herzschlägen am Tag). Das Spiel läuft dann trotzdem weiter, nur die Zählung hört auf.

Je Art kommt höchstens alle 3 Stunden eine Mail.

## Wichtig zu wissen
- Ein "Tab" ist ein offenes Spielfenster, nicht eine Person. Zwei Fenster einer Person zählen doppelt.
- Der Zähler zeigt keine Namen und keine IP-Adressen. Der Datenschutztext (`site/datenschutz.html`, Abschnitt 6) wurde angepasst, ist aber nicht von einem Anwalt geprüft.
- Ein eigener Spielserver, der "überlastet" sein könnte, existiert nicht: Die Lobbys laufen in den Browsern der Spieler. Deshalb werden die Hosts überwacht.
