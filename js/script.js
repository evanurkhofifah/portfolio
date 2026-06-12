
// ========================
// ELEMENTS
// ========================
const heroBg = document.querySelector(".hero-bg");
const nav = document.querySelector(".nav");
const navLinks = document.querySelectorAll("nav a");
const pageSections = document.querySelectorAll("section");
const buttons = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.card');

const modal = document.getElementById("modal");
const modalTitle = document.getElementById("modalTitle");
const modalStack = document.getElementById("modal-stack");
const modalDesc = document.getElementById("modalDesc");
const demoLink = document.getElementById("demo-link");
const gallery = document.getElementById("gallery");

// HAMBURGER
const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector("nav");

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("open");
});

// Tutup menu pas link diklik
navMenu.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    hamburger.classList.remove("active");
    navMenu.classList.remove("open");
  });
});

// SKELETON
document.querySelectorAll(".card").forEach(card => {
  const imgDiv = card.querySelector(".img");
  const bgUrl = imgDiv?.style.backgroundImage.slice(5, -2);

  if (!imgDiv || !bgUrl) return;

  imgDiv.classList.add("skeleton");

  const tempImg = new Image();
  tempImg.src = bgUrl;
  tempImg.onload = () => {
    imgDiv.classList.remove("skeleton");
  };
});


// ========================
// LOAD PROJECTS FROM JSON
// ========================
async function loadProjects() {
  const res = await fetch("data/projects.json");
  const projects = await res.json();

  const grid = document.getElementById("grid");

  projects.forEach(project => {

    // Build project-images HTML
    const imagesHTML = project.images.map((src, i) =>
      `<img src="${src}" loading="lazy" ${i === project.featured ? 'class="featured"' : ''}>`
    ).join("");

    // BUILD card HTML
    const card = document.createElement("div");
    card.className = "card reveal";
    card.dataset.category = project.category;
    card.dataset.title = project.title;
    card.dataset.subtitle = project.subtitle || project.title;
    card.dataset.stack = project.stack.join(",");
    card.dataset.demo = project.demo;
    card.dataset.desc = buildDesc(project.desc, project.map || "");

    // DESC STRUCTURE
    function buildDesc(desc) {
      let html = "";

      // CERTIFICATION LAYOUT
      if (desc.issuer) {
        const isHKI = desc.registration !== undefined;

        html += `
        <div class="cert-meta">
          ${isHKI ? `
          <div class="cert-meta-item cert-hki-badge">
            <i class="fa-solid fa-shield-halved"></i>
            <div>
              <span class="cert-meta-label">Type</span>
              <span class="cert-meta-value">Hak Kekayaan Intelektual</span>
            </div>
          </div>` : ""}
          <div class="cert-meta-item">
            <i class="fa-solid fa-building-columns"></i>
            <div>
              <span class="cert-meta-label">Issued by</span>
              <span class="cert-meta-value">${desc.issuer}</span>
            </div>
          </div>
          <div class="cert-meta-item">
            <i class="fa-solid fa-calendar"></i>
            <div>
              <span class="cert-meta-label">Date</span>
              <span class="cert-meta-value">${desc.date}</span>
            </div>
          </div>
          ${isHKI ? `
          <div class="cert-meta-item">
            <i class="fa-solid fa-hashtag"></i>
            <div>
              <span class="cert-meta-label">Registration No.</span>
              <span class="cert-meta-value">${desc.registration}</span>
            </div>
          </div>` : ""}
        </div>`;

        if (desc.topics && desc.topics.length > 0) {
          html += `
          <div class="desc-block">
            <div class="desc-label">${isHKI ? "About this Work" : "Topics Covered"}</div>
            <div class="desc-result">
              ${desc.topics.map(topic => `
                <div class="result-item">
                  <i class="fa-solid fa-check"></i>
                  <span>${topic}</span>
                </div>
              `).join("")}
            </div>
          </div>`;
        }

        if (desc.embed) {
          html += `
          <div class="desc-block">
            <div class="desc-label">Certificate</div>
            <div class="desc-map">
              <iframe src="${desc.embed}" width="100%" height="450px" frameborder="0" loading="lazy"></iframe>
            </div>
          </div>`;
        }
        return html;
      }

      // PROJECT LAYOUT
      if (desc.overview) {
        html += `
        <div class="desc-block">
          <div class="desc-label">Overview</div>
          <p>${desc.overview}</p>
        </div>`;
      }

      if (desc.problem) {
        html += `
        <div class="desc-block">
          <div class="desc-label">Problem</div>
          <div class="desc-callout">${desc.problem}</div>
        </div>`;
      }

      if (desc.approach && desc.approach.length > 0) {
        html += `
        <div class="desc-block">
          <div class="desc-label">Approach</div>
          <div class="desc-approach">
            ${desc.approach.map(item => `
              <div class="approach-card">
                <i class="${item.icon}"></i>
                <div>
                  <strong>${item.title}</strong>
                  <p>${item.text}</p>
                </div>
              </div>
            `).join("")}
          </div>
        </div>`;
      }

      if (desc.result && desc.result.length > 0) {
        html += `
        <div class="desc-block">
          <div class="desc-label">Result</div>
          <div class="desc-result">
            ${desc.result.map(item => `
              <div class="result-item">
                <i class="fa-solid fa-check"></i>
                <span>${item}</span>
              </div>
            `).join("")}
          </div>
        </div>`;
      }

      if (desc.map) {
        html += `
        <div class="desc-block">
          <div class="desc-label">Interactive Map</div>
          <div class="desc-map">
            <iframe src="${desc.map}" width="100%" height="450px" frameborder="0" loading="lazy"></iframe>
          </div>
        </div>`;
      }
      return html;
    }

    card.innerHTML = `
      <div class="img" style="background-image:url('${project.preview}')"></div>
      <p>${project.title}</p>
      <div class="project-images">${imagesHTML}</div>
    `;

    grid.appendChild(card);
  });

  // Reinit setelah cards di-generate
  initCards();
  initFilter();

  // Langsung aktifin reveal untuk cards yang sudah keliatan
  requestAnimationFrame(() => {
    const trigger = window.innerHeight * 0.85;

    document.querySelectorAll(".reveal").forEach(el => {
      if (el.getBoundingClientRect().top < trigger) {
        el.classList.add("active");
      }
    });
  });
}

