/**
 * activity-log router
 *
 * In Strapi 5 the users-permissions plugin does NOT expose an isAuthenticated
 * policy. Auth is enforced by the role-based permission system configured in
 * the admin panel:
 *   Admin → Settings → Users & Permissions → Roles → Authenticated
 *   → enable all activity-log permissions → Save
 */

export default {
  routes: [
    {
      method: "POST",
      path: "/activity-logs",
      handler: "activity-log.create",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/activity-logs",
      handler: "activity-log.find",
      config: {
        policies: [],
      },
    },
    {
      method: "GET",
      path: "/activity-logs/:id",
      handler: "activity-log.findOne",
      config: {
        policies: [],
      },
    },
    {
      method: "PUT",
      path: "/activity-logs/:id",
      handler: "activity-log.update",
      config: {
        policies: [],
      },
    },
    {
      method: "DELETE",
      path: "/activity-logs/:id",
      handler: "activity-log.delete",
      config: {
        policies: [],
      },
    },
  ],
};
