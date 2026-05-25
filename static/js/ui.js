document.addEventListener(
  "DOMContentLoaded",
  () => {

    const currentPath =
      window.location.pathname;

    const moodBtns =
      document.querySelectorAll(
        ".mood-btn"
      );

    const moodEl =
      document.getElementById(
        "current-mood"
      );

    const changeMoodBtnPage =
      document.getElementById(
        "change-mood-btn-page"
      );

    /* ===========================
       ALWAYS OPEN FIRST-TIME PAGE
       ON FRESH APP OPEN
    =========================== */

    const skipFirstTime =
      sessionStorage.getItem(
        "skipFirstTime"
      );

    if (
      currentPath !==
        "/first-time" &&
      !skipFirstTime
    ) {

      window.location.href =
        "/first-time";

      return;
    }

    /* ===========================
       SAVE MOOD HISTORY
    =========================== */

    function saveMoodHistory(
      mood
    ) {

      const date =
        new Date();

      const day =
        date.getDate();

      const month =
        date.toLocaleString(
          "default",
          {
            month:
              "long"
          }
        );

      function getOrdinal(
        n
      ) {

        if (
          n > 3 &&
          n < 21
        ) return "th";

        switch (
          n % 10
        ) {

          case 1:
            return "st";

          case 2:
            return "nd";

          case 3:
            return "rd";

          default:
            return "th";

        }

      }

      const today =
        `${day}${getOrdinal(
          day
        )} ${month}`;

      let history =
        JSON.parse(
          localStorage.getItem(
            "moodHistory"
          )
        ) || [];

      history.push({

        date:
          today,

        mood:
          mood

      });

      // keep last 14 days
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

    }

    /* ===========================
       MOOD SELECTION
    =========================== */

    moodBtns.forEach(
      btn => {

        btn.addEventListener(
          "click",
          () => {

            const mood =
              btn.dataset
                .mood;

            // save current mood
            localStorage.setItem(
              "currentMood",
              mood
            );

            // save history
            saveMoodHistory(
              mood
            );

            // allow app access
            sessionStorage.setItem(
              "skipFirstTime",
              "true"
            );

            // redirect home
            window.location.href =
              "/";

          }
        );

      }
    );

    /* ===========================
       SHOW CURRENT MOOD
    =========================== */

    if (
      moodEl
    ) {

      moodEl.textContent =
        localStorage.getItem(
          "currentMood"
        ) ||
        "NOT SELECTED";

    }

    /* ===========================
       CHANGE MOOD BUTTON
    =========================== */

    if (
      changeMoodBtnPage
    ) {

      changeMoodBtnPage
        .addEventListener(
          "click",
          () => {

            sessionStorage.removeItem(
              "skipFirstTime"
            );

            window.location.href =
              "/first-time";

          }
        );

    }

  }
);