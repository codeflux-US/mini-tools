import os
from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS

# 🔥 flask-limiter fix
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)

ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN")

CORS(app)

# ✅ Proper limiter setup
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

    if not url:
        return jsonify({"error": "URL required"}), 400

    # 🔐 Origin check fix
    origin = request.headers.get("Origin")
    if origin and origin != ALLOWED_ORIGIN:
        return jsonify({"error": "Blocked"}), 403

    try:
        res = requests.get(url, timeout=8)
        
        soup = BeautifulSoup(res.text, 'html.parser')
formatted_html = soup.prettify()

        css = [link.get('href') for link in soup.find_all('link')]
        js = [script.get('src') for script in soup.find_all('script')]

        return jsonify({
            "html": formatted_html,
            "css": css,
            "js": js,
            "status": res.status_code
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run()
