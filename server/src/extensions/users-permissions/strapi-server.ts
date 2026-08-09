export default (plugin: any) => {
  // Override user controller update action
  plugin.controllers.user.update = async (ctx: any) => {
    const authUser = ctx.state.user;
    if (!authUser) {
      return ctx.unauthorized('You must be logged in to update your profile');
    }

    const { age, weight, height, goal, dailyCalorieIntake, dailyCalorieBurn } = ctx.request.body;

    const updatePayload: Record<string, any> = {};
    if (age !== undefined) updatePayload.age = age;
    if (weight !== undefined) updatePayload.weight = weight;
    if (height !== undefined) updatePayload.height = height;
    if (goal !== undefined) updatePayload.goal = goal;
    if (dailyCalorieIntake !== undefined) updatePayload.dailyCalorieIntake = dailyCalorieIntake;
    if (dailyCalorieBurn !== undefined) updatePayload.dailyCalorieBurn = dailyCalorieBurn;

    let updatedUser;
    try {
      if (strapi.documents) {
        updatedUser = await strapi.documents('plugin::users-permissions.user').update({
          documentId: authUser.documentId || ctx.params.id,
          data: updatePayload,
        });
      } else {
        updatedUser = await strapi.entityService.update('plugin::users-permissions.user', authUser.id, {
          data: updatePayload,
        });
      }
    } catch (err: any) {
      await strapi.db.query('plugin::users-permissions.user').update({
        where: { id: authUser.id },
        data: updatePayload,
      });
      updatedUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: authUser.id },
      });
    }

    ctx.body = updatedUser;
  };

  // Ensure PUT /users/:id route is accessible to authenticated users
  if (plugin.routes && plugin.routes['content-api'] && plugin.routes['content-api'].routes) {
    const routes = plugin.routes['content-api'].routes;
    const updateRoute = routes.find((r: any) => r.method === 'PUT' && r.path === '/users/:id');
    if (updateRoute) {
      updateRoute.config = {
        ...updateRoute.config,
        policies: [],
      };
    }
  }

  return plugin;
};
