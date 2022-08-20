const card = document.getElementById("card");
const songImage = document.getElementById("img");
const audio = document.getElementById("audio");
const songArtist = document.getElementById("songArtist");
const songName = document.getElementById("songName");
const prevSongBtn = document.getElementById("prevSong");
const playPauseSongBtn = document.getElementById("playPauseSong");
const nextSongBtn = document.getElementById("nextSong");
const progressbar = document.getElementById("progressbar");
const progressbarValue = document.getElementById("progressbarValue");

let songs = [
    "Dream - Mask",
    "Bonobo - Linked (Original Mix)",
    "Sati Akura - NIGHT RUNNING",
    "X Ambassadors - Shining",
    "Mick Gordon - At Doom's Gate",
    "mxnarch - Japanese Stutter",
    "Monsta - Holdin' On",
];
let songIndex = 0;

let api_key = "7a3bc5297588ff670d20342b059321e2";

loadSong(songs[songIndex]);

prevSongBtn.addEventListener("click", () => {
    prevSong();
});

playPauseSong.addEventListener("click", () => {
    let isPlaying = card.classList.contains("play");
    if (isPlaying) {
        pauseSong();
    } else {
        playSong();
    }
});

nextSongBtn.addEventListener("click", () => {
    nextSong();
});

audio.addEventListener("timeupdate", updateProgress);

progressbar.addEventListener("click", setProgress);

function loadSong(song) {
    let artist = song.split(" - ")[0];
    let name = song.split(" - ")[1];
    loadImage(artist, name);
    songArtist.innerText = name;
    songName.innerText = artist;
    audio.src = `songs/${song}.mp3`;
}

async function loadImage(artist, name) {
    try {
        let result = await fetch(
            `http://ws.audioscrobbler.com/2.0/?method=track.getinfo&api_key=${api_key}&artist=${artist}&track=${name}&format=json`
        );
        let data = await result.json();
        console.log(data);
        let length = data.track.album.image.length;
        let imageSource = data.track.album.image[length - 1];
        if (imageSource["#text"] == "") {
            songImage.src = "source.png";
            return;
        }
        songImage.src = imageSource["#text"];
    } catch (err) {
        songImage.src = "source.png";
    }
}

function prevSong() {
    if (songIndex == 0) {
        songIndex = songs.length - 1;
    } else {
        songIndex--;
    }
    loadSong(songs[songIndex]);
    playSong();
}

function nextSong() {
    if (songIndex == songs.length - 1) {
        songIndex = 0;
    } else {
        songIndex++;
    }
    loadSong(songs[songIndex]);
    playSong();
}

function playSong() {
    card.classList.add("play");
    playPauseSongBtn.src = "pauseSongsvg.svg";
    audio.play();
}

function pauseSong() {
    card.classList.remove("play");
    playPauseSongBtn.src = "playSongsvg.svg";
    audio.pause();
}

function updateProgress() {
    let { duration, currentTime } = audio;
    console.log(`${(currentTime / duration) * 100}%`);
    progressbarValue.style.width = `${(currentTime / duration) * 100 + 1}%`;
}

function setProgress(event) {
    let width = progressbar.offsetWidth;
    let clickCord = event.offsetX;
    let duration = audio.duration;
    audio.currentTime = (clickCord / width) * duration;
}
