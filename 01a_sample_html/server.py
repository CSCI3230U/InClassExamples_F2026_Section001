#!/usr/bin/env python3
"""A tiny static server that ALSO accepts POST - for the Lecture 01a form demo.

    python3 server.py            # http://localhost:8000
    python3 server.py 9000       # a different port

Plain `python -m http.server` only handles GET (a POST returns 501). This adds a
`do_POST` that reads the request BODY (not the URL), stores it, and shows it back
- so you can demonstrate a real POST. Standard library only; nothing to install.
"""

import html
import sys
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import parse_qs

# An in-memory "database" of guestbook entries. Resets when the server restarts
# (a real app would use a database - that's the backend lecture).
GUESTBOOK = []


class DemoHandler(SimpleHTTPRequestHandler):
    # GET is inherited from SimpleHTTPRequestHandler (serves static files),
    # so the rest of the site works exactly as before.

    def do_POST(self):
        if self.path != "/feedback":
            self.send_error(404, "No such endpoint")
            return

        # The submitted fields are in the request BODY, not the URL.
        length = int(self.headers.get("Content-Length", 0))
        body = self.rfile.read(length).decode("utf-8")
        fields = parse_qs(body)  # e.g. "name=Ada&message=Hi" -> {"name": ["Ada"], ...}

        name = (fields.get("name", [""])[0] or "Anonymous").strip()
        message = fields.get("message", [""])[0].strip()
        if message:
            GUESTBOOK.append((name, message))

        self._send_guestbook(name)

    def _send_guestbook(self, just_added):
        items = "\n".join(
            f"      <li><strong>{html.escape(n)}</strong>: {html.escape(m)}</li>"
            for n, m in reversed(GUESTBOOK)
        ) or "      <li>(no entries yet)</li>"

        page = f"""<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Guestbook - Acme Widgets</title>
    <link rel="stylesheet" href="/styles.css" />
  </head>
  <body>
    <main>
      <h1>Thanks, {html.escape(just_added)}!</h1>
      <p>
        Your message arrived in the request <strong>body</strong> (look at the
        Network tab - it is not in the URL). The server read it and stored it.
      </p>
      <h2>Guestbook</h2>
      <ul>
{items}
      </ul>
      <p><a href="/index.html">&larr; Back to the site</a></p>
    </main>
  </body>
</html>
"""
        encoded = page.encode("utf-8")
        self.send_response(200)
        self.send_header("Content-Type", "text/html; charset=utf-8")
        self.send_header("Content-Length", str(len(encoded)))
        self.end_headers()
        self.wfile.write(encoded)


if __name__ == "__main__":
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8000
    print(f"Serving (with POST support) on http://localhost:{port}  -  Ctrl+C to stop")
    ThreadingHTTPServer(("", port), DemoHandler).serve_forever()
