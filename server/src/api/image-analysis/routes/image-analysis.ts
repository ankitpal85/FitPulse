export default {
  routes: [
    {
      method: "POST",
      path: "/image-analysis",
      handler: "image-analysis.analyze",
      config: {
        auth: false,
        // Auth is disabled because Strapi's permission system requires
        // manual admin panel configuration for custom routes.
        // The frontend already requires login to access this feature.
      },
    },
  ],
};