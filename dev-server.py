#!/usr/bin/env python3
"""本地静态预览服务器：仅绑定 127.0.0.1，只在开发时使用。"""
import functools
import http.server
import os

PORT = int(os.environ.get("PORT", "8123"))
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "web")

class Handler(http.server.SimpleHTTPRequestHandler):
    """线上会给文本资源带 charset=utf-8，本地也要一致，否则中文注释在
    GBK 区域设置的浏览器里会显示成乱码（只影响注释显示，不影响功能）。"""

    def guess_type(self, path):
        ctype = super().guess_type(path)
        if ctype.startswith("text/"):
            return ctype + "; charset=utf-8"
        return ctype


Handler = functools.partial(Handler, directory=ROOT)

with http.server.ThreadingHTTPServer(("127.0.0.1", PORT), Handler) as httpd:
    print("serving %s at http://127.0.0.1:%d/" % (ROOT, PORT), flush=True)
    httpd.serve_forever()
