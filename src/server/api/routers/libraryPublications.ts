import { z } from 'zod';
import { slugify } from 'transliteration';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';

const getAllLibraryPublicationsSchema = z.object({
    search: z.string().optional(),
});
const getLibraryPublicationItemSchema = z.object({
    id: z.string(),
});
const createLibraryPublicationSchema = z.object({
    title: z.string({ required_error: 'Назва обовʼязкова!' }).min(1, 'Назва обовʼязкова!'),
    createdAt: z.date(),
    posterUrl: z.string({ required_error: 'Фотографія обкладинки обовʼязкова!' }),
    authors: z.array(z.string({ required_error: 'Автори обовʼязкові!' })).min(1, 'Автори обовʼязкові!'),
    publicator: z.string({ required_error: 'Видавництво обовʼязкове!' }),
});
const updateLibraryPublicationSchema = z.object({
    id: z.string({ required_error: 'ID публікації обовʼязковий!' }),
    title: z.string().optional(),
    createdAt: z.date().optional(),
    posterUrl: z.string().optional(),
    authors: z.array(z.string()).optional(),
    publicator: z.string().optional(),
});
const removeLibraryPublicationSchema = z.object({
    id: z.string(),
});
const butchRemoveLibraryPublicationsSchema = z.object({
    ids: z.array(z.string()),
});

export const libraryPublicationsRouter = createTRPCRouter({
    getAllLibraryPublications: publicProcedure.input(getAllLibraryPublicationsSchema).query(async ({ ctx, input }) => {
        const publications = await ctx.db.libraryPublication.findMany({
            where: {
                title: {
                    contains: input.search,
                },
            },
            orderBy: {
                title: 'asc',
            },
        });

        return publications;
    }),
    getLibraryPublicationItem: publicProcedure.input(getLibraryPublicationItemSchema).query(async ({ ctx, input }) => {
        const publication = await ctx.db.libraryPublication.findUnique({
            where: {
                id: input.id,
            },
        });

        if (!publication) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Публікація не знайдена' });
        }

        return publication;
    }),
    createLibraryPublication: protectedProcedure
        .input(createLibraryPublicationSchema)
        .mutation(async ({ ctx, input }) => {
            const user = ctx.session?.user;

            if (!user) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You must be logged in to view this page',
                });
            }

            const { authors, ...rest } = input;

            const authorsString = authors
                .map((author) => {
                    return author.trim();
                })
                .filter(Boolean)
                .join(',');

            const publication = await ctx.db.libraryPublication.create({
                data: {
                    ...rest,
                    slug: slugify(rest.title),
                    authors: authorsString,
                },
            });

            return publication;
        }),
    updateLibraryPublication: protectedProcedure.input(updateLibraryPublicationSchema).query(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const { authors = [], ...rest } = input;

        const authorsString = authors
            .map((author) => {
                return author.trim();
            })
            .filter(Boolean)
            .join(',');

        const publication = await ctx.db.libraryPublication.update({
            where: {
                id: input.id,
            },
            data: {
                ...rest,
                slug: rest?.title ? slugify(rest.title) : undefined,
                authors: authorsString,
            },
        });

        return publication;
    }),
    removeLibraryPublication: protectedProcedure.input(removeLibraryPublicationSchema).query(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        await ctx.db.libraryPublication.delete({
            where: {
                id: input.id,
            },
        });

        return true;
    }),
    butchRemoveLibraryPublications: protectedProcedure
        .input(butchRemoveLibraryPublicationsSchema)
        .query(async ({ ctx, input }) => {
            const user = ctx.session?.user;

            if (!user) {
                throw new TRPCError({
                    code: 'FORBIDDEN',
                    message: 'You must be logged in to view this page',
                });
            }

            await ctx.db.libraryPublication.deleteMany({
                where: {
                    id: {
                        in: input.ids,
                    },
                },
            });

            return true;
        }),
});
