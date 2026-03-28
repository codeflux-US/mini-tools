from flask import Flask, request, jsonify
import requests
from bs4 import BeautifulSoup
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

app = Flask(__name__)

API_KEY = "mysecret123"
ALLOWED_ORIGIN = "https://your-username.github.io"

CORS(app)

limiter = Limiter(get_remote_address, app=app, default_limits=["10 per minute"])

@app.route('/fetch')
@limiter.limit("5 per minute")
def fetch_site():
    url = request.args.get('url')

    if request.headers.get("x-api-key") != API_KEY:
        return jsonify({"error": "Unauthorized"}), 403

    origin = request.headers.get("Origin")
    if origin != ALLOWED_ORIGIN:
        return jsonify({"error": "Blocked origin"}), 403

    try:
        res = requests.get(url, timeout=5)

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
        return jsonify({"error": str(e)})

if __name__ == "__main__":
    app.run()
