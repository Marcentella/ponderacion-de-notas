//  Open settings

const settingsToggle = document.getElementById('settings-toggle');
const settingsClose = document.getElementById('settings-close');
const overlay = document.querySelector('.overlay');
const settingsWrap = document.querySelector('.container-wrap.settings-wrap');

settingsToggle.addEventListener('click', (e) => {
  e.preventDefault();

  // First make it visible
  settingsWrap.classList.add('active');
  overlay.classList.add('active');

  // Then trigger the animation
  requestAnimationFrame(() => {
    settingsWrap.classList.add('show');
    settingsWrap.classList.remove('hide');
  });
});

settingsClose.addEventListener('click', (e) => {
  e.preventDefault();

  overlay.classList.remove('active');
  settingsWrap.classList.remove('show');
  settingsWrap.classList.add('hide');

  // Wait for the animation to finish, then hide it from layout
  setTimeout(() => {
    settingsWrap.classList.remove('active');
  }, 300); // match the CSS transition time
});

overlay.addEventListener('click', () => {
  overlay.classList.remove('active');
  settingsWrap.classList.remove('show');
  settingsWrap.classList.add('hide');

  setTimeout(() => {
    settingsWrap.classList.remove('active');
  }, 300);
});


// Close settings when clicking the close button.

settingsClose.addEventListener('click', (event) => {
  event.preventDefault(); // Prevents link from navigating
  overlay.classList.remove('active');
  settingsWrap.classList.remove('active');
});

// Close settings when clicking outside

overlay.addEventListener('click', () => {
  overlay.classList.remove('active');
  settingsWrap.classList.remove('active');
});

// Toggle exam

const examToggle = document.getElementById('exam_toggle');
const examenWrap = document.getElementById('examen-wrap');
examToggle.addEventListener('click', () => {
  examenWrap.classList.toggle('active');
});

// Animate settings window

settingsToggle.addEventListener('click', (event) => {
  event.preventDefault();
  overlay.classList.add('active');
  settingsWrap.classList.add('active');
});

settingsClose.addEventListener('click', (event) => {
  event.preventDefault();
  overlay.classList.remove('active');
  settingsWrap.classList.remove('active');
});

overlay.addEventListener('click', () => {
  overlay.classList.remove('active');
  settingsWrap.classList.remove('active');
});

