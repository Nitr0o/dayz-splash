// netlify/functions/dayz-status.js
// Node 18+ (built-in fetch, Buffer, etc.)
import dgram from "node:dgram";

export const handler = async (event) => {
  // Allow GET /.netlify/functions/dayz-status?ip=1.2.3.4&port=2303
  const ip = event.queryStringParameters?.ip;
  const port = Number(event.queryStringParameters?.port || 0);

  if (!ip || !port) {
    return json({ error: "Missing ip or port" }, 400);
  }

  try {
    const info = await a2sInfo(ip, port, 2000); // 2s timeout
    return json({
      online: true,
      name: info.name,
      map: info.map || "",
      players: info.players ?? 0,
      max: info.maxPlayers ?? 0,
    });
  } catch (e) {
    // treat any error as offline / unreachable
    return json({ online: false, error: String(e) }, 200);
  }
};

// ---- Steam A2S_INFO over UDP (Source/DayZ query) ----
function a2sInfo(host, port, timeoutMs = 2000) {
  return new Promise((resolve, reject) => {
    const socket = dgram.createSocket("udp4");
    const timer = setTimeout(() => {
      cleanup();
      reject(new Error("Query timeout"));
    }, timeoutMs);

    // A2S_INFO request: 0xFF 0xFF 0xFF 0xFF 'TSource Engine Query' 0x00
    const payload = Buffer.concat([
      Buffer.from([0xFF, 0xFF, 0xFF, 0xFF]),
      Buffer.from("TSource Engine Query", "ascii"),
      Buffer.from([0x00]),
    ]);

    socket.once("error", (err) => {
      cleanup();
      reject(err);
    });

    socket.on("message", (msg) => {
      try {
        // Basic parser for A2S_INFO
        // Reference: https://developer.valvesoftware.com/wiki/Server_queries
        let i = 0;
        const readByte = () => msg[i++];
        const readString = () => {
          let start = i;
          while (i < msg.length && msg[i] !== 0x00) i++;
          const s = msg.slice(start, i).toString("utf8");
          i++; // skip null
          return s;
        };

        // skip header (-1 0x49)
        // first 4 bytes (-1) then header byte 0x49
        i = 4; // skip 0xFFFFFFFF
        const header = readByte(); // 0x49
        if (header !== 0x49) throw new Error("Unexpected A2S header");

        /* fields we care about */
        /* protocol */ readByte();
        const name = readString();     // server name
        const map = readString();      // map
        /* folder */ readString();
        /* game */ readString();
        /* id low/high */ readByte(); readByte();
        const players = readByte();
        const maxPlayers = readByte();

        cleanup();
        resolve({ name, map, players, maxPlayers });
      } catch (e) {
        cleanup();
        reject(e);
      }
    });

    socket.send(payload, port, host, (err) => {
      if (err) {
        cleanup();
        reject(err);
      }
    });

    function cleanup() {
      clearTimeout(timer);
      try { socket.close(); } catch {}
    }
  });
}

function json(obj, status = 200) {
  return {
    statusCode: status,
    headers: {
      "content-type": "application/json",
      // allow your site to call from the browser
      "access-control-allow-origin": "*",
    },
    body: JSON.stringify(obj),
  };
}
