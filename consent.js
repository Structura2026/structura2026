const GTM_ID = "GTM-NWQKQ2L3";

const POLICY_URLS = {
  privacy: "/structura2026/privacy-policy.html",
  cookies: "/structura2026/cookie-policy.html"
};

const CONSENT_STORAGE_KEY = "structura_cookie_consent";
const CONSENT_VERSION = 1;

let currentConsent = {
  necessary: true,
  statistics: false,
  marketing: false
};

let gtmLoaded = false;
let consentUiInitialized = false;

const isDanish = () => {
  const language = document.documentElement.lang || "";
  return language.toLowerCase().startsWith("da");
};

const translations = {
  en: {
    title: "Your privacy matters",
    description:
    "This website uses necessary storage to function. With your permission, we may also use statistics and marketing technologies to improve the website and understand its usage.",
    privacyPolicy: "Privacy Policy",
    cookiePolicy: "Cookie Policy",
    acceptAll: "Accept all",
    rejectOptional: "Reject optional",
    customise: "Customise",
    save: "Save my choices",
    necessary: "Necessary",
    necessaryDescription:
      "Required for the website to function and cannot be disabled.",
    statistics: "Statistics",
    statisticsDescription:
      "Help us understand how visitors use the website.",
    marketing: "Marketing",
    marketingDescription:
      "Allow marketing-related technologies.",
    settings: "Cookie settings",
    preferencesTitle: "Privacy preferences",
    close: "Close",
    saved: "Your preferences have been saved."
  },

  da: {
    title: "Dit privatliv er vigtigt",
    description:
    "Denne hjemmeside bruger nødvendige teknologier for at fungere. Med dit samtykke kan vi også bruge statistik- og markedsføringsteknologier til at forbedre hjemmesiden og forstå dens brug.",
    privacyPolicy: "Privatlivspolitik",
    cookiePolicy: "Cookiepolitik",
    acceptAll: "Acceptér alle",
    rejectOptional: "Afvis valgfrie",
    customise: "Tilpas",
    save: "Gem mine valg",
    necessary: "Nødvendige",
    necessaryDescription:
      "Nødvendige for at hjemmesiden fungerer og kan ikke deaktiveres.",
    statistics: "Statistik",
    statisticsDescription:
      "Hjælper os med at forstå, hvordan besøgende bruger hjemmesiden.",
    marketing: "Markedsføring",
    marketingDescription:
      "Tillader teknologier relateret til markedsføring.",
    settings: "Cookieindstillinger",
    preferencesTitle: "Privatlivsindstillinger",
    close: "Luk",
    saved: "Dine indstillinger er blevet gemt."
  }
};

function getText() {
  return isDanish() ? translations.da : translations.en;
}

/* --------------------------------------------------
   CONSENT STORAGE
-------------------------------------------------- */

function getStoredConsent() {
  try {
    const stored = localStorage.getItem(CONSENT_STORAGE_KEY);

    if (!stored) return null;

    const parsed = JSON.parse(stored);

    if (parsed.version !== CONSENT_VERSION) return null;

    if (
      typeof parsed.statistics !== "boolean" ||
      typeof parsed.marketing !== "boolean"
    ) {
      return null;
    }

    return {
      necessary: true,
      statistics: parsed.statistics,
      marketing: parsed.marketing
    };
  } catch (error) {
    console.warn("Could not read consent preferences:", error);
    return null;
  }
}

function saveConsent(consent) {
  currentConsent = {
    necessary: true,
    statistics: Boolean(consent.statistics),
    marketing: Boolean(consent.marketing)
  };

  try {
    localStorage.setItem(
      CONSENT_STORAGE_KEY,
      JSON.stringify({
        version: CONSENT_VERSION,
        necessary: true,
        statistics: currentConsent.statistics,
        marketing: currentConsent.marketing,
        updatedAt: new Date().toISOString()
      })
    );
  } catch (error) {
    console.warn("Could not save consent preferences:", error);
  }

  applyConsent();
  updateConsentUi();

  window.dispatchEvent(
    new CustomEvent("structura:consent-updated", {
      detail: { ...currentConsent }
    })
  );
}

