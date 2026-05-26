import json
import os
import random
from collections import Counter

BASE_DIR = os.path.dirname(
    os.path.abspath(__file__)
)

DATA_DIR = os.path.join(
    BASE_DIR,
    "data"
)


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

    clustered_path = os.path.join(
        DATA_DIR,
        "clustered_songs.json"
    )

    with open(
        clustered_path,
        "r",
        encoding="utf-8"
    ) as f:

        clustered_songs = (
            json.load(f)
        )

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

        song_name = str(
            song_name
        ).strip().lower()

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
                )
                .strip()
                .lower()
                ==
                song_name
            ),

            None

        )

        if match:

            matched_songs.append(
                match
            )

        else:

            print(
                f"Song not found: {song_name}"
            )

    # If nothing matched,
    # still return mood
    if len(
        matched_songs
    ) == 0:

        return random.choice([

            "Chill",
            "Romantic",
            "Energetic",
            "Sad"

        ])

    predicted_moods = []

    for song in (
        matched_songs
    ):

        predicted_moods.append(

            song.get(
                "mood",
                "Chill"
            )

        )

    final_mood = (
        Counter(
            predicted_moods
        )
        .most_common(1)[0][0]
    )

    return final_mood


def get_mood_recommendations(
    mood
):

    clustered_path = os.path.join(
        DATA_DIR,
        "clustered_songs.json"
    )

    with open(
        clustered_path,
        "r",
        encoding="utf-8"
    ) as f:

        clustered_songs = (
            json.load(f)
        )

    mood_songs = (
        clustered_songs.get(
            mood,
            []
        )
    )

    random.shuffle(
        mood_songs
    )

    selected_songs = (
        mood_songs[:5]
    )

    recommendations = []

    for song in (
        selected_songs
    ):

        recommendations.append({

            "track_name":
                song.get(
                    "track_name",
                    "Unknown Song"
                ),

            "artist":
                song.get(
                    "artists",
                    "Unknown Artist"
                )

        })

    return recommendations


def predict_next_mood(
    mood_history
):

    if len(
        mood_history
    ) < 5:

        return (
            "Not enough mood data yet"
        )

    last_5 = (
        mood_history[-5:]
    )

    mood_count = Counter(
        last_5
    )

    base_mood = (
        mood_count
        .most_common(1)[0][0]
    )

    # 70% same mood
    if random.random() < 0.7:

        return base_mood

    # 30% smart variation
    alternatives = {

        "Romantic": [
            "Chill",
            "Sad"
        ],

        "Chill": [
            "Romantic",
            "Energetic"
        ],

        "Energetic": [
            "Chill",
            "Romantic"
        ],

        "Sad": [
            "Chill",
            "Romantic"
        ]

    }

    return random.choice(

        alternatives.get(
            base_mood,
            ["Chill"]
        )

    )