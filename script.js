// ...existing code...
const filterButtons = document.querySelectorAll(".filter-buttons button");
const gallery = document.getElementById("gallery");
const galleryItems = document.querySelectorAll(".gallery-item");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.querySelector(".lightbox-img");
const closeBtn = document.querySelector(".close");
const searchBar = document.getElementById("search-bar");
const galleryPrev = document.getElementById("gallery-prev");
const galleryNext = document.getElementById("gallery-next");

let currentIndex = 0;
let visibleItems = [];
let galleryStart = 0;
const cardsPerRow = () => window.innerWidth < 600 ? 1 : window.innerWidth < 900 ? 2 : 4;

function updateVisibleItems() {
  visibleItems = Array.from(document.querySelectorAll(".gallery-item:not(.hide)"));
}

function showGalleryRow() {
  const items = Array.from(document.querySelectorAll(".gallery-item"));
  let visibleItems = items.filter(item => !item.classList.contains("hide"));
  const perRow = cardsPerRow();
  visibleItems.forEach((item, i) => {
    if (i >= galleryStart && i < galleryStart + perRow) {
      item.style.display = "block";
    } else {
      item.style.display = "none";
    }
    // Remove any previous not-found message
    const msg = item.querySelector(".not-found-message");
    if (msg) msg.remove();
    // If image is missing, show message
    const img = item.querySelector("img");
    if (!img || !img.src) {
      const notFound = document.createElement("div");
      notFound.className = "not-found-message";
      notFound.textContent = "Image not found";
      item.appendChild(notFound);
    }
  });
  galleryPrev.style.display = galleryStart > 0 ? "inline-block" : "none";
  galleryNext.style.display = (galleryStart + perRow < visibleItems.length) ? "inline-block" : "none";
}

function filterGalleryByCategory(category) {
  let found = false;
  galleryItems.forEach((item) => {
    if (category === "all" || item.classList.contains(category)) {
      item.classList.remove("hide");
      found = true;
    } else {
      item.classList.add("hide");
    }
  });
  updateVisibleItems();
  galleryStart = 0;
  showGalleryRow();
}

filterButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelector(".filter-buttons .active").classList.remove("active");
    btn.classList.add("active");
    const filter = btn.getAttribute("data-filter");
    filterGalleryByCategory(filter);
    searchBar.value = "";
  });
});

searchBar.addEventListener("input", (e) => {
  const val = e.target.value.trim().toLowerCase();
  if (!val) {
    filterGalleryByCategory("all");
    document.querySelector(".filter-buttons .active").classList.remove("active");
    filterButtons[0].classList.add("active");
    return;
  }
  let found = false;
  galleryItems.forEach((item) => {
    const cats = Array.from(item.classList).filter(c => c !== "gallery-item");
    if (cats.some(c => c.toLowerCase().includes(val))) {
      item.classList.remove("hide");
      found = true;
    } else {
      item.classList.add("hide");
    }
  });
  updateVisibleItems();
  galleryStart = 0;
  showGalleryRow();
});

galleryItems.forEach((item, index) => {
  item.addEventListener("click", () => {
    updateVisibleItems();
    currentIndex = visibleItems.indexOf(item);
    showLightbox();
  });
});

function showLightbox() {
  lightbox.classList.add("active");
  const img = visibleItems[currentIndex].querySelector("img");
  lightboxImg.src = img.src;
}

function closeLightbox() {
  lightbox.classList.remove("active");
}


closeBtn.addEventListener("click", closeLightbox);

// Gallery navigation buttons scroll the gallery row
galleryPrev.addEventListener("click", () => {
  const perRow = cardsPerRow();
  galleryStart = Math.max(0, galleryStart - 1);
  showGalleryRow();
});

galleryNext.addEventListener("click", () => {
  const perRow = cardsPerRow();
  const items = Array.from(document.querySelectorAll(".gallery-item"));
  let visibleItems = items.filter(item => !item.classList.contains("hide"));
  galleryStart = Math.min(visibleItems.length - perRow, galleryStart + 1);
  showGalleryRow();
});

window.addEventListener("resize", () => {
  showGalleryRow();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.classList.contains("active")) return;
  // Removed lightbox navigation
  if (e.key === "Escape") closeLightbox();
});

// Initial setup
updateVisibleItems();
showGalleryRow();