/* --------------------------------------------------
   GOOGLE CONSENT MODE
-------------------------------------------------- */

function initialiseGoogleConsentMode() {
  window.dataLayer = window.dataLayer || [];

  window.gtag = function () {
    window.dataLayer.push(arguments);
  };

  // Deny all optional consent by default.
  // These commands are queued before GTM is loaded.
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied"
  });
}

function updateGoogleConsentMode() {
  if (typeof window.gtag !== "function") return;

  window.gtag("consent", "update", {
    analytics_storage: currentConsent.statistics
      ? "granted"
      : "denied",

    ad_storage: currentConsent.marketing
      ? "granted"
      : "denied",

    ad_user_data: currentConsent.marketing
      ? "granted"
      : "denied",

    ad_personalization: currentConsent.marketing
      ? "granted"
      : "denied"
  });
}

function loadGoogleTagManager() {
  if (gtmLoaded) return;

  // Do not load GTM unless at least one optional category
  // has been accepted.
  if (!currentConsent.statistics && !currentConsent.marketing) {
    return;
  }

  gtmLoaded = true;

  window.dataLayer.push({
    "gtm.start": new Date().getTime(),
    event: "gtm.js"
  });

  const script = document.createElement("script");

  script.async = true;
  script.src =
    "https://www.googletagmanager.com/gtm.js?id=" +
    encodeURIComponent(GTM_ID);

  document.head.appendChild(script);
}

function applyConsent() {
  // Update Google's consent state.
  updateGoogleConsentMode();

  // Load GTM if at least one optional category is accepted.
  if (currentConsent.statistics || currentConsent.marketing) {
    loadGoogleTagManager();
  }

  // Send the visitor's choices to GTM.
  window.dataLayer.push({
    event: "structura_consent_update",
    consent_statistics: currentConsent.statistics,
    consent_marketing: currentConsent.marketing
  });
}

/* --------------------------------------------------
   USER INTERFACE
-------------------------------------------------- */

