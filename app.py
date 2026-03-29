import os
import re
import time
from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS

from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

# 🔧 App setup
app = Flask(__name__)

# 🌐 CORS
CORS(app)

# 🔐 Rate limiter
limiter = Limiter(
    get_remote_address,
    app=app,
    default_limits=["10 per minute"]
)

# 🌍 Home route
@app.route('/')
def home():
    return "Backend Running 🚀"


# 🚀 Fetch route
@app.route('/fetch')
@limiter.limit("5 per minute")
def fetch_site():
    url = request.args.get('url')

    if not url:
        return jsonify({"error": "URL required"}), 400

    if not url.startswith("http"):
        return jsonify({"error": "Invalid URL"}), 400

    try:
        # ⏱ Start time
        start = time.time()

        # 🌐 Request
        headers = {
            "User-Agent": "Mozilla/5.0"
        }
        res = requests.get(url, headers=headers, timeout=10)

        # ⏱ End time
        end = time.time()

        # 🧱 Parse HTML
        soup = BeautifulSoup(res.text, 'html.parser')
        formatted_html = soup.prettify()

        # 🎨 Extract CSS
        css = [
            link.get('href') for link in soup.find_all('link')
            if link.get('href')
        ]

        # ⚡ Extract JS
        js = [
            script.get('src') for script in soup.find_all('script')
            if script.get('src')
        ]

        # 🔍 API Finder (basic)
        api_patterns = re.findall(r'https?://[^\s"\']+', res.text)

        apis = [
            u for u in api_patterns
            if ("api" in u.lower() or ".json" in u.lower())
        ]

        # 📦 Response
        return jsonify({
            "html": formatted_html,
            "css": css,
            "js": js,
            "status": res.status_code,
            "load_time": round(end - start, 2),
            "size": len(res.text),
            "apis": list(set(apis))[:10]  # remove duplicates
        })

    except requests.exceptions.Timeout:
        return jsonify({"error": "Request timeout"}), 500

    except requests.exceptions.RequestException as e:
        return jsonify({"error": str(e)}), 500

    except Exception as e:
        return jsonify({"error": "Server error: " + str(e)}), 500


# 🚀 Run server
if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
