/**
 * activity-log controller
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
    if (!body.duration || typeof body.duration !== 'number' || body.duration <= 0) {
      return ctx.badRequest('Valid duration is required');
    }
    if (body.calories !== undefined && (typeof body.calories !== 'number' || body.calories < 0)) {
      return ctx.badRequest('Calories must be a non-negative number');
    }

    body.users_permissions_user = user.id;

    const entry = await strapi.entityService.create(
      "api::activity-log.activity-log", {
        data: body,
        populate: ["users_permissions_user"]
      }
    );
    return entry;
  },

  async find(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Login required');

    const result = await strapi.entityService.findMany(
      "api::activity-log.activity-log", {
        filters: { users_permissions_user: user.id },
        populate: ["users_permissions_user"],
        sort: { createdAt: 'desc' },
      }
    );
    return result;
  },

  async findOne(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Login required');
    const { id } = ctx.params;

    const result = await strapi.entityService.findMany(
      "api::activity-log.activity-log", {
        filters: { id, users_permissions_user: user.id },
        populate: ["users_permissions_user"]
      }
    );
    if (!result.length) return ctx.notFound("Not found or not yours");
    return result[0];
  },

  async update(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Login required');
    const { id } = ctx.params;

    const existing = await strapi.entityService.findMany(
      "api::activity-log.activity-log", {
        filters: { documentId: id, users_permissions_user: user.id },
      }
    );
    if (!existing.length) return ctx.notFound("Not found or not yours");

    const body = ctx.request.body?.data || {};
    body.users_permissions_user = user.id;

    const entry = await strapi.entityService.update(
      "api::activity-log.activity-log", existing[0].id, {
        data: body,
        populate: ["users_permissions_user"]
      }
    );
    return entry;
  },

  async delete(ctx) {
    const user = ctx.state.user;
    if (!user) return ctx.unauthorized('Login required');
    const { id } = ctx.params;

    const existing = await strapi.entityService.findMany(
      "api::activity-log.activity-log", {
        filters: { documentId: id, users_permissions_user: user.id },
      }
    );
    if (!existing.length) return ctx.notFound("Not found or not yours");

    const entry = await strapi.entityService.delete(
      "api::activity-log.activity-log", existing[0].id
    );
    return entry;
  },
}));
