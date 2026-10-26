const http = require("http");
const fs = require("fs");
const path = require("path");
const { URL } = require("url");

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const DATA_FILE = path.join(DATA_DIR, "messages.json");
fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf8");

const mime = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function send(res, status, body, type = "application/json; charset=utf-8") {
  res.writeHead(status, {
    "Content-Type": type,
    "X-Content-Type-Options": "nosniff",
    "Content-Security-Policy": "default-src 'self'; style-src 'self'; script-src 'self'; img-src 'self' data:; connect-src 'self';"
  });
  res.end(body);
}
function readBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => {
      data += chunk;
      if (data.length > 20000) {
        reject(new Error("Request too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      try { resolve(JSON.parse(data || "{}")); }
      catch { reject(new Error("Invalid JSON")); }
    });
  });
}
function readMessages() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, "utf8")); }
  catch { return []; }
}
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (req.method === "GET" && url.pathname === "/api/health") {
    return send(res, 200, JSON.stringify({ status: "ok", app: "Women's Hub" }));
  }
  if (req.method === "GET" && url.pathname === "/api/messages") {
    // Public demo only: return submissions without sensitive details.
    const messages = readMessages().map(({ id, name, topic, createdAt }) => ({ id, name, topic, createdAt }));
    return send(res, 200, JSON.stringify(messages));
  }
  if (req.method === "POST" && url.pathname === "/api/messages") {
    try {
      const body = await readBody(req);
      const name = String(body.name || "").trim().slice(0, 70);
      const email = String(body.email || "").trim().slice(0, 120);
      const topic = String(body.topic || "").trim().slice(0, 80);
      const message = String(body.message || "").trim().slice(0, 1500);
      if (!name || !topic || !message) {
        return send(res, 400, JSON.stringify({ error: "Please provide your name, topic, and message." }));
      }
      const messages = readMessages();
      const item = {
        id: Date.now().toString(36) + Math.random().toString(36).slice(2, 7),
        name, email, topic, message,
        createdAt: new Date().toISOString()
      };
      messages.unshift(item);
      fs.writeFileSync(DATA_FILE, JSON.stringify(messages, null, 2), "utf8");
      return send(res, 201, JSON.stringify({ success: true, message: "Thank you. Your message has been saved locally." }));
    } catch (err) {
      return send(res, 400, JSON.stringify({ error: err.message || "Could not save message." }));
    }
  }

  let requested = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const filePath = path.normalize(path.join(PUBLIC_DIR, requested));
  if (!filePath.startsWith(PUBLIC_DIR)) return send(res, 403, "Forbidden", "text/plain; charset=utf-8");
  fs.readFile(filePath, (err, content) => {
    if (err) return send(res, 404, "Page not found", "text/plain; charset=utf-8");
    send(res, 200, content, mime[path.extname(filePath)] || "application/octet-stream");
  });
});

server.listen(PORT, () => {
  console.log(`Women's Hub is running at http://localhost:${PORT}`);
});