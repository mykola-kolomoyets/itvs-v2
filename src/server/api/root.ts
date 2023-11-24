import { createTRPCRouter } from '@/server/api/trpc';
import { articlesRouter } from './routers/articles';
import { usersRouter } from './routers/users';
import { tagsRouter } from './routers/tags';
import { subjectsRouter } from './routers/subjects';
import { employeesRouter } from './routers/employees';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
    articles: articlesRouter,
    users: usersRouter,
    tags: tagsRouter,
    subjects: subjectsRouter,
    employees: employeesRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
