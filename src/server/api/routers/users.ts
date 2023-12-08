import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { paginatedQuerySchema } from '@/schemas';
import { Role } from '@prisma/client';

const getAllUsersQuerySchema = z
    .object({
        search: z.string().optional(),
        roles: z.array(z.nativeEnum(Role)).optional(),
    })
    .merge(paginatedQuerySchema);

const updateUserRoleInputSchema = z.object({
    id: z.string(),
    role: z.nativeEnum(Role),
});

export const usersRouter = createTRPCRouter({
    getAllUsers: publicProcedure.input(getAllUsersQuerySchema).query(async ({ ctx, input }) => {
        const limit = input.limit ?? 10;
        const cursor = input.cursor;
        const skip = input.skip ?? 0;

        // const user = ctx.session?.user;

        // if (!user || user.role !== "ADMIN") {
        //   throw new TRPCError({
        //     code: "FORBIDDEN",
        //     message: "You must be logged in to view this page",
        //   });
        // }

        const filter = {
            ...(input.roles?.length
                ? {
                      role: {
                          in: input.roles,
                      },
                  }
                : {}),
            OR: [
                {
                    name: {
                        contains: input.search?.trim(),
                    },
                },
                {
                    email: {
                        contains: input.search?.trim(),
                    },
                },
            ],
        };

        const totalUsers = await ctx.db.user.count({
            where: filter,
        });

        const allUsers = await ctx.db.user.findMany({
            take: limit + 1,
            skip,
            where: filter,
            orderBy: {
                name: 'asc',
            },
            cursor: cursor ? { id: cursor } : undefined,
            select: {
                id: true,
                email: true,
                image: true,
                name: true,
                role: true,
            },
        });

        let nextCursor: typeof cursor | undefined = undefined;
        if (allUsers.length > limit) {
            const nextItem = allUsers.pop();
            nextCursor = nextItem!.id;
        }

        return {
            total: totalUsers,
            users: allUsers,
            nextCursor,
        };
    }),
    updateUserRole: protectedProcedure.input(updateUserRoleInputSchema).mutation(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user || user.role !== 'ADMIN') {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const isUserExists = await ctx.db.user.findUnique({
            where: {
                id: input.id,
            },
        });

        if (!isUserExists) {
            throw new TRPCError({
                code: 'BAD_REQUEST',
                message: 'User not found',
            });
        }

        return ctx.db.user.update({
            where: {
                id: input.id,
            },
            data: {
                role: input.role,
            },
        });
    }),
});
