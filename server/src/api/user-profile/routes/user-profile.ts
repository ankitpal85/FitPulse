export default {
  routes: [
    {
      method: 'PUT',
      path: '/user-profile',
      handler: 'user-profile.updateProfile',
      config: {
        policies: [],
        auth: false,
      },
    },
  ],
};