loadProjects();


// ========================
// MAIN SCROLL
// ========================
window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;

  // NAVBAR SHRINK
  if (scrollY > 50) {
    nav.classList.add("scrolled");
  } else {
    nav.classList.remove("scrolled");
  }

  // BACK TO TOP
  const backToTop = document.querySelector(".back-to-top");

  if (scrollY > 400) {
    backToTop.classList.add("visible");
  } else {
    backToTop.classList.remove("visible");
  }

  // REVEAL ANIMATION
  const trigger = window.innerHeight * 0.85;

  document.querySelectorAll(".reveal").forEach(el => {
    if (el.getBoundingClientRect().top < trigger) {
      if (!el.classList.contains("active")) {
        if (el.classList.contains("card")) {
          setTimeout(() => {
              el.classList.add("active");
          }, 300);
        } else {
          el.classList.add("active");
        }
      }
    }
  });

  // ACTIVE NAV SECTION
  let current = "";

  pageSections.forEach(section => {
    const top = section.offsetTop - 150;
    const height = section.clientHeight;

    if (scrollY >= top && scrollY < top + height) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === "#" + current) {
      link.classList.add("active");
    }
  });

});


// ========================
// INTRO
// ========================
window.addEventListener("load", () => {
  const intro = document.getElementById("intro");

  setTimeout(() => {
    intro.style.display = "none";
  }, 3000);

  // Langsung aktifin reveal yang ada di viewport
  const trigger = window.innerHeight * 0.85;
  reveals.forEach(el => {
    if (el.getBoundingClientRect().top < trigger) {
      el.classList.add("active");
    }
  });
});


