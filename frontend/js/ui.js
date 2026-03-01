// ─── Toast notification ─────────────────────────────────────────
export function toast(msg, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        document.body.appendChild(container);
    }
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = msg;
    container.appendChild(el);
    setTimeout(() => el.remove(), 3200);
}

// ─── Date/time helpers ─────────────────────────────────────────
export function formatDate(iso) {
    if (!iso) return '—';
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
        hour: '2-digit', minute: '2-digit', hour12: true,
    }).format(new Date(iso));
}

export function formatDateShort(iso) {
    if (!iso) return '—';
    return new Intl.DateTimeFormat('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
    }).format(new Date(iso));
}

// ─── Seat progress bar color ────────────────────────────────────
export function seatColor(available, total) {
    if (total === 0) return 'red';
    const ratio = available / total;
    if (ratio > 0.5) return 'green';
    if (ratio > 0.2) return 'yellow';
    return 'red';
}

// ─── Category chip color ─────────────────────────────────────────
export function categoryChip(cat) {
    return `<span class="chip chip-accent">${cat}</span>`;
}

// ─── Seat chip ───────────────────────────────────────────────────
export function seatChip(available, total) {
    const cls = available === 0 ? 'chip-danger' : available <= total * 0.2 ? 'chip-warning' : 'chip-success';
    const label = available === 0 ? 'Full' : `${available} / ${total} seats`;
    return `<span class="chip ${cls}">🪑 ${label}</span>`;
}

// ─── Build event card HTML ───────────────────────────────────────
export function buildEventCard(ev, registeredIds = new Set()) {
    const fill = ev.total_seats ? Math.round((ev.available_seats / ev.total_seats) * 100) : 0;
    const color = seatColor(ev.available_seats, ev.total_seats);
    const isReg = registeredIds.has(ev.id);
    return `
    <div class="card event-card" onclick="window.location='/event-detail.html?id=${ev.id}'">
      <div class="event-meta">
        ${categoryChip(ev.category)}
        ${seatChip(ev.available_seats, ev.total_seats)}
        ${!ev.is_active ? '<span class="chip chip-muted">Inactive</span>' : ''}
        ${isReg ? '<span class="chip chip-accent">✓ Registered</span>' : ''}
      </div>
      <div class="event-title">${ev.title}</div>
      ${ev.clubs ? `<div class="text-muted">🏫 ${ev.clubs.name}</div>` : ''}
      <div class="event-desc">${ev.description || 'No description provided.'}</div>
      <div class="flex gap-1 items-center mt-1">
        <span class="text-muted">📅 ${formatDate(ev.event_date)}</span>
        ${ev.venue ? `<span class="text-muted" style="margin-left:auto">📍 ${ev.venue}</span>` : ''}
      </div>
      <div class="seat-bar mt-1">
        <div class="seat-bar-fill ${color}" style="width:${fill}%"></div>
      </div>
    </div>`;
}

// ─── Nav update based on auth state ────────────────────────────
import { getUser, isLoggedIn, isAdmin, clearAuth } from './api.js';

export function updateNav() {
    const u = getUser();
    const navAuth = document.getElementById('nav-auth');
    if (!navAuth) return;
    if (isLoggedIn() && u) {
        navAuth.innerHTML = `
      <a href="${isAdmin() ? '/admin-dashboard.html' : '/student-dashboard.html'}">${isAdmin() ? '⚙️ Admin' : '👤 Dashboard'}</a>
      <button onclick="handleLogout()">Logout</button>`;
    } else {
        navAuth.innerHTML = `
      <a href="/login.html">Login</a>
      <a href="/register.html" class="btn btn-primary btn-sm">Register</a>`;
    }
}

window.handleLogout = function () {
    clearAuth();
    window.location.href = '/';
};
