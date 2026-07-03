/* ************ Servicios ************ */
// Modal reuniones
((d) => {
  const $updateButton = document.getElementById("updateDetails"),
    $cancelButton = document.getElementById("cancel"),
    $favDialog = document.getElementById("favDialog");

  // Update button opens a modal dialog
  if ($updateButton != null) {
    $updateButton.addEventListener("click", function () {
      $favDialog.showModal();
    });
  }

  // Form cancel button closes the dialog box
  if ($cancelButton != null) {
    $cancelButton.addEventListener("click", function () {
      $favDialog.close();
    });
  }
})(document);
// Modal bautismos
((d) => {
  const $updateButton = document.getElementById("updateDetailsBautismo"),
    $cancelButton = document.getElementById("cancelBautismo"),
    $favDialog = document.getElementById("favDialogBautismo");

  // Update button opens a modal dialog
  if ($updateButton != null) {
    $updateButton.addEventListener("click", function () {
      $favDialog.showModal();
    });
  }

  // Form cancel button closes the dialog box
  if ($cancelButton != null) {
    $cancelButton.addEventListener("click", function () {
      $favDialog.close();
    });
  }
})(document);
/* ************ Footer ************ */
// Fecha actual
const footerFecha = document.querySelector("footer span");
footerFecha.textContent += new Date().getFullYear() + " IEADCR";
/* ************ Menu ************ */
((d) => {
  const $btnMenu = d.querySelector(".menu-btn"),
    $menu = d.querySelector(".menu");

  $btnMenu.addEventListener("click", (e) => {
    $btnMenu.firstElementChild.classList.toggle("none");
    $btnMenu.lastElementChild.classList.toggle("none");
    $menu.classList.toggle("is-active");
  });

  d.addEventListener("click", (e) => {
    if (!e.target.matches(".menu a")) return false;

    $btnMenu.firstElementChild.classList.remove("none");
    $btnMenu.lastElementChild.classList.add("none");
    $menu.classList.remove("is-active");
  });
})(document);

/* ************ ContactForm ************ */
((d) => {
  const $form = d.querySelector(".contact-form"),
    $loader = d.querySelector(".contact-form-loader"),
    $response = d.querySelector(".contact-form-response");

  if ($form !== null) {
    // Selecciona el enlace que contiene el email
    const emailLink = document.querySelector('a[href^="mailto:"]');

    // Extrae el valor del atributo href (ej. "mailto:contacto@ejemplo.com")
    const emailHref = emailLink?.getAttribute("href");

    // Extrae solo el email (sin el "mailto:")
    const email = emailHref?.replace("mailto:", "");

    // Muestra el email en la consola
    /* console.log(email); */

    $form.addEventListener("submit", (e) => {
      e.preventDefault();
      $loader.classList.remove("none");
      fetch(`https://formsubmit.co/ajax/${email}`, {
        method: "POST",
        body: new FormData(e.target),
      })
        .then((res) => (res.ok ? res.json() : Promise.reject(res)))
        .then((json) => {
          console.log(json);
          location.hash = "#gracias";
          $form.reset();
        })
        .catch((err) => {
          console(err);
          let message =
            err.statusText || "Ocurrió un error al enviar, intenta nuevamente";
          $response.querySelector("h3").innerHTML =
            `Error ${err.status}: ${message}`;
        })
        .finally(() => {
          $loader.classList.add("none");
          setTimeout(() => {
            location.hash = "#cerrar";
          }, 3000);
        });
    });
  }
})(document);

/* PWA */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("https://jeorellano.github.io/iglesia-centenario-f3384/js/sw.js")
    .then((reg) => console.log("Registro de SW exitoso", reg))
    .catch((err) => console.warn("Error al tratar de registrar el sw", err));
}

/* ************ Podcast YouTube ************ */
((d) => {
  const container = d.getElementById("yt-player");

  if (!container) return;

  let player;
  let timer;

  const btn = d.getElementById("podcast-play");
  const progress = d.getElementById("podcast-progress");
  const current = d.getElementById("podcast-current");
  const duration = d.getElementById("podcast-duration");

  const formatTime = (sec) => {
    sec = Math.floor(sec);

    const m = Math.floor(sec / 60);
    const s = sec % 60;

    return `${m}:${String(s).padStart(2, "0")}`;
  };

  window.onYouTubeIframeAPIReady = () => {
    player = new YT.Player("yt-player", {
      width: 1,
      height: 1,

      videoId: container.dataset.video,

      playerVars: {
        controls: 0,
        modestbranding: 1,
        rel: 0,
      },

      events: {
        onReady: () => {
          duration.textContent = formatTime(player.getDuration());
        },

        onStateChange: (e) => {
          if (e.data === YT.PlayerState.PLAYING) {
            btn.textContent = "⏸";

            clearInterval(timer);

            timer = setInterval(() => {
              const now = player.getCurrentTime();
              const total = player.getDuration();

              current.textContent = formatTime(now);

              progress.value = total ? (now / total) * 100 : 0;
            }, 500);
          }

          if (
            e.data === YT.PlayerState.PAUSED ||
            e.data === YT.PlayerState.ENDED
          ) {
            btn.textContent = "▶";

            clearInterval(timer);
          }
        },
      },
    });
  };

  btn.addEventListener("click", () => {
    const state = player.getPlayerState();

    if (state === YT.PlayerState.PLAYING) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  });

  progress.addEventListener("input", () => {
    const total = player.getDuration();

    player.seekTo((total * progress.value) / 100, true);
  });
})(document);
