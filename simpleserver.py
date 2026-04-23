import mimetypes
import os
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

    url = f"http://localhost:{port}/{EXERCISES[chosen]}"
    threading.Timer(0.5, lambda: webbrowser.open(url)).start()
    print(f"Serving {EXERCISES[chosen]} at {url}")
    app.run(port=port)
