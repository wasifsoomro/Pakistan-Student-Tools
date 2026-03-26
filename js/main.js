// ===========================
// main.js — Shared site logic
// ===========================

// Mobile hamburger menu toggle
// Opens/closes the nav-links panel on small screens
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    // Toggle menu visibility on hamburger click
    toggle.addEventListener('click', () => links.classList.toggle('active'));

    // Close menu when clicking outside of it
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('active');
      }
    });
  }

  // Tools dropdown toggle (desktop hover is CSS, this handles mobile tap)
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      dropdownMenu.classList.toggle('show');
    });
  }
});
