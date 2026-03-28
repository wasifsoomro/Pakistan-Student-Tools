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

  // === WhatsApp SVG icon ===
  const waIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.625.846 5.059 2.284 7.034L.789 23.492l4.635-1.448A11.93 11.93 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.75c-2.16 0-4.16-.686-5.795-1.852l-.36-.243-2.805.877.748-2.733-.267-.388A9.716 9.716 0 012.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75z"/></svg>`;
  const waIconLg = waIcon.replace('width="16" height="16"', 'width="18" height="18"');
  const copyIcon = `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>`;
  const linkIcon = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/></svg>`;

  // === Helper: extract result value from a result box ===
  function getResultText(box) {
    const pctEl = box.querySelector('#percentage') || document.getElementById('percentage');
    const aggEl = box.querySelector('#aggregate') || document.getElementById('aggregate');
    const cgpaEl = box.querySelector('#cumulative-cgpa');
    const gpaEl = box.querySelector('#cgpa');
    if (pctEl && pctEl.textContent.trim()) return pctEl.textContent.trim();
    if (aggEl && aggEl.textContent.trim()) return aggEl.textContent.trim();
    if (cgpaEl && cgpaEl.textContent.trim()) return cgpaEl.textContent.trim() + ' CGPA';
    if (gpaEl && gpaEl.textContent.trim()) return gpaEl.textContent.trim() + ' GPA';
    const rv = box.querySelector('.result-value');
    if (rv && rv.textContent.trim()) return rv.textContent.trim();
    return '';
  }

  // === Helper: build share message ===
  function buildShareMsg(box) {
    const result = getResultText(box);
    const pageName = document.title.split('—')[0].trim();
    if (result) {
      return `I just calculated my result using ${pageName} and got ${result}! Check yours here: ${window.location.href}`;
    }
    return `I used this free student calculator, it's very useful: ${window.location.href}`;
  }

  // === Inject share UI for a given result-box element ===
  function setupShareForResultBox(rBox, suffix) {
    const sfx = suffix || '';

    // 1. Result message
    const resultMsg = document.createElement('div');
    resultMsg.className = 'result-message hidden';
    resultMsg.textContent = 'Your calculated result is shown below';
    rBox.insertBefore(resultMsg, rBox.firstChild);

    // 2. Dynamic "Share Your Result" section
    const resultShare = document.createElement('div');
    resultShare.className = 'result-share hidden';
    resultShare.innerHTML = `
      <div class="result-share-header">
        <span class="result-share-icon">🎉</span>
        <h4>Share Your Result</h4>
      </div>
      <p class="result-share-text"></p>
      <div class="share-buttons">
        <button class="btn-share-result js-wa-result">${waIconLg} WhatsApp</button>
        <button class="btn-share-copy js-copy-result">${copyIcon} Copy Message</button>
      </div>
    `;
    rBox.parentNode.insertBefore(resultShare, rBox.nextSibling);

    // 3. Tool share section
    const shareSection = document.createElement('div');
    shareSection.className = 'share-section hidden';
    shareSection.innerHTML = `
      <h4>Know someone who needs this? Share it!</h4>
      <div class="share-buttons">
        <button class="btn-whatsapp js-wa-tool">${waIcon} Send on WhatsApp</button>
        <button class="btn-copy-link js-copy-link">${linkIcon} Copy Link</button>
      </div>
    `;
    resultShare.parentNode.insertBefore(shareSection, resultShare.nextSibling);

    // 4. Bookmark reminder
    const bookmark = document.createElement('div');
    bookmark.className = 'bookmark-reminder';
    bookmark.textContent = 'Bookmark this page to use it later (Ctrl+D)';
    shareSection.parentNode.insertBefore(bookmark, shareSection.nextSibling);

    // 5. Observe visibility
    const observer = new MutationObserver(() => {
      if (!rBox.classList.contains('hidden')) {
        resultMsg.classList.remove('hidden');
        const msg = buildShareMsg(rBox);
        resultShare.querySelector('.result-share-text').textContent = `"${msg}"`;
        resultShare.classList.remove('hidden');
        resultShare.style.opacity = '0';
        requestAnimationFrame(() => { resultShare.style.opacity = '1'; });
        shareSection.classList.remove('hidden');
      } else {
        resultMsg.classList.add('hidden');
        resultShare.classList.add('hidden');
        shareSection.classList.add('hidden');
      }
    });
    observer.observe(rBox, { attributes: true, attributeFilter: ['class'] });

    // 6. Event handlers
    resultShare.querySelector('.js-wa-result').addEventListener('click', () => {
      window.open(`https://wa.me/?text=${encodeURIComponent(buildShareMsg(rBox))}`, '_blank');
    });

    resultShare.querySelector('.js-copy-result').addEventListener('click', function() {
      const btn = this;
      navigator.clipboard.writeText(buildShareMsg(rBox)).then(() => {
        btn.innerHTML = 'Copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.innerHTML = `${copyIcon} Copy Message`; btn.classList.remove('copied'); }, 2000);
      });
    });

    shareSection.querySelector('.js-wa-tool').addEventListener('click', () => {
      const shareText = `I used this free student calculator, it's very useful: ${window.location.href}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
    });

    shareSection.querySelector('.js-copy-link').addEventListener('click', function() {
      const btn = this;
      navigator.clipboard.writeText(window.location.href).then(() => {
        btn.textContent = 'Link copied!';
        btn.classList.add('copied');
        setTimeout(() => { btn.innerHTML = `${linkIcon} Copy Link`; btn.classList.remove('copied'); }, 2000);
      });
    });
  }

  // === Apply share injection to ALL result boxes on the page ===
  // Skip boxes that already have hardcoded share sections after them
  const resultBoxes = document.querySelectorAll('.result-box');
  resultBoxes.forEach((box, i) => {
    const next = box.nextElementSibling;
    if (next && next.classList.contains('result-share')) return; // already has share UI
    setupShareForResultBox(box, i > 0 ? '-' + i : '');
  });

  // === Inline error message + disable button when empty ===
  const calcBtn = document.getElementById('calculate-btn');
  if (calcBtn) {
    const errDiv = document.createElement('div');
    errDiv.id = 'calc-error-msg';
    errDiv.className = 'calc-error hidden';
    calcBtn.parentNode.insertBefore(errDiv, calcBtn);

    window.showCalcError = function(msg) {
      errDiv.textContent = msg;
      errDiv.classList.remove('hidden');
      errDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      setTimeout(() => errDiv.classList.add('hidden'), 5000);
    };

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
