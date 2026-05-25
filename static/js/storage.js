// RECENT SONG STORAGE

function getRecentSongs() {

  const data =
    localStorage.getItem(
      "recentSongs"
    );

  return data
    ? JSON.parse(data)
    : [];
}

function saveRecentSong(
  song
) {

  let recent =
    getRecentSongs();

  // Remove duplicates
  recent =
    recent.filter(
      s => s.id !== song.id
    );

  // Add newest first
  recent.unshift(song);

  // Max 25 songs
  recent =
    recent.slice(0, 25);

  localStorage.setItem(
    "recentSongs",
    JSON.stringify(
      recent
    )
  );

}