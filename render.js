import { SITE_NAV } from "./site nav.js";

// Base URL of your Cloudflare Worker's JSON API (used by real browsers;
// bots get served fully-rendered HTML directly by the Worker before this
// script ever runs, per your Worker's page.html interception).

const WORKER_API = "https://structura.structura2026.workers.dev";
const DEFAULT_LOCALE = "en-us";
const DANISH_LOCALE = "da-dk";

function renderLanguageSwitcher(type, uid, lang) {
  // Private and 404 pages must not receive the language switcher.
  if (type === "private" || type === "error_404") return "";

  const currentLang = lang || DEFAULT_LOCALE;

  const otherLang =
    currentLang === DANISH_LOCALE
      ? DEFAULT_LOCALE
      : DANISH_LOCALE;

  const otherLabel =
    otherLang === DANISH_LOCALE
      ? "Dansk"
      : "English";

  const params = new URLSearchParams();

  params.set("type", type);
  params.set("uid", uid);
  params.set("lang", otherLang);

  const href = `/structura2026/page.html?${params.toString()}`;

  return `
    <a
      href="${href}"
      class="language-switcher"
      aria-label="Switch language to ${otherLabel}"
    >
      ${otherLabel}
    </a>
  `;
}

async function fetchPage(type, uid, lang) {
  const params = new URLSearchParams({ type });

  if (uid) params.set("uid", uid);

  params.set("lang", lang || DEFAULT_LOCALE);

  const res = await fetch(`${WORKER_API}/api/page?${params}`);

  if (!res.ok) {
    throw new Error(`Failed to load ${type}/${uid}/${lang}: ${res.status}`);
  }

  return res.json();
}

async function fetchList(type, orderings) {
  const params = new URLSearchParams({ type });
  if (orderings) params.set("orderings", orderings);
  const res = await fetch(`${WORKER_API}/api/list?${params}`);
  if (!res.ok) throw new Error(`Failed to load list ${type}: ${res.status}`);
  return res.json();
}

/**
 * Generic renderer — mirrors the Worker's own renderGenericHTML.
 * Works off whatever fields are actually present in the shaped JSON
 * (title/image/content/sections/tldr/table/blocks/embed), so it covers
 * every page type built during this project without a render function
 * per type. This is not a "shape function" and isn't merging any of
 * those — it's a single display templater reading already-shaped data.
 */
function renderPageInto(container, data) {
  let html = `<h1>${data.title || ""}</h1>`;

  if (data.image) html += `<img src="${data.image}" alt="${escapeHtml(data.imageAlt || "")}">`;
  if (data.tldr) html += `<div class="tldr">${data.tldr}</div>`;
  if (data.content) html += data.content;

  if (Array.isArray(data.sections)) {
    html += data.sections
      .map(
        (s) =>
          `<section>${s.image ? `<img src="${s.image}" alt="${escapeHtml(s.imageAlt || "")}">` : ""}${s.content || ""}</section>`
      )
      .join("");
  }

  if (data.content2) html += data.content2;
  if (data.table) html += renderTable(data.table);

  if (Array.isArray(data.blocks)) {
    html += data.blocks.map((b) => `${b.content || ""}${b.table ? renderTable(b.table) : ""}`).join("");
  }

  if (data.content3) html += data.content3;
  if (data.content4) html += data.content4;
  if (data.content5) html += data.content5;
  if (data.content6) html += data.content6;

  if (data.embed?.html) html += data.embed.html;
  if (data.image2) html += `<img src="${data.image2}" alt="${escapeHtml(data.image2Alt || "")}">`;

  container.innerHTML = html;

  applySEO(data.seo, data.title);
}

function renderListInto(container, type, items) {
  const rows = items
    .map(
      (item) =>
        `<li><a href="/structura2026/page.html?type=${encodeURIComponent(type)}&uid=${encodeURIComponent(item.uid || "")}">${escapeHtml(item.title || item.uid || "")}</a></li>`
    )
    .join("");
  container.innerHTML = `<ul>${rows}</ul>`;
}

function applySEO(seo, fallbackTitle) {
  if (!seo) return;
  document.title = seo.metaTitle || fallbackTitle || document.title;

  const setMeta = (name, content) => {
    if (!content) return;
    let tag = document.querySelector(`meta[name="${name}"]`);
    if (!tag) {
      tag = document.createElement("meta");
      tag.setAttribute("name", name);
      document.head.appendChild(tag);
    }
    tag.setAttribute("content", content);
  };

  setMeta("description", seo.metaDescription);

  if (seo.canonicalUrl) {
    let link = document.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", seo.canonicalUrl);
  }
}

function renderTable(table) {
  if (!table) return "";
  const row = (cells) => `<tr>${cells.map((c) => `<td>${c}</td>`).join("")}</tr>`;
  return `<table><thead>${table.head.map(row).join("")}</thead><tbody>${table.body.map(row).join("")}</tbody></table>`;
}

function escapeHtml(str) {
  return String(str).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
}

/* ============================================================
   NAV BAR — built from SITE_NAV (top-level entries only; children
   render as inline links inside each page's own content, not here)
   ============================================================ */
function renderNavBar(container, currentLang, currentType, currentUid) {
  const links = SITE_NAV.map((entry) => {
    const uidParam = entry.uid
      ? `&uid=${encodeURIComponent(entry.uid)}`
      : "";

    const langParam = `&lang=${encodeURIComponent(currentLang)}`;

    return `
      <a href="/structura2026/page.html?type=${encodeURIComponent(entry.type)}${uidParam}${langParam}">
        ${entry.label}
      </a>
    `;
  }).join("");

  const languageSwitcher =
    currentType === "private" || currentType === "error_404"
      ? ""
      : renderLanguageSwitcher(
          currentType,
          currentUid,
          currentLang
        );

  container.innerHTML = `
    <nav class="site-navigation">
      <div class="site-navigation-links">
        ${links}
      </div>

      <div class="site-language-switcher">
        ${languageSwitcher}
      </div>
    </nav>
  `;
}

/* ============================================================
   PAGE INIT — call this from page.html with the type/uid read out
   of the query string
   ============================================================ */
export async function initPage(type, uid) {
  const params = new URLSearchParams(window.location.search);

  const currentType = type || params.get("type");
  const currentUid = uid || params.get("uid");
  const currentLang = params.get("lang") || DEFAULT_LOCALE;

  const navEl = document.getElementById("nav");

  if (navEl) {
    renderNavBar(
      navEl,
      currentLang,
      currentType,
      currentUid
    );
  }

  const contentEl = document.getElementById("content");

  if (!contentEl) return;

  try {
    const data = await fetchPage(
      currentType,
      currentUid,
      currentLang
    );

    renderPageInto(contentEl, data);

  } catch (err) {
    contentEl.innerHTML =
      `<p>Sorry, this page couldn't be loaded.</p>`;

    console.error(err);
  }
}
