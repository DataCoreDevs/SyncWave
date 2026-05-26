document.addEventListener(
  "DOMContentLoaded",
  () => {

    const playerContainer =
      document.getElementById(
        "player-container"
      );

    if (!playerContainer)
      return;

    playerContainer.innerHTML =
      "";

    const songs = [

      { id: "5XeFesFbtLpXzIVDNQP22n", name: "I Wanna Be Yours" },
      { id: "2gYj9lubBorOPIVWsTXugG", name: "After LIKE" },
      { id: "58ge6dfP91o9oXMzq3XkIS", name: "505" },
      { id: "3JvKfv6T31zO0ini8iNItO", name: "Another Love" },
      { id: "0pqnGHJpmpxLKifKRmU6WP", name: "Believer" },
      { id: "7qEHsqek33rTcFNT9PFqLf", name: "Someone You Loved" },
      { id: "4QhWbupniDd44EDtnh2bFJ", name: "Pyramids" },
      { id: "2yss0n7KmvmSr4EHvjfFpn", name: "Don't Stay" },
      { id: "0u2P5u6lvoDfwTYjAADbn4", name: "lovely" },
      { id: "27NovPIUIRrOZoCHxABJwK", name: "Industry Baby" },
      { id: "1Y3LN4zO1Edc2EluIoSPJN", name: "Until I Found You" },
      { id: "4xqrdfXkTW4T0RauPLv3WA", name: "Heather" },
      { id: "463CkQjx2Zk1yXoBuierM9", name: "Levitating" },
      { id: "2pUpNOgJBIBCcjyQZQ00qU", name: "Feels Like Summer" },
      { id: "0tgVpDi06FyKpA1z0VMD4v", name: "Perfect" },
      { id: "2jz1bw1p0WQj0PDnVDP0uY", name: "Heat Waves" },
      { id: "02MWAaffLxlfxAUY7c5dvx", name: "I Ain't Worried" },
      { id: "0U1W2LZVUX7qTm7dDpqxh6", name: "When You're Gone" },
      { id: "3KkXRkHbMCARz0aVfEt68P", name: "Sunflower" },
      { id: "1D4PL9B8gOg78jiHg3FvBb", name: "Love Story" },
      { id: "4fYte8ZvTK14NEhAOZocBi", name: "Wine Pon You" }

    ];

    let shuffledSongs =
      JSON.parse(
        sessionStorage.getItem(
          "sessionSongs"
        )
      );

    if (!shuffledSongs) {

      shuffledSongs =
        [...songs].sort(
          () =>
            Math.random() - 0.5
        );

      sessionStorage.setItem(
        "sessionSongs",
        JSON.stringify(
          shuffledSongs
        )
      );

    }

    let currentIndex = 0;
    const SONGS_PER_LOAD = 5;

    function renderSongs() {

      const nextSongs =
        shuffledSongs.slice(

          currentIndex,

          currentIndex +
          SONGS_PER_LOAD

        );

      nextSongs.forEach(
        song => {

          const wrapper =
            document.createElement(
              "div"
            );

          wrapper.className =
            "song-wrapper";

          wrapper.innerHTML = `

            <iframe
              style="border-radius:16px"
              src="https://open.spotify.com/embed/track/${song.id}?theme=0"
              width="100%"
              height="152"
              frameborder="0"
              allow="autoplay; encrypted-media"
              loading="lazy">
            </iframe>

            <button
              class="btn-primary mark-played-btn">

              MARK AS PLAYED
            </button>

          `;

          const button =
            wrapper.querySelector(
              ".mark-played-btn"
            );

          button.addEventListener(
            "click",
            () => {

              let recent =
                JSON.parse(
                  sessionStorage.getItem(
                    "recentSongs"
                  )
                ) || [];

              recent =
                recent.filter(
                  s =>
                    s.id !==
                    song.id
                );

              recent.unshift(
                song
              );

              recent =
                recent.slice(
                  0,
                  25
                );

              sessionStorage.setItem(

                "recentSongs",

                JSON.stringify(
                  recent
                )

              );

              button.textContent =
                "PLAYED ✓";

              button.disabled =
                true;

            }
          );

          playerContainer
            .appendChild(
              wrapper
            );

        }
      );

      currentIndex +=
        SONGS_PER_LOAD;

      if (
        currentIndex >=
        shuffledSongs.length
      ) {

        loadMoreBtn
          .style.display =
          "none";

      }

    }

    const loadMoreBtn =
      document.createElement(
        "button"
      );

    loadMoreBtn.className =
      "btn-primary";

    loadMoreBtn.textContent =
      "LOAD MORE SONGS";

    loadMoreBtn.addEventListener(
      "click",
      renderSongs
    );

    renderSongs();

    playerContainer
      .appendChild(
        loadMoreBtn
      );

  }
);