/**
 * KEEYCODE - MAIN JAVASCRIPT
 * Form validation, EmailJS integration, Scroll animations, Navbar scroll behavior
 */

document.addEventListener('DOMContentLoaded', function () {

  /* ------------------------------------------------------------------------
     1. NAVBAR SCROLL EFFECT & MOBILE MENU CLOSE ON CLICK
     ------------------------------------------------------------------------ */
  const navbar = document.querySelector('.navbar');

  function handleNavbarScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleNavbarScroll);
  handleNavbarScroll(); // Initial check

  // Close mobile nav when clicking a link
  const navLinks = document.querySelectorAll('.nav-link, .navbar-nav .btn');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
        if (bsCollapse) {
          bsCollapse.hide();
        }
      }
    });
  });

  /* ------------------------------------------------------------------------
     2. SMOOTH SCROLLING FOR ANCHORS
     ------------------------------------------------------------------------ */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || !targetId) return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  /* ------------------------------------------------------------------------
     3. INTERSECTION OBSERVER FOR SCROLL ANIMATIONS
     ------------------------------------------------------------------------ */
  const animatedElements = document.querySelectorAll(
    '.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-flip, .reveal-blur, .reveal-bounce'
  );

  if ('IntersectionObserver' in window) {
    const observerOptions = {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.12
    };

    const scrollObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target); // Animate once
        }
      });
    }, observerOptions);

    animatedElements.forEach(function (el) {
      scrollObserver.observe(el);
    });
  } else {
    // Fallback if IntersectionObserver is not supported
    animatedElements.forEach(function (el) {
      el.classList.add('active');
    });
  }

  /* ------------------------------------------------------------------------
     4. EMAILJS & CONTACT FORM HANDLING
     ------------------------------------------------------------------------ */
  if (typeof emailjs !== 'undefined') {
    emailjs.init({
      publicKey: "sn9hABtKnXFqE485C"
    });
  }

  const contactForm = document.getElementById("contactForm");
  const btnEnviar = document.getElementById("btnEnviar");

  if (contactForm && btnEnviar) {
    contactForm.addEventListener("submit", function (event) {
      event.preventDefault();

      const errores = validarFormularioContacto();

      if (errores.length > 0) {
        showCustomAlert(
          "error",
          "Revisa el formulario",
          errores[0]
        );
        return;
      }

      const textoOriginal = btnEnviar.textContent;

      btnEnviar.disabled = true;
      btnEnviar.textContent = "Enviando solicitud...";

      emailjs.sendForm(
        "service_hwmld54",
        "template_r2zntzm",
        contactForm
      )
      .then(function () {
        showCustomAlert(
          "success",
          "Solicitud enviada",
          "Gracias por contactarnos. Pronto nos comunicaremos contigo."
        );

        contactForm.reset();

        contactForm
          .querySelectorAll(".input-error, .input-success")
          .forEach(function (campo) {
            campo.classList.remove("input-error", "input-success");
          });
      })
      .catch(function (error) {
        console.error("Error al enviar el correo:", error);

        showCustomAlert(
          "error",
          "No se pudo enviar",
          "Ocurrió un problema al enviar tu solicitud. Intenta nuevamente."
        );
      })
      .finally(function () {
        btnEnviar.disabled = false;
        btnEnviar.textContent = textoOriginal;
      });
    });
  }

});

/* --------------------------------------------------------------------------
   5. FORM VALIDATION HELPERS & CUSTOM ALERT FUNCTIONS
   -------------------------------------------------------------------------- */
let customAlertTimeout;

function showCustomAlert(type, title, message) {
  const alertBox = document.getElementById("customAlert");
  const alertIcon = document.getElementById("customAlertIcon");
  const alertTitle = document.getElementById("customAlertTitle");
  const alertMessage = document.getElementById("customAlertMessage");

  if (!alertBox || !alertIcon || !alertTitle || !alertMessage) return;

  clearTimeout(customAlertTimeout);

  alertBox.className = "custom-alert";
  alertBox.classList.add(type);

  alertTitle.textContent = title;
  alertMessage.textContent = message;

  if (type === "success") {
    alertIcon.textContent = "✓";
  } else if (type === "error") {
    alertIcon.textContent = "!";
  } else {
    alertIcon.textContent = "i";
  }

  setTimeout(function () {
    alertBox.classList.add("show");
  }, 50);

  customAlertTimeout = setTimeout(function () {
    hideCustomAlert();
  }, 4500);
}

function hideCustomAlert() {
  const alertBox = document.getElementById("customAlert");
  if (alertBox) {
    alertBox.classList.remove("show");
  }
}

function limpiarEstadoCampo(campo) {
  if (campo) {
    campo.classList.remove("input-error", "input-success");
  }
}

function marcarCampoError(campo) {
  if (campo) {
    campo.classList.remove("input-success");
    campo.classList.add("input-error");
  }
}

function marcarCampoValido(campo) {
  if (campo) {
    campo.classList.remove("input-error");
    campo.classList.add("input-success");
  }
}

function esCorreoValido(correo) {
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexCorreo.test(correo);
}

function validarFormularioContacto() {
  const contactForm = document.getElementById("contactForm");
  if (!contactForm) return [];

  const nombre = contactForm.elements["nombre_completo"];
  const correo = contactForm.elements["correo"];
  const necesidad = contactForm.elements["necesidad"];
  const descripcion = contactForm.elements["descripcion"];

  let errores = [];

  [nombre, correo, necesidad, descripcion].forEach(limpiarEstadoCampo);

  if (!nombre.value.trim()) {
    errores.push("El nombre completo es obligatorio.");
    marcarCampoError(nombre);
  } else {
    marcarCampoValido(nombre);
  }

  if (!correo.value.trim()) {
    errores.push("El correo electrónico es obligatorio.");
    marcarCampoError(correo);
  } else if (!esCorreoValido(correo.value.trim())) {
    errores.push("Ingresa un correo electrónico válido.");
    marcarCampoError(correo);
  } else {
    marcarCampoValido(correo);
  }

  if (!necesidad.value.trim()) {
    errores.push("Selecciona el servicio que necesitas desarrollar.");
    marcarCampoError(necesidad);
  } else {
    marcarCampoValido(necesidad);
  }

  if (!descripcion.value.trim()) {
    errores.push("La descripción del proyecto es obligatoria.");
    marcarCampoError(descripcion);
  } else if (descripcion.value.trim().length < 10) {
    errores.push("La descripción debe tener al menos 10 caracteres.");
    marcarCampoError(descripcion);
  } else {
    marcarCampoValido(descripcion);
  }

  return errores;
}
