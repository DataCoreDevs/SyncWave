document.addEventListener(
  "DOMContentLoaded",
  () => {

    const analyzeBtn =
      document.getElementById(
        "analyze-btn"
      );

    const popup =
      document.getElementById(
        "mood-popup"
      );

    const popupMood =
      document.getElementById(
        "popup-mood"
      );

    const closePopup =
      document.getElementById(
        "close-popup"
      );

    const moodText =
      document.getElementById(
        "current-mood"
      );

    async function
    loadFutureMood() {

      const moodEl =
        document.getElementById(
          "future-mood"
        );

      const history =
        JSON.parse(
          localStorage.getItem(
            "moodHistory"
          )
        ) || [];

      const moods =
        history.map(
          item =>
            item.mood
        );

      try {

        const response =
          await fetch(
            "/predict-mood",
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body:
                JSON.stringify({
                  history:
                    moods
                })
            }
          );

        const data =
          await response.json();

        moodEl.textContent =
          data.prediction;

      }

      catch {

        moodEl.textContent =
          "Unavailable";

      }

    }

    async function
    renderRecommendations(
      mood
    ) {

      const list =
        document.getElementById(
          "mood-recommendations"
        );

      list.innerHTML =
        "";

      const response =
        await fetch(
          `/recommendations/${mood}`
        );

      const songs =
        await response.json();

      songs.forEach(
        song => {

          const li =
            document.createElement(
              "li"
            );

          li.className =
            "recommendation-card";

          li.innerHTML =
            `
            <strong>
              🎵 ${song.track_name}
            </strong>
            <br>
            <span>
              ${song.artist}
            </span>
            `;

          list.appendChild(
            li
          );

        }
      );

    }

    const currentMood =
      localStorage.getItem(
        "currentMood"
      ) ||
      "Chill";

    moodText.textContent =
      currentMood;

    renderRecommendations(
      currentMood
    );

    loadFutureMood();

    analyzeBtn
      ?.addEventListener(
        "click",
        async () => {

          const recentSongs =
            JSON.parse(
              sessionStorage.getItem(
                "recentSongs"
              )
            ) || [];

          const last5 =
            recentSongs
            .slice(0, 5)
            .map(
              song =>
                song?.name
            )
            .filter(Boolean);

          if (
            last5.length < 1
          ) {

            alert(
              "Play at least one song first 🎧"
            );

            return;
          }

          try {

            const response =
              await fetch(
                "/analyze-mood",
                {
                  method:
                    "POST",

                  headers: {
                    "Content-Type":
                      "application/json"
                  },

                  body:
                    JSON.stringify({
                      songs:
                        last5
                    })
                }
              );

            const data =
              await response
                .json();

            const mood =
              data.mood;

            moodText.textContent =
              mood;

            localStorage.setItem(
              "currentMood",
              mood
            );

            renderRecommendations(
              mood
            );

            let history =
              JSON.parse(
                localStorage.getItem(
                  "moodHistory"
                )
              ) || [];

            history.push({

              mood:
                mood,

              date:
                new Date()
                .toLocaleDateString()

            });

            history =
              history.slice(
                -14
              );

            localStorage.setItem(
              "moodHistory",
              JSON.stringify(
                history
              )
            );

            loadFutureMood();

            popupMood.textContent =
              mood;

            popup.classList.remove(
              "hidden"
            );

          }

          catch {

            alert(
              "Mood Analysis failed, please try again."
            );

          }

        }
      );

    closePopup
      ?.addEventListener(
        "click",
        () => {

          popup.classList.add(
            "hidden"
          );

        }
      );

  }
);