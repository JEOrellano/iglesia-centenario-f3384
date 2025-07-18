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
          $response.querySelector(
            "h3"
          ).innerHTML = `Error ${err.status}: ${message}`;
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
