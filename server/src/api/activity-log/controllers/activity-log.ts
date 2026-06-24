/**
 * activity-log controller
 *
 * Uses Strapi 5 documentService (entityService is deprecated in v5).
 * The /:id param in URLs is the documentId in Strapi 5.
 */

import { factories } from '@strapi/strapi';

export default factories.createCoreController('api::activity-log.activity-log', ({ strapi }) => ({
  async create(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Login required');

    const body = ctx.request.body?.data;
    if (!body) return ctx.badRequest('Missing request body data');

    // Validate required fields
    if (!body.name || typeof body.name !== 'string' || !body.name.trim()) {
      return ctx.badRequest('Activity name is required');
    }
    if (body.duration === undefined || body.duration === null || typeof body.duration !== 'number' || body.duration <= 0) {
      return ctx.badRequest('Valid duration is required');
    }
    if (body.calories !== undefined && (typeof body.calories !== 'number' || body.calories < 0)) {
      return ctx.badRequest('Calories must be a non-negative number');
    }

    body.users_permissions_user = user.id;

    const entry = await strapi.documents('api::activity-log.activity-log').create({
      data: body,
      populate: ['users_permissions_user'],
    });
    ctx.status = 201;
    ctx.body = entry;
    return;
  },

  async find(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Login required');

    const result = await strapi.documents('api::activity-log.activity-log').findMany({
      filters: { users_permissions_user: { id: { $eq: user.id } } } as any,
      populate: ['users_permissions_user'],
      sort: 'createdAt:desc',
    });
    return { data: result };
  },

  async findOne(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Login required');
    const { id } = ctx.params; // id is the documentId in Strapi 5

    const entry = await strapi.documents('api::activity-log.activity-log').findOne({
      documentId: id,
      populate: ['users_permissions_user'],
    });

    if (!entry) return ctx.notFound('Not found');
    if ((entry as any).users_permissions_user?.id !== user.id) return ctx.forbidden('Not yours');
    return { data: entry };
  },

  async update(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Login required');
    const { id } = ctx.params;

    const existing = await strapi.documents('api::activity-log.activity-log').findOne({
      documentId: id,
      populate: ['users_permissions_user'],
    });
    if (!existing) return ctx.notFound('Not found');
    if ((existing as any).users_permissions_user?.id !== user.id) return ctx.forbidden('Not yours');

    const body = ctx.request.body?.data || {};
    body.users_permissions_user = user.id;

    const entry = await strapi.documents('api::activity-log.activity-log').update({
      documentId: id,
      data: body,
      populate: ['users_permissions_user'],
    });
    return { data: entry };
  },

  async delete(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Login required');
    const { id } = ctx.params;

    const existing = await strapi.documents('api::activity-log.activity-log').findOne({
      documentId: id,
      populate: ['users_permissions_user'],
    });
    if (!existing) return ctx.notFound('Not found');
    if ((existing as any).users_permissions_user?.id !== user.id) return ctx.forbidden('Not yours');

    const entry = await strapi.documents('api::activity-log.activity-log').delete({
      documentId: id,
    });
    return { data: entry };
  },
}));