// ========================
// SMOOTH SCROLL NAV
// ========================
function smoothScrollTo(targetY, duration = 1200) {
  const startY = window.scrollY;
  const distance = targetY - startY;
  let startTime = null;

  function easeInOutExpo(t) {
    if (t === 0) return 0;
    if (t === 1) return 1;
    if (t < 0.5) return Math.pow(2, 20 * t - 10) / 2;
    return (2 - Math.pow(2, -20 * t + 10)) / 2;
  }

  function animate(currentTime) {
    if (!startTime) startTime = currentTime;
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeInOutExpo(progress);

    window.scrollTo(0, startY + distance * ease);

    if (progress < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}

document.querySelectorAll("a[href^='#']").forEach(link => {
  link.addEventListener("click", (e) => {
    e.preventDefault();

    const href = link.getAttribute("href");

    if (href === "#") {
      smoothScrollTo(0);
      return;
    }

    const navHeight = document.querySelector(".nav").offsetHeight;      
    const target = document.querySelector(href);

    if (!target) return;
    smoothScrollTo(target.offsetTop - navHeight - 20);
  });
});


// ========================
// INIT FILTER
// ========================
function initFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.card');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      const filter = btn.dataset.filter;

      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      cards.forEach(card => {
        const category = card.dataset.category;

        if (filter === 'all' || category === filter) {
          card.style.display = 'block';
          card.style.opacity = '0';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.opacity = '1';
            });
          });
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });
}


// ========================
// CARDS (modal + hover)
// ========================
function initCards() {
  document.querySelectorAll(".card").forEach(card => {

    card.addEventListener("click", () => {
      modal.style.display = "flex";
      document.body.classList.add("modal-open");

      requestAnimationFrame(() => {
        modal.classList.add("show");
      });

      // modalTitle.innerHTML = card.dataset.title || "";
      modalTitle.innerHTML = card.dataset.subtitle || card.dataset.title || "";
      modalDesc.innerHTML = card.dataset.desc || "";

      gallery.replaceChildren();

      const images = card.querySelectorAll(".project-images img");

      gallery.className = "masonry";

      if (images.length === 1) gallery.classList.add("one");
      if (images.length === 2) gallery.classList.add("two");
      if (images.length === 3) gallery.classList.add("three");
      if (images.length >= 4) gallery.classList.add("four");

      images.forEach(image => {
        const img = document.createElement("img");
        img.src = image.src;

        if (image.classList.contains("featured")) {
          img.classList.add("featured");
        }

        img.addEventListener("click", () => {
          openLightbox(img.src);
        });

        gallery.appendChild(img);
      });

      const stacks = card.dataset.stack?.split(",").filter(s => s.trim()) || [];

      modalStack.innerHTML = "";
      stacks.forEach(stack => {
        const badge = document.createElement("span");
        badge.className = "stack-badge";
        badge.textContent = stack.trim();
        modalStack.appendChild(badge);
      });

      const demo = card.dataset.demo;

      if (demo) {
        demoLink.style.display = "flex";
        demoLink.href = demo;
      } else {
        demoLink.style.display = "none";
        demoLink.removeAttribute("href");
      }
    });

    // HOVER 3D
    const isMobile = window.innerWidth <= 768;

    if (!isMobile) {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -6;
        const rotateY = ((x - centerX) / centerX) * 6;

        card.style.transform = `
          perspective(1000px)
          rotateX(${rotateX}deg)
          rotateY(${rotateY}deg)
          scale(1.03)
        `;
      });

      card.addEventListener("mouseleave", () => {
        card.style.transform = "none";
      });
    }
  });
}


// ========================
// CLOSE MODAL
// ========================
function closeModal() {

  modal.classList.remove("show");
  document.body.classList.remove("modal-open");

  setTimeout(() => {
    modal.style.display = "none";
  }, 300);

}


// ========================
// LIGHTBOX
// ========================
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightbox-img");

function openLightbox(src) {
  lightboxImg.src = src;
  lightbox.style.display = "flex";
  requestAnimationFrame(() => {
    lightbox.classList.add("show");
  });
}

function closeLightbox() {
  lightbox.classList.remove("show");
  setTimeout(() => {
    lightbox.style.display = "none";
    lightboxImg.src = "";
  }, 300);
}

lightbox.addEventListener("click", (e) => {
  if (e.target !== lightboxImg) closeLightbox();
});

document.querySelector(".lightbox-close").onclick = closeLightbox;

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && lightbox.classList.contains("show")) {
    closeLightbox();
  }
});

document.querySelector(".close").onclick = closeModal;

window.onclick = (e) => {
  if (e.target === modal) closeModal();
};

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("show")) {
    closeModal();
  }
});