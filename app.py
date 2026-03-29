import re
import time
from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)
CORS(app)

limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["10 per minute"]
)

@app.route('/')
def home():
    return "Backend Running 🚀"

@app.route('/fetch')
@limiter.limit("5 per minute")
def fetch_site():
    url = request.args.get('url')

    if not url or not url.startswith("http"):
        return jsonify({"error": "Invalid URL"}), 400

    try:
        start = time.time()

        headers = {
            "User-Agent": "Mozilla/5.0"
        }
        res = requests.get(url, headers=headers, timeout=10)

        end = time.time()

        soup = BeautifulSoup(res.text, 'html.parser')
        formatted_html = soup.prettify()

        css = [l.get('href') for l in soup.find_all('link') if l.get('href')]
        js = [s.get('src') for s in soup.find_all('script') if s.get('src')]

        # 🔥 API Finder
        api_patterns = re.findall(r'https?://[^\s"\']+', res.text)
        apis = [u for u in api_patterns if "api" in u.lower() or ".json" in u.lower()]

        return jsonify({
            "html": formatted_html,
            "css": css,
            "js": js,
            "status": res.status_code,
            "load_time": round(end - start, 2),
            "size": len(res.text),
            "apis": list(set(apis))[:10]
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run()
