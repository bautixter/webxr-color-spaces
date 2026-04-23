import mimetypes
import os
import socket
import threading
import webbrowser
from flask import Flask, send_file

mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/css", ".css")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

EXERCISES = {
    "1": "exercise1.html",
    "2": "exercise2.html",
    "3": "exercise3.html"
}

app = Flask(__name__, static_folder=BASE_DIR)


@app.route("/")
@app.route("/<path:filename>")
def serve(filename=""):
    if not filename:
        filename = EXERCISES[chosen]
    return send_file(os.path.join(BASE_DIR, filename))


if __name__ == "__main__":
    print("Available exercises:")
    for key, val in EXERCISES.items():
        print(f"  {key}: {val}")

    while True:
        choice = input("Select exercise to run [1/2]: ").strip()
        if choice in EXERCISES:
            break
        print(f"Invalid choice. Enter one of: {', '.join(EXERCISES.keys())}")

    chosen = choice
    port = 8000

    with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
        s.connect(("8.8.8.8", 80))
        wifi_ip = s.getsockname()[0]

    url = f"https://localhost:{port}/{EXERCISES[chosen]}"
    wifi_url = f"https://{wifi_ip}:{port}/{EXERCISES[chosen]}"
    threading.Timer(0.5, lambda: webbrowser.open(url)).start()

    print(f"\n=== Practical Work #2 — Exercise {chosen} ===")
    print("Running with ad-hoc HTTPS (self-signed cert)")
    print(f"Local:  {url}")
    print(f"WiFi:   {wifi_url}")
    print("On your headset/device, navigate to the WiFi URL above.")
    print("You will need to accept the self-signed certificate warning.\n")

    app.run(host="0.0.0.0", port=port, ssl_context="adhoc")
