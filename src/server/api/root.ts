import { createTRPCRouter } from '@/server/api/trpc';
import { articlesRouter } from './routers/articles';
import { usersRouter } from './routers/users';
import { tagsRouter } from './routers/tags';
import { subjectsRouter } from './routers/subjects';
import { employeesRouter } from './routers/employees';
import { libraryPublicationsRouter } from './routers/libraryPublications';

export const appRouter = createTRPCRouter({
    articles: articlesRouter,
    users: usersRouter,
    tags: tagsRouter,
    subjects: subjectsRouter,
    employees: employeesRouter,
    libraryPublication: libraryPublicationsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
