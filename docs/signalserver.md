# Vermittlungsserver (Signalisierung) und TURN

Das Spiel nutzt PeerJS (WebRTC). Ein kleiner Server stellt die Browser einander vor; danach laufen die Spieldaten direkt zwischen den Browsern.
Dieser Server ist `tools/signal-worker` (Cloudflare Worker, kostenlos), erreichbar unter https://typebite-signal.alikesan2004.workers.dev.

- Adresse im Spiel: `site/config.js` -> `network.signalServer`. Leer lassen = alter öffentlicher PeerJS-Dienst.
- Neu deployen nach Änderungen: `cd tools/signal-worker && npx wrangler deploy`.
- Status: `/status` zeigt die Zahl der offenen Verbindungen, `/ice` die Verbindungshelfer (STUN/TURN).

## TURN (Relay für Netze, in denen keine direkte Verbindung klappt)
Ohne TURN scheitern etwa 10-20 % der Verbindungen (strenge Firmen-/Uni-/Mobilfunknetze). So wird es aktiviert:
1. Cloudflare Dashboard -> Realtime -> TURN Server -> Abo hinzufügen (1000 GB/Monat frei, danach 0,05 $ pro GB; Karte hinterlegt).
2. Dort einen TURN-Schlüssel erstellen: man bekommt eine Key-ID und ein Token.
3. `cd tools/signal-worker`, dann `npx wrangler secret put TURN_KEY_ID` und `npx wrangler secret put TURN_API_TOKEN`.
4. Kontrolle: `/ice` muss `"turn":true` zeigen.
