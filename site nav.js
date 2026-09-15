/**
 * Single source of truth for the site's link graph.
 *
 * - Top-level entries render in the navigational bar.
 * - `children` are the inline links embedded in that page's own body
 * - `mode` tells the build/worker how to fetch it:
 *   
 * "single" -> repeatable Prismic type, fetched by uid
 */

export const SITE_NAV = [
  { type: "index", mode: "single", uid: "index", label: "Index" },

  {
    type: "news", mode: "single", label: "News",
    children: [
      { type: "rss_feed", mode: "single", label: "RSS_feed" },
      { type: "atom_feed", mode: "single", label: "ATOM_feed" },
      { type: "newsletter", mode: "single", label: "Newsletter" },
      { type: "previous_newsletters", mode: "single", label: "Previous_newsletters" },
    ],
  },

  {
    type: "about_me", mode: "single", label: "About_me",
    children: [
      { type: "my_personality", mode: "single", label: "My_personality" },
      { type: "work_philosophy", mode: "single", label: "Work_philosophy" },
      { type: "work_philosophy_test_results", mode: "single", label: "Work_philosophy_test_results" },
    ],
  },

  {
    type: "about_my_blog", mode: "single", label: "About_my_blog",
    children: [
      { type: "privacy_policy", mode: "single", label: "Privacy_policy" },
      { type: "sustainability", mode: "single", label: "Sustainability" },
      { type: "accessibility", mode: "single", label: "Accessibility" },
    ],
  },

  {
    type: "navigation", mode: "single", label: "Navigation",
    children: [
      { type: "sitemap", mode: "single", label: "Sitemap" },
      { type: "chatbot", mode: "single", label: "Chatbot" },
    ],
  },

  {
    type: "project_category", mode: "single", label: "Project_category",
    children: [
      {
        type: "project_list", mode: "single", label: "Project_list",
        children: [
          {
            type: "blog_post", mode: "single", label: "Blog_post",
            children: [
              { type: "paa_qfo", mode: "single", label: "PAA_QFO" },
              { type: "blog_post_twin", mode: "single", label: "blog_post_twin" },
              { type: "paa_qfo_twin", mode: "single", label: "PAA_QFO_twin" },
              { type: "video", mode: "single", label: "Video" },
              { type: "infographic", mode: "single", label: "Infographic" },
              { type: "podcast", mode: "single", label: "Podcast" },
            ],
          },
        ],
      },
    ],
  },

  { type: "social_media", mode: "single", label: "Social_media" },

  {
    type: "buy_advertising", mode: "single", label: "Buy_advertising",
    children: [
      { type: "price_for_ads", mode: "single", label: "Price_for_ads" },
      { type: "rules_guidelines_ads", mode: "single", label: "Rules_guidelines_ads" },
    ],
  },

  { type: "software_tools", mode: "single", label: "Software_tools" },

  {
    type: "sources", mode: "single", label: "Sources",
    children: [
      { type: "sources_blogpost", mode: "single", label: "Sources_blogpost" },
    ],
  },

  { type: "testimonials", mode: "single", label: "Testimonials" },
  { type: "webpage_statistics", mode: "single", label: "Webpage_statistics" },

  {
    type: "survey", mode: "single", label: "Survey",
    children: [{ type: "previous_surveys", mode: "single", label: "Previous_surveys" }],
  },

  {
    type: "contest", mode: "single", label: "Contest",
    children: [{ type: "previous_contests", mode: "single", label: "Previous_contests" }],
  },

  {
    type: "guest_blogposts", mode: "single", label: "Guest_blogposts",
    children: [
      { type: "guest_blogposts_individual", mode: "single", label: "Individual_guest_blog_posts" },
      { type: "rules_guidelines_guestblogposts", mode: "single", label: "Rules_guidelines_guest" },
      { type: "price_for_guestblogposts", mode: "single", label: "Price_for_guestblogposts" },
    ],
  },

  {
    type: "sponsored_blogpost", mode: "single", label: "Sponsored_blogpost",
    children: [
      { type: "sponsored_blogpost_individual", mode: "single", label: "Individual_sponsored_blog_posts" },
      { type: "rules_guidelines_sponsored_blogposts", mode: "single", label: "Rules_guidelines_sponsored_blogposts" },
      { type: "price_for_sponsored_blogposts", mode: "single", label: "Price_for_sponsored_blogposts" },
    ],
  },

  { type: "dropshipping", mode: "single", label: "Dropshipping" },
  { type: "press", mode: "single", label: "Press" },
  { type: "donation", mode: "single", label: "Donation" },
  { type: "affiliate_marketing", mode: "single", label: "Affiliate_marketing" },

  {
    type: "dictionary_formulas_models", mode: "single", label: "Dictionary_formulas_models",
    children: [
      { type: "dictionary", mode: "single", label: "Dictionary" },
      { type: "formulas", mode: "single", label: "Formulas" },
      { type: "models", mode: "single", label: "Models" },
    ],
  },

  { type: "faqs", mode: "single", label: "FAQs" },

  {
    type: "bots_ai", mode: "single", label: "Bots_AI",
    children: [
      { type: "rules_guidelines_bots_ai", mode: "single", label: "Rules_guidelines_bots_AI" },
      { type: "allowed_blocked_bots_ai", mode: "single", label: "Allowed_blocked_bots_AI" },
      { type: "price_for_bots_ai", mode: "single", label: "Price_for_bots_AI" },
      { type: "knowledge_graph", mode: "single", label: "Knowledge_graph" },
      { type: "machine_readable_files", mode: "single", label: "Machine_readable_files" },
      { type: "agent_card", mode: "single", label: "Agent_card" },
    ],
  },

  { type: "community", mode: "single", label: "Community" },
];

/**
 * Deliberately excluded from SITE_NAV entirely — no nav bar entry, no
 * inline links to or from them.
 */
export const ORPHAN_PAGES = [
  { type: "error404", mode: "single", label: "Error_404" },
  { type: "private", mode: "single", label: "Private" },
];
