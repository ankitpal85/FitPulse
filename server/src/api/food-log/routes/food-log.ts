/**
 * food-log router
 *
 * In Strapi 5 the users-permissions plugin does NOT expose an isAuthenticated
 * policy. Auth is enforced by the role-based permission system configured in
 * the admin panel:
 *   Admin → Settings → Users & Permissions → Roles → Authenticated
 *   → enable all food-log permissions → Save
 */

export default {
  routes: [
    {
      method: "POST",
      path: "/food-logs",
      handler: "food-log.create",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/food-logs",
      handler: "food-log.find",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/food-logs/:id",
      handler: "food-log.findOne",
      config: {
        policies: [],
      },
    },
    {
      method: "PUT",
      path: "/food-logs/:id",
      handler: "food-log.update",
      config: {
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/food-logs/:id",
      handler: "food-log.delete",
      config: {
        policies: [],
      },
    },
  ],
};
