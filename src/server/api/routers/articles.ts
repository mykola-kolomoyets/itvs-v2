import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { paginatedQuerySchema } from '@/schemas';
import { slugify } from 'transliteration';
import { db } from '@/server/db';

const getAllArticlesQuerySchema = z
    .object({
        search: z.string().optional(),
        author: z.string().optional(),
        tags: z.array(z.string()).optional(),
    })
    .merge(paginatedQuerySchema);

const removeArticleQuerySchema = z.object({
    id: z.string(),
});
const getArticleItemQuerySchema = z.object({
    slug: z.string(),
});
const getArticleNameQuerySchema = z.object({
    id: z.string(),
});
const createArticleQuerySchema = z.object({
    title: z.string(),
    content: z.string(),
    tags: z.array(z.string()),
    posterUrl: z.string().optional(),
});

export const articlesRouter = createTRPCRouter({
    getStatistics: protectedProcedure.query(async ({ ctx }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'You must be logged in to view this page',
            });
        }

        const totalArticles = await ctx.db.article.count();

        const myArticles = await ctx.db.article.count({
            where: {
                authorId: user.id,
            },
        });

        return {
            totalArticles,
            myArticles,
        };
    }),
    getArticleName: protectedProcedure.input(getArticleNameQuerySchema).query(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'You must be logged in to view this page',
            });
        }

        const article = await ctx.db.article.findUnique({
            where: {
                id: input.id,
            },
            select: {
                title: true,
            },
        });

        if (!article) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Article not found',
            });
        }

        return article.title;
    }),
    getArticleItem: publicProcedure.input(getArticleItemQuerySchema).query(async ({ input }) => {
        const article = await db.article.findFirst({
            where: {
                slug: input.slug,
            },
            select: {
                id: true,
                title: true,
                content: true,
                tags: true,
                slug: true,
                posterUrl: true,
                author: {
                    select: {
                        name: true,
                        image: true,
                    },
                },
            },
        });

        return article;
    }),
    getAllArticles: protectedProcedure.input(getAllArticlesQuerySchema).query(async ({ ctx, input }) => {
        const limit = input.limit ?? 10;
        const cursor = input.cursor;
        const skip = input.skip ?? 0;

        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const filter = {
            title: {
                contains: input.search?.trim(),
            },
            authorId: input.author,
            ...(input.tags?.length
                ? {
                      tags: {
                          some: {
                              id: {
                                  in: input.tags,
                              },
                          },
                      },
                  }
                : {}),
        };

        const totalArticles = await ctx.db.article.count({
            where: filter,
        });

        const allArticles = await ctx.db.article.findMany({
            take: limit + 1,
            skip: skip,
            where: filter,
            orderBy: {
                createdAt: 'asc',
            },
            cursor: cursor ? { id: cursor } : undefined,
            select: {
                id: true,
                title: true,
                slug: true,
                author: {
                    select: {
                        id: true,
                        name: true,
                        role: true,
                    },
                },
                tags: true,
                createdAt: true,
            },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (allArticles.length > limit) {
            const nextItem = allArticles.pop();
            nextCursor = nextItem!.id;
        }

        return {
            total: totalArticles,
            articles: allArticles,
            nextCursor,
        };
    }),
    createArticle: protectedProcedure.input(createArticleQuerySchema).mutation(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const tags = await ctx.db.tag.findMany({
            where: {
                id: {
                    in: input.tags,
                },
            },
            select: {
                id: true,
            },
        });

        return await ctx.db.article.create({
            data: {
                title: input.title,
                content: input.content,
                authorId: user.id,
                tags: {
                    connect: tags,
                },
                slug: slugify(input.title),
                posterUrl: input?.posterUrl ?? '',
            },
        });
    }),
    removeArticle: protectedProcedure.input(removeArticleQuerySchema).mutation(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const articleToRemove = await ctx.db.article.findUnique({
            where: {
                id: input.id,
            },
            select: {
                authorId: true,
            },
        });

        if (!articleToRemove) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'Article not found',
            });
        }

        const hasPermissionsToRemoveArticle = user.role === 'ADMIN' || user.id === articleToRemove.authorId;

        if (!hasPermissionsToRemoveArticle) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: "You don't have permissions to remove this article",
            });
        }

        return await ctx.db.article.delete({
            where: {
                id: input.id,
            },
        });
    }),
});