function createConsentUi() {
  if (consentUiInitialized) return;

  consentUiInitialized = true;

  const t = getText();

  const container = document.createElement("div");

  container.id = "consent-container";

  container.innerHTML = `
    <section
      id="consent-banner"
      class="consent-banner"
      role="region"
      aria-label="${t.title}"
      hidden
    >
      <div class="consent-content">
        <h2>${t.title}</h2>

        <p>${t.description}</p>
        <div class="consent-policy-links">
  <a
    href="${POLICY_URLS.privacy}"
    target="_blank"
    rel="noopener noreferrer"
  >${t.privacyPolicy}</a>

  <span aria-hidden="true">|</span>

  <a
    href="${POLICY_URLS.cookies}"
    target="_blank"
    rel="noopener noreferrer"
  >${t.cookiePolicy}</a>
</div>
<div>
</div>
        <div class="consent-actions">
          <button
            type="button"
            id="consent-accept-all"
            class="consent-button consent-primary"
          >
            ${t.acceptAll}
          </button>

          <button
            type="button"
            id="consent-reject"
            class="consent-button consent-secondary"
          >
            ${t.rejectOptional}
          </button>

          <button
            type="button"
            id="consent-customise"
            class="consent-button consent-text-button"
          >
            ${t.customise}
          </button>
        </div>
      </div>
    </section>

    <section
      id="consent-preferences"
      class="consent-preferences"
      role="dialog"
      aria-modal="true"
      aria-labelledby="consent-preferences-title"
      hidden
    >
      <div class="consent-panel">
        <div class="consent-panel-header">
          <h2 id="consent-preferences-title">
            ${t.preferencesTitle}
          </h2>

          <button
            type="button"
            id="consent-close"
            class="consent-close"
            aria-label="${t.close}"
          >
            &times;
          </button>
        </div>

        <div class="consent-category">
          <div>
            <h3>${t.necessary}</h3>
            <p>${t.necessaryDescription}</p>
          </div>

          <input
            type="checkbox"
            checked
            disabled
            aria-label="${t.necessary}"
          >
        </div>

        <div class="consent-category">
          <div>
            <h3>${t.statistics}</h3>
            <p>${t.statisticsDescription}</p>
          </div>

          <input
            type="checkbox"
            id="consent-statistics"
          >
        </div>

        <div class="consent-category">
          <div>
            <h3>${t.marketing}</h3>
            <p>${t.marketingDescription}</p>
          </div>

          <input
            type="checkbox"
            id="consent-marketing"
          >
        </div>

        <div class="consent-policy-links">
  <a
    href="${POLICY_URLS.privacy}"
    target="_blank"
    rel="noopener noreferrer"
  >${t.privacyPolicy}</a>

  <span aria-hidden="true">|</span>

  <a
    href="${POLICY_URLS.cookies}"
    target="_blank"
    rel="noopener noreferrer"
  >${t.cookiePolicy}</a>
</div>

        <div class="consent-panel-actions">
          <button
            type="button"
            id="consent-save"
            class="consent-button consent-primary"
          >
            ${t.save}
          </button>
        </div>
      </div>
    </section>

    <button
      type="button"
      id="consent-settings-button"
      class="consent-settings-button"
    >
      ${t.settings}
    </button>
  `;

  document.body.appendChild(container);

  document
    .getElementById("consent-accept-all")
    .addEventListener("click", () => {
      saveConsent({
        statistics: true,
        marketing: true
      });
    });

  document
    .getElementById("consent-reject")
    .addEventListener("click", () => {
      saveConsent({
        statistics: false,
        marketing: false
      });
    });

  document
    .getElementById("consent-customise")
    .addEventListener("click", openPreferences);

  document
    .getElementById("consent-close")
    .addEventListener("click", closePreferences);

  document
    .getElementById("consent-save")
    .addEventListener("click", () => {
      saveConsent({
        statistics:
          document.getElementById("consent-statistics").checked,

        marketing:
          document.getElementById("consent-marketing").checked
      });

      closePreferences();
    });

  document
    .getElementById("consent-settings-button")
    .addEventListener("click", openPreferences);
}

/* --------------------------------------------------
   SHOW AND HIDE INTERFACE
-------------------------------------------------- */

function updateConsentUi() {
  const banner = document.getElementById("consent-banner");

  const statistics = document.getElementById("consent-statistics");

  const marketing = document.getElementById("consent-marketing");

  if (!banner || !statistics || !marketing) return;

  const hasSavedConsent = getStoredConsent() !== null;

  banner.hidden = hasSavedConsent;

  statistics.checked = currentConsent.statistics;
  marketing.checked = currentConsent.marketing;
}

function openPreferences() {
  const panel = document.getElementById("consent-preferences");

  if (!panel) return;

  updateConsentUi();

  panel.hidden = false;

  document.getElementById("consent-close").focus();
}

function closePreferences() {
  const panel = document.getElementById("consent-preferences");

  if (!panel) return;

  panel.hidden = true;

  document.getElementById("consent-settings-button").focus();
}

/* --------------------------------------------------
   INITIALISATION
-------------------------------------------------- */

export function initConsent() {
  if (window.__structuraConsentInitialized) return;

  window.__structuraConsentInitialized = true;

  // Establish denied defaults before any optional
  // Google scripts can be loaded.
  initialiseGoogleConsentMode();

  const storedConsent = getStoredConsent();

  if (storedConsent) {
    currentConsent = storedConsent;
  }

  // Apply previously saved preferences.
  applyConsent();

  // Create the banner and preferences interface.
  createConsentUi();

  // Display the banner if no valid choice exists.
  updateConsentUi();
}
