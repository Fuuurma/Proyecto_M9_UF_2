/*
  En el JS básicamente se realizan 2 acciones: 
    1- Ocultar / Mostrar los elementos dependiendo del comportamiento del usuario.
    2- Funcionalidades del vídeo. 

*/

const containers = document.querySelectorAll(".container");
const icons = document.querySelectorAll(
  ".actions-container div, .links-container a"
);
const infoLink = document.querySelector(".information");
const contactLink = document.querySelector(".contact");
const form = document.querySelector(".form");

const carouselButtons = document.querySelectorAll(".carousel-button");
const carouselImages = document.querySelectorAll(".carousel-images img");
const tittleImages = document.querySelectorAll(".img-title");
const imageContainer = document.getElementsByClassName("image");

let currentContainer;

// Muestra/Ocuulta los diferentes containers
let toggleContainer = (container) => {
  if (currentContainer) {
    // ya hay 1 visible
    currentContainer.classList.remove("visible");
  }
  container.classList.add("visible"); // este container es el nuevo visible
  currentContainer = container;

  // Ocultar/Mostrar el botón de pasar imagenes
  if (
    container.classList.contains("info-container") ||
    container.classList.contains("form") ||
    container.classList.contains("audio-container") ||
    container.classList.contains("video-container")
    //container.classList.contains("image-container")
  ) {
    toggleCarouselButtons(false);
  } else {
    toggleCarouselButtons(true);
  }
};
// true, false
let toggleCarouselButtons = (visible) => {
  carouselButtons.forEach((button) => {
    button.classList.toggle("inactive", !visible);
  });
};

// Aplica las acciones para Audio, Video, image
icons.forEach((icon) => {
  icon.addEventListener("click", (e) => {
    const container = document.querySelector(
      `.${e.currentTarget.dataset.element}`
    );
    toggleContainer(container); // muestra su container

    // Elimina el seleccionado
    Array.from(icons).forEach((icon) => {
      icon.closest("div").classList.remove("selected");
    });

    // Añade seleccionado, ouclta el container bienvenida
    e.currentTarget.closest("div").classList.add("selected");
    const welcomeContainer = document.querySelector(".welcome-container");
    welcomeContainer.classList.remove("visible");
    welcomeContainer.style.zIndex = 101;
  });
});

// Aplica las acciones para contacto
contactLink.addEventListener("click", (e) => {
  e.preventDefault();
  toggleContainer(form);
  toggleCarouselButtons(false);
});

// Aplica las acciones para Información
infoLink.addEventListener("click", (e) => {
  e.preventDefault();
  const infoContainer = document.querySelector(".info-container");
  toggleContainer(infoContainer);
  toggleCarouselButtons(false);
});

let currentImageIndex = 0;
// Logica para ir pasando las imaágenes
carouselButtons.forEach((button, index) => {
  button.addEventListener("click", () => {
    // va pasando, si supera el length vuelva a 0
    currentImageIndex =
      currentImageIndex === carouselImages.length - 1
        ? 0
        : currentImageIndex + 1;

    // actualiza el indice
    const newIndex = currentImageIndex;

    // Muestra/Oculta acorde al indice
    carouselImages.forEach((image, i) => {
      if (i === newIndex) {
        image.classList.add("active");
        image.classList.remove("inactive");
        tittleImages[i].classList.add("active");
        tittleImages[i].classList.remove("inactive");

        // La información extra siempre oculta al principio
        const imgInfos = document.querySelectorAll(".img-info");
        imgInfos.forEach((imgInfo) => {
          imgInfo.classList.add("inactive");
        });

        const imgInfo = imgInfos[newIndex].previousElementSibling;
        imgInfo.classList.remove("inactive");
      } else {
        image.classList.remove("active");
        image.classList.add("inactive");
        tittleImages[i].classList.remove("active");
        tittleImages[i].classList.add("inactive");
      }
    });
  });
});

const mediaTitles = document.querySelectorAll(".media-types .media-tittle");
// Misma logica de Ocultar/Mostrar pero para los titulos del container de beinvenida
mediaTitles.forEach((mediaTitle) => {
  mediaTitle.addEventListener("click", (e) => {
    const container = document.querySelector(
      `${e.currentTarget.dataset.container}`
    );
    toggleContainer(container);
    // caso imagenes, por el boton del carusel
    if (container.classList.contains("image-container")) {
      toggleCarouselButtons(true);

      Array.from(mediaTitles).forEach((mt) => {
        if (!mt.classList.contains("media-tittle-img")) {
          mt.querySelector("h1").classList.add("inactive");
        }
      });
    } else {
      toggleCarouselButtons(false);
      Array.from(mediaTitles).forEach((mt) => {
        mt.querySelector("h1").classList.remove("inactive");
      });
    }
    // El container de bienvenida no vuelve a mostrarse
    const welcomeContainer = document.querySelector(".welcome-container");
    welcomeContainer.classList.remove("visible");
  });
});

