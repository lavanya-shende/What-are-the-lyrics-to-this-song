const artistInput = document.getElementById("artistInput");
const titleSelect = document.getElementById("title");
const lyricsDiv = document.getElementById("lyrics");
const btn = document.getElementById("btn");
const apiKey = "e4d8c32381534b610051427d94e18c81";

// Autocomplete artist names from MusicBrainz
artistInput.addEventListener("input", async (e) => {
  const query = e.target.value;
  if (!query.trim()) return;

  const res = await fetch(`https://musicbrainz.org/ws/2/artist?query=${query}&fmt=json`);
  const data = await res.json();

  const datalist = document.getElementById("artistList");
  datalist.innerHTML = "";

  data.artists.slice(0, 5).forEach((artist) => {
    const option = document.createElement("option");
    option.value = artist.name;
    datalist.appendChild(option);
  });
});

// Load songs after artist is selected
artistInput.addEventListener("change", async () => {
  const artistName = artistInput.value.trim();
  if (!artistName) return;

  const res = await fetch(`https://ws.audioscrobbler.com/2.0/?method=artist.gettoptracks&artist=${encodeURIComponent(artistName)}&api_key=${apiKey}&format=json`);
  const data = await res.json();

  const tracks = data.toptracks?.track || [];
  const songList = document.getElementById("songList");
  songList.innerHTML = "";

  tracks.forEach((track) => {
    const option = document.createElement("option");
    option.value = track.name;
    songList.appendChild(option);
  });
});


// Fetch lyrics
btn.addEventListener("click", async () => {
  const artist = artistInput.value.trim();
  const title = titleSelect.value.trim();

  if (!artist || !title) {
    lyricsDiv.innerText = "Please select an artist and a song!";
    return;
  }

  try {
    const res = await fetch(`https://api.lyrics.ovh/v1/${artist}/${title}`);
    const data = await res.json();
    lyricsDiv.innerText = data.lyrics || "Lyrics not found 😢";
  } catch (err) {
    lyricsDiv.innerText = "Error fetching lyrics!";
  }
});
