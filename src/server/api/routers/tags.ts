import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

const getAllTagsQuerySchema = z.object({
    search: z.string().optional(),
});
const getTagItemQuerySchema = z.object({
    id: z.string(),
});
const createTagSchema = z.object({
    name: z.string(),
});
const removeTagSchema = z.object({
    id: z.string(),
});
const updateTagSchema = z.object({
    id: z.string(),
    name: z.string(),
});
const butchRemoveTagsSchema = z.object({
    ids: z.array(z.string()),
});

export const tagsRouter = createTRPCRouter({
    getAllTags: protectedProcedure.input(getAllTagsQuerySchema).query(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const filter = {
            name: {
                contains: input.search?.trim(),
            },
        };

        const tags = await ctx.db.tag.findMany({
            where: filter,
            orderBy: {
                name: 'asc',
            },
        });

        return tags;
    }),
    getTagItem: protectedProcedure.input(getTagItemQuerySchema).query(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const tag = await ctx.db.tag.findUnique({
            where: {
                id: input.id,
            },
        });

        return tag;
    }),
    createTag: protectedProcedure.input(createTagSchema).mutation(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user || user.role !== 'ADMIN') {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const tag = await ctx.db.tag.create({
            data: {
                name: input.name,
            },
        });

        return tag;
    }),
    removeTag: protectedProcedure.input(removeTagSchema).mutation(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user || user.role !== 'ADMIN') {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const allArticlesIncludeTag = await ctx.db.article.findMany({
            where: {
                tags: {
                    some: {
                        id: input.id,
                    },
                },
            },
            select: {
                id: true,
                tags: true,
            },
        });

        try {
            const removeTagFromRelativeArticlesPromises = allArticlesIncludeTag.map((article) => {
                return async () => {
                    const tags = article.tags.filter((tag) => tag.id !== input.id);

                    await ctx.db.article.update({
                        where: {
                            id: article.id,
                        },
                        data: {
                            tags: {
                                set: tags,
                            },
                        },
                    });
                };
            });

            await Promise.allSettled(removeTagFromRelativeArticlesPromises);
        } catch (e) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error while removing tag from articles',
            });
        }

        const tag = await ctx.db.tag.delete({
            where: {
                id: input.id,
            },
        });

        return tag;
    }),
    updateTag: protectedProcedure.input(updateTagSchema).mutation(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user || user.role !== 'ADMIN') {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const tagToUpdate = await ctx.db.tag.findUnique({
            where: {
                id: input.id,
            },
        });

        if (!tagToUpdate) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Tag not found',
            });
        }

        const tag = await ctx.db.tag.update({
            where: {
                id: input.id,
            },
            data: {
                name: input.name,
            },
        });

        return tag;
    }),
    butchRemoveTags: protectedProcedure.input(butchRemoveTagsSchema).mutation(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user || user.role !== 'ADMIN') {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const allArticlesIncludeTag = await ctx.db.article.findMany({
            where: {
                tags: {
                    some: {
                        id: {
                            in: input.ids,
                        },
                    },
                },
            },
            select: {
                id: true,
                tags: true,
            },
        });

        try {
            const removeTagFromRelativeArticlesPromises = allArticlesIncludeTag.map((article) => {
                return async () => {
                    const tags = article.tags.filter((tag) => {
                        return !input.ids.includes(tag.id);
                    });

                    await ctx.db.article.update({
                        where: {
                            id: article.id,
                        },
                        data: {
                            tags: {
                                set: tags,
                            },
                        },
                    });
                };
            });

            await Promise.allSettled(removeTagFromRelativeArticlesPromises);
        } catch (e) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error while removing tag from articles',
            });
        }

        await ctx.db.tag.deleteMany({
            where: {
                id: {
                    in: input.ids,
                },
            },
        });

        return input.ids.length;
    }),
});
