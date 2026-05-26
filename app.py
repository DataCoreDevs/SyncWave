from flask import (
    Flask,
    render_template,
    jsonify,
    redirect,
    request
)

from services import (
    load_songs,
    load_moods,
    analyze_user_mood,
    get_mood_recommendations,
    predict_next_mood
)

app = Flask(__name__)


@app.route("/")
def home():
    return render_template(
        "home.html"
    )


@app.route("/first-time")
def first_time():
    return render_template(
        "first_time.html"
    )


@app.route("/mood")
def mood():
    return render_template(
        "mood.html"
    )


@app.route("/recent")
def recent():
    return render_template(
        "recent.html"
    )


@app.route("/history")
def history():
    return render_template(
        "history.html"
    )


@app.route("/about")
def about():
    return render_template(
        "about.html"
    )


@app.route("/api/songs")
def get_songs():
    return jsonify(
        load_songs()
    )


@app.route("/api/moods")
def get_moods():
    return jsonify(
        load_moods()
    )


@app.route(
    "/analyze-mood",
    methods=["POST"]
)
def analyze_mood():

    data = request.get_json()

    recent_songs = data.get(
        "songs",
        []
    )

    mood = analyze_user_mood(
        recent_songs
    )

    return jsonify({

        "mood":
            mood

    })


@app.route(
    "/recommendations/<mood>"
)
def recommendations(
    mood
):

    songs = (
        get_mood_recommendations(
            mood
        )
    )

    return jsonify(
        songs
    )

@app.route(
    "/predict-mood",
    methods=["POST"]
)
def predict_mood():

    data = request.get_json()

    history = data.get(
        "history",
        []
    )

    prediction = (
        predict_next_mood(
            history
        )
    )

    return jsonify({

        "prediction":
            prediction

    })

@app.route("/check")
def check():
    return redirect(
        "/first-time"
    )


if __name__ == "__main__":
    app.run(
        debug=True
    )