/* ============================================================
   Nexus Explorer — Vanilla JS
   Handles: dark mode toggle, keyboard shortcut (S), mobile nav, example data
   ============================================================ */

'use strict';

/* ============================================================
   Dark mode — no-transition flash prevention
   ============================================================ */
function initTheme() {
  var stored = localStorage.getItem('avail-theme');
  var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  var isDark = stored ? stored === 'dark' : prefersDark;

  if (isDark) {
    document.documentElement.classList.add('dark');
    showIcon('sun');
  } else {
    document.documentElement.classList.remove('dark');
    showIcon('moon');
  }
}

function toggleTheme() {
  var isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('avail-theme', isDark ? 'dark' : 'light');
  showIcon(isDark ? 'sun' : 'moon');
}

function showIcon(which) {
  var sun = document.getElementById('icon-sun');
  var moon = document.getElementById('icon-moon');
  if (sun) sun.style.display = which === 'sun' ? 'block' : 'none';
  if (moon) moon.style.display = which === 'moon' ? 'block' : 'none';
}

var themeToggle = document.getElementById('theme-toggle');
if (themeToggle) {
  themeToggle.addEventListener('click', toggleTheme);
}

/* ============================================================
   Mobile menu
   ============================================================ */
var mobileMenuToggle = document.getElementById('mobile-menu-toggle');
var mobileNav = document.getElementById('mobile-nav');

function toggleMobileMenu() {
  var isOpen = mobileNav.classList.toggle('mobile-nav--open');
  mobileMenuToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
  mobileNav.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
}

if (mobileMenuToggle && mobileNav) {
  mobileMenuToggle.addEventListener('click', toggleMobileMenu);

  // Close mobile menu when clicking a link
  var mobileLinks = mobileNav.querySelectorAll('.mobile-nav__link');
  mobileLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      mobileNav.classList.remove('mobile-nav--open');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
      mobileNav.setAttribute('aria-hidden', 'true');
    });
  });
}

/* ============================================================
   Keyboard shortcut — S to focus search
   ============================================================ */
document.addEventListener('keydown', function(e) {
  // Ignore if user is typing in an input
  var tag = document.activeElement ? document.activeElement.tagName : '';
  if (tag === 'INPUT' || tag === 'TEXTAREA') return;

  if (e.key === 's' || e.key === 'S') {
    e.preventDefault();
    var searchBar = document.querySelector('.search-bar');
    if (searchBar) searchBar.focus();
  }

  // Escape to close mobile menu
  if (e.key === 'Escape' && mobileNav && mobileNav.classList.contains('mobile-nav--open')) {
    mobileNav.classList.remove('mobile-nav--open');
    mobileMenuToggle.setAttribute('aria-expanded', 'false');
    mobileNav.setAttribute('aria-hidden', 'true');
  }
});

/* ============================================================
   Example data — ready to replace with real API calls
   ============================================================ */
var EXAMPLE_STATS = {
  latestBlock: 31009,
  totalRFFs:   0,
  fulfilled:   0,
  pending:     0,
};

var EXAMPLE_BLOCKS = [
  { height: 31009, hash: '0x05aefb…1f6aa5', timestamp: 'less than a minute ago', txCount: 2, isNew: true },
  { height: 31008, hash: '0x1e47a2…06f2ff', timestamp: 'less than a minute ago', txCount: 2, isNew: false },
  { height: 31007, hash: '0xac8203…c070e4', timestamp: '1 minute ago',            txCount: 2, isNew: false },
  { height: 31006, hash: '0x4f19e5…a2a5e4', timestamp: '2 minutes ago',           txCount: 1, isNew: false },
  { height: 31005, hash: '0x2fec3d…097d65', timestamp: '3 minutes ago',           txCount: 1, isNew: false },
];

var EXAMPLE_RFFS = [];

/* ============================================================
   Render helpers
   ============================================================ */
function renderStats(stats) {
  var el;
  el = document.getElementById('stat-latest-block');
  if (el) el.textContent = stats.latestBlock.toLocaleString();
  el = document.getElementById('stat-total-rffs');
  if (el) el.textContent = stats.totalRFFs.toLocaleString();
  el = document.getElementById('stat-fulfilled');
  if (el) el.textContent = stats.fulfilled.toLocaleString();
  el = document.getElementById('stat-pending');
  if (el) el.textContent = stats.pending.toLocaleString();
}

function renderBlocks(blocks) {
  var container = document.getElementById('blocks-list');
  if (!container) return;

  if (blocks.length === 0) {
    container.innerHTML = '<div class="empty-state"><p class="empty-state__body">No blocks found.</p></div>';
    return;
  }

  container.innerHTML = blocks.map(function(block) {
    return '<div class="data-row' + (block.isNew ? ' is-new' : '') + '">' +
      '<div class="data-row__left">' +
        '<span class="data-row__block-num">#' + block.height.toLocaleString() + '</span>' +
        '<span class="data-row__hash">' + block.hash + '</span>' +
        (block.isNew ? '<span class="badge-new">NEW</span>' : '') +
      '</div>' +
      '<div class="data-row__meta">' +
        '<span class="data-row__time">' + block.timestamp + '</span>' +
        '<span class="data-row__txs">' + block.txCount + (block.txCount === 1 ? ' tx' : ' txs') + '</span>' +
      '</div>' +
    '</div>';
  }).join('');
}

/* ============================================================
   Boot
   ============================================================ */
initTheme();
renderStats(EXAMPLE_STATS);
renderBlocks(EXAMPLE_BLOCKS);