const folderInput = document.getElementById("folderInput");
const inputWrap = document.getElementById("inputWrap");
const cardWrap = document.getElementById("cardWrap");
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

let songIndex = 0;
let songFiles;
let api_key = "7a3bc5297588ff670d20342b059321e2";

folderInput.addEventListener("change", () => {
    cardWrap.style.visibility = "visible";
    inputWrap.style.visibillity = "hidden";
    songFiles = folderInput.files;
    loadSong(songFiles[songIndex]);
    console.log(songFiles);
});

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

function filterSong(file, callback) {
    if (file.name.split(".").pop() == "mp3") {
        let nameSplit = file.name.split(" - ");
        return [nameSplit[0], nameSplit[1].split(".")[0]];
    } else {
        callback();
        return;
    }
}

function loadSong(file, callback) {
    nameArr = filterSong(file, callback);
    console.log(nameArr);
    let name = nameArr[1];
    let artist = nameArr[0];
    songArtist.innerText = artist;
    songName.innerText = name;
    audio.src = URL.createObjectURL(file);
    loadImage(artist, name);
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
        songIndex = songFiles.length - 1;
    } else {
        songIndex--;
    }
    loadSong(songFiles[songIndex], prevSong);
    playSong();
}

function nextSong() {
    if (songIndex == songFiles.length - 1) {
        songIndex = 0;
    } else {
        songIndex++;
    }
    loadSong(songFiles[songIndex], nextSong);
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
