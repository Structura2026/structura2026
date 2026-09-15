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
    type: "news", mode: "single", uid: "news", label: "News",
    children: [
      { type: "rss_feed", mode: "single", uid: "rss_feed", label: "RSS_feed" },
      { type: "atom_feed", mode: "single", uid: "atom_feed", label: "ATOM_feed" },
      { type: "newsletter", mode: "single", uid: "newsletter", label: "Newsletter" },
      { type: "previous_newsletters", mode: "single", uid: "previous_newsletters" label: "Previous_newsletters" },
    ],
  },

  {
    type: "about_me", mode: "single", uid: "about_me", label: "About_me",
    children: [
      { type: "my_personality", mode: "single", uid: "my_personality", label: "My_personality" },
      { type: "work_philosophy", mode: "single", uid: "work_philosophy", label: "Work_philosophy" },
      { type: "work_philosophy_test_results", mode: "single", uid: "work_philosophy_test_results", label: "Work_philosophy_test_results" },
    ],
  },

  {
    type: "about_my_blog", mode: "single", uid: "about_my_blog", label: "About_my_blog",
    children: [
      { type: "privacy_policy", mode: "single", uid: "privacy_policy", label: "Privacy_policy" },
      { type: "sustainability", mode: "single", uid: "sustainability", label: "Sustainability" },
      { type: "accessibility", mode: "single", uid: "accessibility", label: "Accessibility" },
    ],
  },

  {
    type: "navigation", mode: "single", uid: "navigation", label: "Navigation",
    children: [
      { type: "sitemap", mode: "single", uid: "sitemap", label: "Sitemap" },
      { type: "chatbot", mode: "single", uid: "chatbot", label: "Chatbot" },
    ],
  },

  {
    type: "project_category", mode: "single", uid: "project_category", label: "Project_category",
    children: [
      {
        type: "project_list", mode: "single", uid: "project_list", label: "Project_list",
        children: [
          {
            type: "blog_post", mode: "single", uid: "blog_post", label: "Blog_post",
            children: [
              { type: "paa_qfo", mode: "single", uid: "paa_qfo", label: "PAA_QFO" },
              { type: "blog_post_twin", mode: "single", uid: "blog_post_twin", label: "blog_post_twin" },
              { type: "paa_qfo_twin", mode: "single", uid: "paa_qfo_twin", label: "PAA_QFO_twin" },
              { type: "video", mode: "single", uid: "video", label: "Video" },
              { type: "infographic", mode: "single", uid: "infographic", label: "Infographic" },
              { type: "podcast", mode: "single", uid: "podcast", label: "Podcast" },
            ],
          },
        ],
      },
    ],
  },

  { type: "social_media", mode: "single", uid: "social_media", label: "Social_media" },

  {
    type: "buy_advertising", mode: "single", uid: "buy_advertising", label: "Buy_advertising",
    children: [
      { type: "price_for_ads", mode: "single", uid: "price_for_ads", label: "Price_for_ads" },
      { type: "rules_guidelines_ads", mode: "single", uid: "rules_guidelines_ads", label: "Rules_guidelines_ads" },
    ],
  },

  { type: "software_tools", mode: "single", uid: "software_tools", label: "Software_tools" },

  {
    type: "sources", mode: "single", uid: "sources", label: "Sources",
    children: [
      { type: "sources_blogpost", mode: "single", uid: "sources_blogpost", label: "Sources_blogpost" },
    ],
  },

  { type: "testimonials", mode: "single", uid: "testimonials", label: "Testimonials" },
  { type: "website_statistics", mode: "single", uid: "website_statistics", label: "Website_statistics" },

  {
    type: "survey", mode: "single", uid: "survey", label: "Survey",
    children: [{ type: "previous_surveys", mode: "single", uid: "previous_surveys", label: "Previous_surveys" }],
  },

  {
    type: "contest", mode: "single", uid: "contest", label: "Contest",
    children: [{ type: "previous_contests", mode: "single", uid: "previous_contests", label: "Previous_contests" }],
  },

  {
    type: "guest_blogposts", mode: "single", uid: "guest_blogposts", label: "Guest_blogposts",
    children: [
      { type: "guest_blogposts_individual", mode: "single", uid: "guest_blogposts_individual", label: "Individual_guest_blog_posts" },
      { type: "rules_guidelines_guestblogposts", mode: "single", uid: "rules_guidelines_guestblogposts", label: "Rules_guidelines_guest" },
      { type: "price_for_guestblogposts", mode: "single", uid: "price_for_guestblogposts", label: "Price_for_guestblogposts" },
    ],
  },

  {
    type: "sponsored_blogpost", mode: "single", uid: "sponsored_blogpost", label: "Sponsored_blogpost",
    children: [
      { type: "sponsored_blogpost_individual", mode: "single", uid: "sponsored_blogpost_individual", label: "Individual_sponsored_blog_posts" },
      { type: "rules_guidelines_sponsored_blogposts", mode: "single", uid: "rules_guidelines_sponsored_blogposts", label: "Rules_guidelines_sponsored_blogposts" },
      { type: "price_for_sponsored_blogposts", mode: "single", uid: "price_for_sponsored_blogposts", label: "Price_for_sponsored_blogposts" },
    ],
  },

  { type: "dropshipping", mode: "single", uid: "dropshipping", label: "Dropshipping" },
  { type: "press", mode: "single", uid: "press", label: "Press" },
  { type: "donation", mode: "single", uid: "donation", label: "Donation" },
  { type: "affiliate_marketing", mode: "single", uid: "affiliate_marketing", label: "Affiliate_marketing" },

  {
    type: "dictionary_formulas_models", mode: "single", uid: "dictionary_formulas_models", label: "Dictionary_formulas_models",
    children: [
      { type: "dictionary", mode: "single", uid: "dictionary", label: "Dictionary" },
      { type: "formulas", mode: "single", uid: "formulas", label: "Formulas" },
      { type: "models", mode: "single", uid: "models", label: "Models" },
    ],
  },

  { type: "faqs", mode: "single", uid: "faqs", label: "FAQs" },

  {
    type: "bots_ai", mode: "single", uid: "bots_ai", label: "Bots_AI",
    children: [
      { type: "rules_guidelines_bots_ai", mode: "single", uid: "rules_guidelines_bots_ai", label: "Rules_guidelines_bots_AI" },
      { type: "allowed_blocked_bots_ai", mode: "single", uid: "allowed_blocked_bots_ai", label: "Allowed_blocked_bots_AI" },
      { type: "price_for_bots_ai", mode: "single", uid: "price_for_bots_ai", label: "Price_for_bots_AI" },
      { type: "knowledge_graph", mode: "single", uid: "knowledge_graph", label: "Knowledge_graph" },
      { type: "machine_readable_files", mode: "single", uid: "machine_readable_files", label: "Machine_readable_files" },
      { type: "agent_card", mode: "single", uid: "agent_card", label: "Agent_card" },
    ],
  },

  { type: "community", mode: "single", uid: "community", label: "Community" },
];

/**
 * Deliberately excluded from SITE_NAV entirely — no nav bar entry, no
 * inline links to or from them.
 */
export const ORPHAN_PAGES = [
  { type: "error404", mode: "single", uid: "error404", label: "Error_404" },
  { type: "private", mode: "single", uid: "private", label: "Private" },
];
