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
- `https://typebite-stats.alikesan2004.workers.dev/?k=DEIN_KEY` öffnen: die Statusseite fürs Handy (Spieler online, Auslastung in Prozent, Verlauf, Hosts, letzte Tage). Als Lesezeichen speichern oder „Zum Home-Bildschirm“.
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

## Die Statusseite
- Oben: Spieler online (offene Tabs), im Spiel / im Menü, Anzahl Lobbys und ein Ampel-Schild (Alles gut / Gut ausgelastet / Überlastet).
- **Auslastung in Prozent** = der schlechteste von drei Werten, und **100 % ist genau die Grenze, ab der die Warn-Mail kommt**: Host-Rechenzeit (Schrittzeit des langsamsten Hosts, Grenze 14 ms), Verbindung (mittlerer Ping der Spieler, Grenze 500 ms) und Tageslimit des Zählers (Grenze 40000 Herzschläge). Unter 60 % grün, 60 bis 99 % gelb, ab 100 % rot.
- Danach: Verlauf der Spieler und der Auslastung (6 / 24 / 48 Stunden, ein Punkt alle 5 Minuten; der Verlauf beginnt erst ab Einrichtung), Zahlen von heute, die laufenden Lobbys mit ihrer Last, die letzten Tage, Spielversionen und die letzten Warn-Mails.
- Die Seite lädt sich selbst alle 15 Sekunden neu, ohne Flackern. Dunkel oder hell richtet sich nach deinem Handy.

## Die öffentliche Seite typebite.io/status
- Dieselbe Seite ohne Passwort, für alle sichtbar: Spieler online, Ampel, Auslastung in Prozent, Verlauf, Zahlen von heute und die letzten Tage. **Nicht** drauf: Hosts, Spielversionen und Warn-Mails (die bleiben auf deinem privaten Link).
- Im Menü des Spiels steht unten neben Impressum und Datenschutz der Link „Status“.
- Die Datei `site/status.html` wird aus `tools/stats-worker/page.html` erzeugt: nach jeder Änderung an `page.html` einmal `node tools/stats-worker/make-status.js` ausführen und das Ergebnis committen.
- Die Daten holt die Seite vom Worker (`/public`, 15 Sekunden zwischengespeichert, damit viele Besucher den Zähler nicht belasten). Jeder offene Status-Tab kostet eine Worker-Anfrage alle 15 s (nur wenn der Tab sichtbar ist).

## Geräte-Messwerte (Handy, Gaming-PC, Arbeits-PC)
Damit Claude sehen kann, wie das Spiel auf deinen Geräten läuft, schicken freigeschaltete Geräte die Werte des Stats-Fensters automatisch an die Datenbank des Zählers.
1. Öffne auf jedem Gerät **einmal** den passenden Link aus `grafiken/geraete-links.txt` (Form: `https://typebite.io/?dev=Handy&dk=CODE`) im normalen Browser. Danach merkt sich der Browser das Gerät, und die Adresszeile ist wieder sauber.
2. Spiele wie immer. Etwa jede Minute Spiel geht eine Zusammenfassung raus. Im Stats-Fenster (F3 oder Knopf „Stats“) steht „Auto-upload for Handy: 12 sent, last 8 s ago“. Mit „Stop upload“ schaltest du es auf diesem Gerät wieder ab.
3. Claude liest mit dem Passwort aus `grafiken/stats-link.txt` die Zusammenfassung pro Gerät (`/diag/summary`) oder die Rohdaten (`/diag.json`).
- Nicht gesendet werden Name, IP-Adresse und Chat; nur Geräte- und Leistungswerte. Die Daten werden nach 30 Tagen gelöscht.
- Der Gerätecode ist wie ein Passwort. Wenn er nicht mehr geheim ist: `npx wrangler secret put DIAG_KEY` mit einem neuen Wert, danach die Links neu öffnen.
