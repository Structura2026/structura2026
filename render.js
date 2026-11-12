import { SITE_NAV } from "./site nav.js";

// Base URL of your Cloudflare Worker's JSON API (used by real browsers;
// bots get served fully-rendered HTML directly by the Worker before this
// script ever runs, per your Worker's page.html interception).

const WORKER_API = "https://structura.structura2026.workers.dev";
const DEFAULT_LOCALE = "en-us";
const DANISH_LOCALE = "da-dk";

/* ============================================================
   ADVERTISEMENT CONFIGURATION
   ============================================================ */

// These page types receive three medium rectangle ads
// inside their content, in addition to top and bottom banners.
const LONG_FORM_AD_TYPES = new Set([
  "blog_post_twin",
  "blog_post",
  "guest_blogposts_individual",
  "infographic",
  "podcast",
  "sponsored_blogpost_individual",
  "video",
]);

// These pages receive only a top and bottom banner.
const STANDARD_AD_PAGE_KEYS = new Set([
  "index",
  "competitor_main",
  "competitor_compare",
  "about_my_blog",
  "affiliate_partnership_main",
  "website_ai_statistics_main",
  "accessibility",
  "chatbot",
  "dictionary",
  "donation",
  "dropshipping",
  "faqs",
  "newsletter",
  "press",
  "previous_contests",
  "previous_newsletters",
  "price_for_ads",
  "bots_ai",
  "rules_guidelines_bots_ai",
  "price_for_bots_ai",
  "price_for_guestblogposts",
  "price_for_sponsored_blogposts",
  "privacy_policy",
  "paa_qfo_twin",
  "rss_feed",
  "rules_guidelines_ads",
  "rules_guidelines_guestblogposts",
  "rules_guidelines_sponsored_blogposts",
  "social_media",
  "software_tools",
  "sources_blogpost",
  "testimonials",
  "affiliate_marketing",
  "community",
  "downloads",
  "machine_readable_files",
  "ai_statistics",
  "website_statistics",
  "my_opinion_about_ai_usage",
  "community_creations",
  "partnerships",
  "project_category",
  "value_proposition",
  "archive",
  "paa_qfo",
  "knowledge_graph",
  "agent_card",
  "allowed_blocked_bots_ai",
  "dictionary_formulas_models",
  "sponsored_blogpost",
  "guest_blogposts",
  "contest",
  "survey",
  "sources",
  "buy_advertising",
  "project_list",
  "navigation",
  "about_me",
  "news",
  "atom_feed",
  "work_philosophy_test_results",
  "work_philosophy",
  "sustainability",
  "sitemap",
  "previous_surveys",
  "my_personality",
  "models",
  "formulas",
]);

// Approximate height of one A4 page in CSS pixels at 96 DPI.
const A4_CONTENT_HEIGHT_PX = 1122;

// Maximum number of medium rectangle ads in long-form content.
const MAX_INLINE_RECTANGLE_ADS = 3;

function getAdLayout(type, uid) {
  const pageType = String(type || "").toLowerCase();
  const pageUid = String(uid || "").toLowerCase();

  // Absolutely no advertisements on these pages.
  if (
    ["error_404", "private"].includes(pageType) ||
    ["error_404", "private"].includes(pageUid)
  ) {
    return "none";
  }

  // Long-form layout takes priority.
  if (LONG_FORM_AD_TYPES.has(pageType)) {
    return "long";
  }

  // Check both the page type and the individual document UID.
  if (
    STANDARD_AD_PAGE_KEYS.has(pageType) ||
    STANDARD_AD_PAGE_KEYS.has(pageUid)
  ) {
    return "standard";
  }

  // Pages not explicitly listed receive no advertisements.
  return "none";
}

/* ============================================================
   ADVERTISEMENT SLOT GENERATION
   ============================================================ */

const AD_ASSET_BASE =
  "https://structura2026.github.io/structura2026/ads";

const AD_BANNERS = {
  leaderboard: {
    desktop: `${AD_ASSET_BASE}/decorative-Structura-728x90.png`,
    mobile: `${AD_ASSET_BASE}/decorative-Structura-320x100.png`,
    alt: "Advertisement",
    link: "https://structura2026.github.io/structura2026/page.html?type=buy_advertising&uid=buy_advertising&lang=en-us" // Add the advertiser's destination URL here
  },

  rectangle: {
    image: `${AD_ASSET_BASE}/decorative-Structura-300x250.png`,
    alt: "Advertisement",
    link: "https://structura2026.github.io/structura2026/page.html?type=buy_advertising&uid=buy_advertising&lang=en-us" // Add the advertiser's destination URL here
  }
};

function createAdSlotHTML(format, position) {
  const ad = AD_BANNERS[format];

  if (!ad) return "";

  let imageHTML;

  if (format === "leaderboard") {
    imageHTML = `
      <picture>
        <source
          media="(max-width: 767px)"
          srcset="${ad.mobile}"
        >
        <img
          src="${ad.desktop}"
          alt="${ad.alt}"
          loading="lazy"
        >
      </picture>
    `;
  } else {
    imageHTML = `
      <img
        src="${ad.image}"
        alt="${ad.alt}"
        loading="lazy"
      >
    `;
  }

  const contentHTML = ad.link
    ? `<a href="${ad.link}" target="_blank"
         rel="sponsored noopener noreferrer">
         ${imageHTML}
       </a>`
    : imageHTML;

  return `
    <div
      class="ad-slot ad-slot-${format}"
      data-ad-position="${position}"
      data-ad-sizes="${format}"
    >
      ${contentHTML}
    </div>
  `;
}

