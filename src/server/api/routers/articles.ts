import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { paginatedQuerySchema } from "@/schemas";

const getAllArticlesQuerySchema = z
  .object({
    search: z.string().optional(),
    author: z.string().optional(),
  })
  .merge(paginatedQuerySchema);

export const articlesRouter = createTRPCRouter({
  getStatistics: protectedProcedure.query(async ({ ctx }) => {
    const user = ctx.session?.user;

    if (!user) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        message: "You must be logged in to view this page",
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
  getAllArticles: protectedProcedure
    .input(getAllArticlesQuerySchema)
    .query(async ({ ctx, input }) => {
      const limit = input.limit ?? 10;
      const cursor = input.cursor;
      const skip = input.skip ?? 0;

      const user = ctx.session?.user;

      if (!user) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "You must be logged in to view this page",
        });
      }

      const filter = {
        title: {
          contains: input.search?.trim(),
        },
        authorId: input.author,
      };

      const totalArticles = await ctx.db.article.count({
        where: filter,
      });

      const allArticles = await ctx.db.article.findMany({
        take: limit + 1,
        skip: skip,
        where: filter,
        orderBy: {
          createdAt: "asc",
        },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          title: true,
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
});
