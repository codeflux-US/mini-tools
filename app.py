import os
from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)

# 🔐 Only allow your frontend
ALLOWED_ORIGIN = os.getenv("ALLOWED_ORIGIN")

CORS(app)

# 🔒 Rate limit
limiter = Limiter(get_remote_address, app=app, default_limits=["15 per minute"])

@app.route('/')
def home():
    return "Backend Running 🚀"

@app.route('/fetch')
@limiter.limit("7 per minute")
def fetch_site():
    url = request.args.get('url')

    if not url:
        return jsonify({"error": "URL required"}), 400

    origin = request.headers.get("Origin")

# Allow browser direct access bhi
if origin and origin != ALLOWED_ORIGIN:
    return jsonify({"error": "Blocked"}), 403
    
    try:
        res = requests.get(url, timeout=8)

        soup = BeautifulSoup(res.text, 'html.parser')

        css = [link.get('href') for link in soup.find_all('link')]
        js = [script.get('src') for script in soup.find_all('script')]

        return jsonify({
            "html": res.text,
            "css": css,
            "js": js,
            "status": res.status_code
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run()
