// ===========================
// main.js — Shared site logic
// ===========================

document.addEventListener('DOMContentLoaded', () => {

  // === Mobile hamburger menu toggle ===
  const toggle = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');

  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('active'));
    document.addEventListener('click', (e) => {
      if (!toggle.contains(e.target) && !links.contains(e.target)) {
        links.classList.remove('active');
      }
    });
  }

  // === Tools dropdown toggle (mobile tap) ===
  const dropdownToggle = document.querySelector('.dropdown-toggle');
  const dropdownMenu = document.querySelector('.dropdown-menu');
  if (dropdownToggle && dropdownMenu) {
    dropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      dropdownMenu.classList.toggle('show');
    });
  }

  // === Inject Share Section + Bookmark Reminder into all calculator pages ===
  const resultBox = document.getElementById('result-box');
  if (resultBox) {

    // 1. Add "Your calculated result is shown below" message (hidden initially)
    const resultMsg = document.createElement('div');
    resultMsg.className = 'result-message hidden';
    resultMsg.id = 'result-message';
    resultMsg.textContent = 'Your calculated result is shown below';
    resultBox.insertBefore(resultMsg, resultBox.firstChild);

    // 2. Add share section after result-box
    const shareSection = document.createElement('div');
    shareSection.className = 'share-section hidden';
    shareSection.id = 'share-section';
    shareSection.innerHTML = `
      <h4>Share this tool with friends</h4>
      <div class="share-buttons">
        <button class="btn-whatsapp" id="whatsapp-share-btn">WhatsApp Share</button>
        <button class="btn-copy-link" id="copy-link-btn">Copy Link</button>
      </div>
    `;
    resultBox.parentNode.insertBefore(shareSection, resultBox.nextSibling);

    // 3. Add bookmark reminder after share section
    const bookmark = document.createElement('div');
    bookmark.className = 'bookmark-reminder';
    bookmark.textContent = 'Bookmark this page to use it later (Ctrl+D)';
    shareSection.parentNode.insertBefore(bookmark, shareSection.nextSibling);

    // 4. Observe result-box visibility to show/hide share section
    const observer = new MutationObserver(() => {
      if (!resultBox.classList.contains('hidden')) {
        shareSection.classList.remove('hidden');
        resultMsg.classList.remove('hidden');
      } else {
        shareSection.classList.add('hidden');
        resultMsg.classList.add('hidden');
      }
    });
    observer.observe(resultBox, { attributes: true, attributeFilter: ['class'] });

    // 5. WhatsApp Share handler
    document.getElementById('whatsapp-share-btn').addEventListener('click', () => {
      const shareText = `I used this free student calculator, it's very useful: ${window.location.href}`;
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
      window.open(whatsappUrl, '_blank');
    });

    // 6. Copy Link handler
    document.getElementById('copy-link-btn').addEventListener('click', function() {
      const btn = this;
      navigator.clipboard.writeText(window.location.href).then(() => {
        btn.textContent = 'Link copied!';
        btn.classList.add('copied');
        setTimeout(() => {
          btn.textContent = 'Copy Link';
          btn.classList.remove('copied');
        }, 2000);
      });
    });
  }

  // === Inline error message + disable button when empty ===
  const calcBtn = document.getElementById('calculate-btn');
  if (calcBtn) {
    // 1. Create inline error message div above the button
    const errDiv = document.createElement('div');
    errDiv.id = 'calc-error-msg';
    errDiv.className = 'calc-error hidden';
    calcBtn.parentNode.insertBefore(errDiv, calcBtn);

    // 2. Global function to show error (replaces alert)
    window.showCalcError = function(msg) {
      errDiv.textContent = msg;
      errDiv.classList.remove('hidden');
      errDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => errDiv.classList.add('hidden'), 5000);
    };

    // 3. Disable button when number inputs are empty
    const calcCard = calcBtn.closest('.card, .calculator-card, .section') || calcBtn.parentElement;
    function checkInputs() {
      const inputs = calcCard.querySelectorAll('input[type="number"]');
      if (inputs.length === 0) { calcBtn.disabled = false; return; }
      const allFilled = [...inputs].some(inp => inp.value.trim() !== '');
      calcBtn.disabled = !allFilled;
      if (calcBtn.disabled) {
        calcBtn.style.opacity = '0.5';
        calcBtn.style.cursor = 'not-allowed';
      } else {
        calcBtn.style.opacity = '1';
        calcBtn.style.cursor = 'pointer';
      }
    }
    calcCard.addEventListener('input', checkInputs);
    // Also re-check when subjects/courses are added/removed
    const observer2 = new MutationObserver(checkInputs);
    observer2.observe(calcCard, { childList: true, subtree: true });
    checkInputs();
  }

  // === Smooth scroll for hero CTA ===
  const heroCta = document.querySelector('.btn-hero');
  if (heroCta) {
    heroCta.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(heroCta.getAttribute('href'));
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }
});