function installAdStyles() {
  if (document.getElementById("structura-ad-styles")) return;

  const style = document.createElement("style");
  style.id = "structura-ad-styles";

  style.textContent = `
    /* General ad slot styling */

    .structura-ad-slot {
      box-sizing: border-box;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 28px auto;
      overflow: hidden;
      background: #f5f5f5;
      border: 1px dashed #bdbdbd;
      color: #777;
      font-size: 12px;
      text-align: center;
    }

    .structura-ad-slot__placeholder {
      padding: 8px;
    }

    /* Leaderboard: 728 x 90 */

    .structura-ad-slot--banner {
      width: min(728px, 100%);
      aspect-ratio: 728 / 90;
    }

    /* Medium rectangle: 300 x 250 */

    .structura-ad-slot--rectangle {
      width: min(300px, 100%);
      aspect-ratio: 300 / 250;
      margin: 36px auto;
    }

    /* Mobile leaderboard replacement: 320 x 100 */

    @media (max-width: 767px) {
      .structura-ad-slot--banner {
        width: min(320px, 100%);
        aspect-ratio: 320 / 100;
      }
    }
  `;

/* Actual advertisement images */
.ad-slot img {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
  margin: 0 auto;
}

.ad-slot a {
  display: block;
  width: 100%;
  height: 100%;
}

/* Desktop, laptop and tablet leaderboard */
.ad-slot-leaderboard {
  width: min(728px, 100%);
  aspect-ratio: 728 / 90;
  margin: 20px auto;
}

/* Medium rectangle */
.ad-slot-rectangle {
  width: 300px;
  max-width: 100%;
  aspect-ratio: 300 / 250;
  margin: 30px auto;
}

/* Phone banner */
@media (max-width: 767px) {
  .ad-slot-leaderboard {
    width: min(320px, 100%);
    aspect-ratio: 320 / 100;
  }
}

  document.head.appendChild(style);
}

/* ============================================================
   INSERT MEDIUM RECTANGLE ADS INTO LONG-FORM CONTENT
   ============================================================ */

function insertMediumRectangleAds(container) {
  const contentBlocks = Array.from(
    container.querySelectorAll(
      "p, h2, h3, h4, ul, ol, table, img, iframe, video, hr"
    )
  ).filter((element) => {
    // Avoid counting inline images twice when their paragraph
    // already contributes to the content height.
    if (
      element.tagName === "IMG" &&
      element.closest("p, li, td, th")
    ) {
      return false;
    }

    // Avoid counting paragraphs inside lists and table cells twice.
    if (
      element.tagName === "P" &&
      element.closest("li, td, th")
    ) {
      return false;
    }

    return true;
  });

  let accumulatedHeight = 0;
  let insertedAds = 0;

  for (const element of contentBlocks) {
    const computedStyle = window.getComputedStyle(element);

    const marginTop =
      parseFloat(computedStyle.marginTop) || 0;

    const marginBottom =
      parseFloat(computedStyle.marginBottom) || 0;

    const elementHeight =
      element.getBoundingClientRect().height +
      marginTop +
      marginBottom;

    accumulatedHeight += elementHeight;

    if (accumulatedHeight >= A4_CONTENT_HEIGHT_PX) {
      const adHTML = createAdSlotHTML(
        "rectangle",
        `in-content-${insertedAds + 1}`
      );

      element.insertAdjacentHTML("afterend", adHTML);

      insertedAds++;
      accumulatedHeight = 0;

      if (insertedAds >= MAX_INLINE_RECTANGLE_ADS) {
        break;
      }
    }
  }
}

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
function renderPageInto(container, data, type, uid) {
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

// Apply the advertising layout for this page.
applyAdLayout(container, type, uid);

applySEO(data.seo, data.title);

  applySEO(data.seo, data.title);
}

/* ============================================================
   APPLY ADVERTISEMENT LAYOUT TO THE PAGE
   ============================================================ */

function applyAdLayout(container, type, uid) {
  const layout = getAdLayout(type, uid);

  // No advertising on private, 404 or unlisted pages.
  if (layout === "none") return;

  installAdStyles();

  // Top banner: immediately below the navigation,
  // before the page title.
  container.insertAdjacentHTML(
    "afterbegin",
    createAdSlotHTML("banner", "top")
  );

  // Long-form pages additionally receive three
  // medium rectangle placements within the content.
  if (layout === "long") {
    insertMediumRectangleAds(container);
  }

  // Bottom banner: after all page content.
  container.insertAdjacentHTML(
    "beforeend",
    createAdSlotHTML("banner", "bottom")
  );
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

    renderPageInto(contentEl, data, type, uid);

  } catch (err) {
    contentEl.innerHTML =
      `<p>Sorry, this page couldn't be loaded.</p>`;

    console.error(err);
  }
}
