const player = document.querySelector('.player'),
  playerTitle = document.querySelector('.player__title'),
  playerMainVideo = document.querySelector('#player__main-video'),
  playerTrackBar = document.querySelector('.player__track-bar'),
  playerButtonPlayStop = document.querySelector('.player__button-play-stop'),
  playIconMain = document.getElementById('play-icon-main'),
  pauseIconMain = document.getElementById('pause-icon-main'),
  playIconMenu = document.getElementById('play-icon-menu'),
  pauseIconMenu = document.getElementById('pause-icon-menu'),
  playerButtonSkipForward = document.querySelector('.player__button-skip-forward'),
  playerVolumeInput = document.querySelector('.player__volume-input'),
  playerTime = document.querySelector('.player__time'),
  playerButtonFullscreen = document.querySelector('.player__button-fullscreen'),
  playerButtonMain = document.getElementById('player-button-main'),
  playerButtonMenu = document.getElementById('player-button-menu');

function setVideoTitleFromSrc() {
  const src = playerMainVideo.currentSrc || playerMainVideo.src;

  const fileName = src.split('/').pop().split('.')[0];

  playerTitle.textContent = fileName;
}

playerMainVideo.addEventListener('loadedmetadata', setVideoTitleFromSrc);

function formatTime(timeInSeconds) {
  const minutes = Math.floor(timeInSeconds / 60);
  const seconds = Math.floor(timeInSeconds % 60);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function updateVideoTimeDisplay() {
  const current = formatTime(playerMainVideo.currentTime);
  const total = formatTime(playerMainVideo.duration || 0);
  playerTime.textContent = `${current} / ${total}`;
}

playerMainVideo.addEventListener('timeupdate', updateVideoTimeDisplay);

playerMainVideo.addEventListener('loadedmetadata', updateVideoTimeDisplay);

const trackBarContainer = document.querySelector('.player__track-bar-container');
let isDragging = false;
let dragPercent = 0;

function updateProgressBar(percent) {
  playerTrackBar.style.width = percent + '%';
}

function setProgressByClientX(clientX) {
  const rect = trackBarContainer.getBoundingClientRect();
  let posX = clientX - rect.left;

  if (posX < 0) posX = 0;
  if (posX > rect.width) posX = rect.width;

  dragPercent = (posX / rect.width) * 100;
  updateProgressBar(dragPercent);
}

trackBarContainer.addEventListener('mousedown', (e) => {
  isDragging = true;
  setProgressByClientX(e.clientX);
});

document.addEventListener('mousemove', (e) => {
  if (isDragging) {
    setProgressByClientX(e.clientX);
  }
});

document.addEventListener('mouseup', (e) => {
  if (isDragging) {
    isDragging = false;
    playerMainVideo.currentTime = (dragPercent / 100) * playerMainVideo.duration;
  }
});

trackBarContainer.addEventListener('click', (e) => {
  if (!isDragging) {
    setProgressByClientX(e.clientX);
    playerMainVideo.currentTime = (dragPercent / 100) * playerMainVideo.duration;
  }
});

playerMainVideo.addEventListener('timeupdate', () => {
  if (!isDragging) {
    const percent = (playerMainVideo.currentTime / playerMainVideo.duration) * 100;
    updateProgressBar(percent);
  }
});

playerMainVideo.addEventListener('loadedmetadata', () => {
  const percent = (playerMainVideo.currentTime / playerMainVideo.duration) * 100 || 0;
  updateProgressBar(percent);
});

playerVolumeInput.value = playerMainVideo.volume * 100;

playerVolumeInput.addEventListener('input', (e) => {
  const volume = e.target.value / 100;
  playerMainVideo.volume = volume;
});

function updatePlayPauseIcons(isPlaying) {
  if (isPlaying) {
    playIconMain.classList.add('hidden');
    pauseIconMain.classList.remove('hidden');
    playIconMenu.classList.add('hidden');
    pauseIconMenu.classList.remove('hidden');
  } else {
    pauseIconMain.classList.add('hidden');
    playIconMain.classList.remove('hidden');
    pauseIconMenu.classList.add('hidden');
    playIconMenu.classList.remove('hidden');
  }
}

function togglePlayPause() {
  if (playerMainVideo.paused) {
    playerMainVideo.play();
  } else {
    playerMainVideo.pause();
  }
}

playerButtonMain.addEventListener('click', togglePlayPause);
playerButtonMenu.addEventListener('click', togglePlayPause);

playerMainVideo.addEventListener('play', () => updatePlayPauseIcons(true));
playerMainVideo.addEventListener('pause', () => updatePlayPauseIcons(false));

const fullscreenButton = document.querySelector('.player__button-fullscreen');
const playerContainer = document.querySelector('.player');

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    if (playerContainer.requestFullscreen) {
      playerContainer.requestFullscreen();
    } else if (playerContainer.webkitRequestFullscreen) {
      playerContainer.webkitRequestFullscreen();
    } else if (playerContainer.msRequestFullscreen) {
      playerContainer.msRequestFullscreen();
    }
  } else {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  }
}

fullscreenButton.addEventListener('click', toggleFullscreen);

document.addEventListener('fullscreenchange', () => {
  if (document.fullscreenElement) {
    fullscreenButton.classList.add('is-fullscreen');
  } else {
    fullscreenButton.classList.remove('is-fullscreen');
  }
});

let controlsTimeout;

function showControls() {
  player.classList.remove('hide-controls');
  clearTimeout(controlsTimeout);
  controlsTimeout = setTimeout(() => {
    if (!playerMainVideo.paused) {
      player.classList.add('hide-controls');
    }
  }, 1000);
}

player.addEventListener('mousemove', showControls);
player.addEventListener('click', showControls);
document.addEventListener('keydown', showControls);

playerMainVideo.addEventListener('play', () => {
  showControls();
});

playerMainVideo.addEventListener('pause', () => {
  player.classList.remove('hide-controls');
  clearTimeout(controlsTimeout);
});