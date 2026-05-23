document.addEventListener("DOMContentLoaded", () => {

  const currentPath =
    window.location.pathname;

  const moodBtns =
    document.querySelectorAll(".mood-btn");

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
    currentPath !== "/first-time" &&
    !skipFirstTime
  ) {

    window.location.href =
      "/first-time";

    return;
  }

  /* ===========================
     MOOD SELECTION
  =========================== */

  moodBtns.forEach(btn => {

    btn.addEventListener(
      "click",
      () => {

        const mood =
          btn.dataset.mood;

        localStorage.setItem(
          "currentMood",
          mood
        );

        // allow access to home
        sessionStorage.setItem(
          "skipFirstTime",
          "true"
        );

        window.location.href =
          "/";
      }
    );

  });

  /* ===========================
     SHOW CURRENT MOOD
  =========================== */

  if (moodEl) {

    moodEl.textContent =
      localStorage.getItem(
        "currentMood"
      ) || "NOT SELECTED";
  }

  /* ===========================
     CHANGE MOOD BUTTON
  =========================== */

  if (changeMoodBtnPage) {

    changeMoodBtnPage.addEventListener(
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

});