// Botones mas info imagenes
const imgInfoBtns = document.querySelectorAll(".img-info-btn");

imgInfoBtns.forEach((imgInfoBtn) => {
  imgInfoBtn.addEventListener("click", () => {
    const imgInfo = imgInfoBtn.closest(".img-title").nextElementSibling;
    imgInfo.classList.toggle("inactive");
    imgInfoBtn.classList.toggle("active");
  });
});

// Controles para audio
const allAudioContainers = document.querySelectorAll(".audio-container");

allAudioContainers.forEach((audioContainer) => {
  const audio = audioContainer.querySelector("audio");
  const musicIcon = audioContainer.querySelector(".fa-music");

  const backwards = audioContainer.querySelector(".backward");
  const play = audioContainer.querySelector(".play-btn");
  const forwards = audioContainer.querySelector(".forward");
  const volumeDownBtn = audioContainer.querySelector(".volume-down-btn");
  const volumeUpBtn = audioContainer.querySelector(".volume-up-btn");
  const repeatBtn = audioContainer.querySelector(".repeat-btn");

  const lengthBar = audioContainer.querySelector(".audio-length-bar");
  const tracker = audioContainer.querySelector(".audio-length-tracker");
  const audioTimer = audioContainer.querySelector(".audio-timer");

  audio.addEventListener("loadedmetadata", () => {
    updateAudioTimer(audio, audioTimer);
    updateProgressBar(audio, lengthBar, tracker);
  });

  audio.addEventListener("timeupdate", () => {
    updateAudioTimer(audio, audioTimer);
    updateProgressBar(audio, lengthBar, tracker);
  });

  play.addEventListener("click", () => {
    let icon = play.querySelector("i");
    if (icon.classList.contains("fa-play")) {
      icon.classList.remove("fa-play");
      icon.classList.add("fa-stop");
      playAudio(audio);
    } else {
      icon.classList.remove("fa-stop");
      icon.classList.add("fa-play");
      pauseAudio(audio);
    }
  });

  volumeDownBtn.addEventListener("click", () => {
    volumeDown(audio);
  });

  volumeUpBtn.addEventListener("click", () => {
    volumeUp(audio);
  });

  backwards.addEventListener("click", () => {
    goBackward(audio);
  });

  forwards.addEventListener("click", () => {
    goForward(audio);
  });

  repeatBtn.addEventListener("click", () => {
    toggleRepeat(audio, repeatBtn);
  });

  audio.addEventListener("ended", () => {
    if (repeatBtn.classList.contains("active")) {
      audio.currentTime = 0;
      audio.play();
    }
  });

  musicIcon.addEventListener("click", () => {
    toggleTable(audio);
  });

  audioContainer.addEventListener("mouseenter", () => {
    audioContainer.style.border = "1px solid grey";
    lengthBar.style.height = "10px";
    tracker.style.height = "10px";
  });

  audioContainer.addEventListener("mouseleave", () => {
    audioContainer.style.border = "1px solid rgba(7,3,53,1)";
    lengthBar.style.height = "5px";
    tracker.style.height = "5px";
  });
});

// helper functions

function playAudio(audio) {
  audio.play();
}

function pauseAudio(audio) {
  audio.pause();
}

function volumeUp(audio) {
  const maxVolume = 1;
  const addVolume = 0.1;
  audio.volume = Math.min(audio.volume + addVolume, maxVolume);
}

function volumeDown(audio) {
  const minVolume = 0;
  const lessVolume = 0.1;
  audio.volume = Math.max(audio.volume - lessVolume, minVolume);
}

function updateAudioTimer(audio, audioTimer) {
  const currentTime = formatTime(audio.currentTime);
  const duration = formatTime(audio.duration);
  audioTimer.textContent = `${currentTime} / ${duration}`;
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${padZero(minutes)}:${padZero(seconds)}`;
}

function padZero(num) {
  return num < 10 ? `0${num}` : num;
}

function goBackward(audio) {
  audio.currentTime = Math.max(0, audio.currentTime - 5);
}

function goForward(audio) {
  audio.currentTime = Math.min(audio.duration, audio.currentTime + 5);
}

function toggleRepeat(audio, repeatBtn) {
  repeatBtn.classList.toggle("active");
}

function updateProgressBar(audio, lengthBar, tracker) {
  const percentPlayed = (audio.currentTime / audio.duration) * 100;
  if (percentPlayed > 0.1) {
    lengthBar.style.background = `linear-gradient(to right, #3c728a ${percentPlayed}%, #aaaaaa ${percentPlayed}%)`;
    tracker.style.display = "none";
  }

  lengthBar.addEventListener("click", (event) => {
    const barRect = lengthBar.getBoundingClientRect();
    const clickX = event.clientX - barRect.left;
    const newPercent = (clickX / barRect.width) * 100;
    const newTime = (newPercent / 100) * audio.duration;

    audio.currentTime = newTime;
  });
}
