import json
import os
import joblib
from collections import Counter

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

DATA_DIR = os.path.join(
    BASE_DIR,
    "data"
)

FEATURES = [
    "danceability",
    "energy",
    "valence",
    "tempo",
    "acousticness",
    "instrumentalness",
    "speechiness",
    "liveness",
    "popularity"
]


def load_songs():

    path = os.path.join(
        DATA_DIR,
        "songs.json"
    )

    if not os.path.exists(
        path
    ):
        return []

    with open(
        path,
        "r",
        encoding="utf-8"
    ) as f:

        return json.load(f)


def load_moods():

    path = os.path.join(
        DATA_DIR,
        "moods.json"
    )

    if not os.path.exists(
        path
    ):
        return {}

    with open(
        path,
        "r",
        encoding="utf-8"
    ) as f:

        return json.load(f)


def analyze_user_mood(
    played_songs
):

    kmeans_path = os.path.join(
        DATA_DIR,
        "kmeans_model.pkl"
    )

    scaler_path = os.path.join(
        DATA_DIR,
        "scaler.pkl"
    )

    clustered_path = os.path.join(
        DATA_DIR,
        "clustered_songs.json"
    )

    # LOAD MODELS
    kmeans = joblib.load(
        kmeans_path
    )

    scaler = joblib.load(
        scaler_path
    )

    # LOAD SONG DATA
    with open(
        clustered_path,
        "r",
        encoding="utf-8"
    ) as f:

        clustered_songs = (
            json.load(f)
        )

    # FLATTEN SONGS
    all_songs = []

    for mood in (
        clustered_songs
    ):

        all_songs.extend(
            clustered_songs[
                mood
            ]
        )

    matched_songs = []

    for song_name in (
        played_songs
    ):

        match = next(

            (
                song
                for song in
                all_songs
                if str(
                    song.get(
                        "track_name",
                        ""
                    )
                ).lower()
                ==
                str(
                    song_name
                ).lower()
            ),

            None

        )

        if match:

            matched_songs.append(
                match
            )

    # FALLBACK
    if len(
        matched_songs
    ) == 0:

        return "Chill"

    predicted_moods = []

    for song in (
        matched_songs
    ):

        feature_vector = [

            song.get(
                feature,
                0
            )

            for feature in
            FEATURES

        ]

        scaled_vector = (
            scaler.transform(
                [feature_vector]
            )
        )

        # RUN KMEANS
        kmeans.predict(
            scaled_vector
        )

        predicted_moods.append(

            song.get(
                "mood",
                "Chill"
            )

        )

    # MAJORITY VOTE
    final_mood = (
        Counter(
            predicted_moods
        )
        .most_common(1)[0][0]
    )

    return final_mood