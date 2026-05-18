document.addEventListener("DOMContentLoaded", async () => {
  const changeMoodBtn = document.getElementById("change-mood-btn");
  const moodEl = document.getElementById("current-mood");
  const analyzeBtn = document.getElementById("analyze-btn");
  const historyList = document.getElementById("history-list");
  const recentList = document.getElementById("recent-list");
  const recList = document.getElementById("mood-recommendations");
  const moodBtns = document.querySelectorAll(".mood-btn");

  if (!localStorage.getItem("currentMood")) {
    if (window.location.pathname !== "/first-time") {
      window.location.href = "/first-time";
    }
  }

  if (changeMoodBtn) {
    changeMoodBtn.addEventListener("click", () => {
      window.location.href = "/first-time";
    });
  }

  moodBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      const mood = btn.dataset.mood;
      localStorage.setItem("currentMood", mood);
      window.location.href = "/";
    });
  });

  const currentMood = localStorage.getItem("currentMood");

  if (moodEl) {
    moodEl.textContent = currentMood || "Not set";
  }

  if (recList && currentMood) {
    const res = await fetch("/api/songs");
    const songs = await res.json();

    const filtered = songs.filter(song =>
      song.moods.includes(currentMood)
    );

    recList.innerHTML = "";

    filtered.forEach(song => {
      const li = document.createElement("li");
      li.textContent = `${song.title} • ${song.artist}`;
      recList.appendChild(li);
    });
  }

  if (analyzeBtn) {
    analyzeBtn.addEventListener("click", () => {
      const history = JSON.parse(localStorage.getItem("moodHistory") || "[]");

      history.unshift({
        mood: currentMood,
        time: Date.now()
      });

      localStorage.setItem(
        "moodHistory",
        JSON.stringify(history.slice(0, 14))
      );

      window.location.href = "/history";
    });
  }

  if (historyList) {
    const history = JSON.parse(
      localStorage.getItem("moodHistory") || "[]"
    );

    history.forEach(item => {
      const li = document.createElement("li");

      li.textContent =
        `${item.mood} • ${new Date(item.time).toDateString()}`;

      historyList.appendChild(li);
    });
  }

  if (recentList) {
    const song = {
      title: "I Wanna Be Yours",
      artist: "Arctic Monkeys"
    };

    let recent = JSON.parse(
      localStorage.getItem("recentPlays") || "[]"
    );

    if (!recent.length || recent[0].title !== song.title) {
      recent.unshift(song);
    }

    recent = recent.slice(0, 25);

    localStorage.setItem(
      "recentPlays",
      JSON.stringify(recent)
    );

    recent.forEach(item => {
      const li = document.createElement("li");

      li.textContent =
        `${item.title} • ${item.artist}`;

      recentList.appendChild(li);
    });
  }
});