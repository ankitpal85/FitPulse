/**
 * image-analysis router
 *
 * In Strapi 5 the users-permissions plugin does NOT expose an isAuthenticated
 * policy. Auth is enforced by the role-based permission system configured in
 * the admin panel:
 *   Admin → Settings → Users & Permissions → Roles → Authenticated
 *   → enable the image-analysis "analyze" action → Save
 */

export default {
  routes: [
    {
      method: "POST",
      path: "/image-analysis",
      handler: "image-analysis.analyze",
      config: {
        policies: [],
      },
    },
  ],
};