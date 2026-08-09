export default {
  async updateProfile(ctx: any) {
    const authHeader = ctx.request.header.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return ctx.unauthorized('No authorization token provided');
    }

    const token = authHeader.substring(7);
    let authUser;
    try {
      const jwtService = strapi.plugin('users-permissions').service('jwt');
      const payload = await jwtService.verify(token);
      authUser = await strapi.db.query('plugin::users-permissions.user').findOne({
        where: { id: payload.id },
      });
    } catch (err) {
      return ctx.unauthorized('Invalid or expired token');
    }

    if (!authUser) {
      return ctx.unauthorized('User not found');
    }

    const { age, weight, height, goal, dailyCalorieIntake, dailyCalorieBurn } = ctx.request.body;

    const updateData: Record<string, any> = {};
    if (age !== undefined && age !== null) updateData.age = Number(age);
    if (weight !== undefined && weight !== null) updateData.weight = Number(weight);
    if (height !== undefined) updateData.height = height ? Number(height) : null;
    if (goal !== undefined && goal !== null) updateData.goal = String(goal);
    if (dailyCalorieIntake !== undefined && dailyCalorieIntake !== null) updateData.dailyCalorieIntake = Number(dailyCalorieIntake);
    if (dailyCalorieBurn !== undefined && dailyCalorieBurn !== null) updateData.dailyCalorieBurn = Number(dailyCalorieBurn);

    await strapi.db.query('plugin::users-permissions.user').update({
      where: { id: authUser.id },
      data: updateData,
    });

    const updatedUser = await strapi.db.query('plugin::users-permissions.user').findOne({
      where: { id: authUser.id },
    });

    // Remove sensitive password fields before returning
    delete updatedUser.password;
    delete updatedUser.resetPasswordToken;
    delete updatedUser.confirmationToken;

    ctx.body = updatedUser;
  },
};
