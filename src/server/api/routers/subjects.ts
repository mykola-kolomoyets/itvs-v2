import { z } from 'zod';
import { createTRPCRouter, protectedProcedure, publicProcedure } from '@/server/api/trpc';
import { TRPCError } from '@trpc/server';
import { selectOptionSchema } from '@/schemas';
import type { Discipline, Employee } from '@prisma/client';
import { produce } from 'immer';

const getAllSubjectsQuerySchema = z.object({
    search: z.string().optional(),
});
const getSubjectItemQuerySchema = z.object({
    id: z.string(),
});
const createSubjectSchema = z.object({
    name: z.string({ required_error: 'Назва дисципліни обовʼязкова!' }).min(3, 'Назва дисципліни обовʼязкова!'),
    abbreviation: z.string({ required_error: 'Абревіатура обовʼязкова!' }),
    code: z.string().optional(),
    description: z.string({ required_error: 'Опис обовʼязковий!' }),
    credits: z.number({ required_error: 'Кредити обовʼязкові!' }).min(0.1, { message: 'Мінімальний кредит - 0.1!' }),
    semesters: z.array(selectOptionSchema).min(1, { message: 'Потрібно вибрати хоча б один семестр' }),
    departmentLecturers: z.array(selectOptionSchema).optional(),
    otherLecturers: z.array(z.string()),
});
const updateSubjectSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    abbreviation: z.string().optional(),
    description: z.string().optional(),
    credits: z.number().optional(),
    semesters: z.array(selectOptionSchema).optional(),
    departmentLecturers: z.array(selectOptionSchema).optional(),
    otherLecturers: z.array(z.string()).optional(),
});
const removeSubjectSchema = z.object({
    id: z.string(),
});
const butchRemoveSubjectsSchema = z.object({
    ids: z.array(z.string()),
});

export const subjectsRouter = createTRPCRouter({
    getAllSubjects: protectedProcedure.input(getAllSubjectsQuerySchema).query(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const subjects = await ctx.db.discipline.findMany({
            where: {
                name: {
                    contains: input.search?.trim(),
                },
            },
            orderBy: {
                name: 'asc',
            },
            select: {
                id: true,
                name: true,
                abbreviation: true,
                code: true,
                description: true,
                credits: true,
                semesters: true,
                otherLecturers: true,
                departmentLecturers: true,
            },
        });

        return subjects;
    }),
    getAllSubjectsBySemesters: publicProcedure.input(getAllSubjectsQuerySchema).query(async ({ ctx, input }) => {
        const subjects = await ctx.db.discipline.findMany({
            where: {
                name: {
                    contains: input.search?.trim(),
                },
            },
            orderBy: {
                name: 'asc',
            },
            select: {
                id: true,
                name: true,
                abbreviation: true,
                code: true,
                description: true,
                credits: true,
                semesters: true,
                otherLecturers: true,
                departmentLecturers: true,
            },
        });

        const subjectsBySemesters = subjects.reduce(
            (acc, subject) => {
                return produce(acc, (prev) => {
                    subject.semesters.split(',').forEach((semester) => {
                        if (!prev[semester]) {
                            prev[semester] = [subject];
                        } else {
                            prev[semester]!.push(subject);
                        }
                    });
                });
            },
            {} as Record<string, (Discipline & { departmentLecturers: Employee[] })[]>
        );

        return subjectsBySemesters;
    }),
    getSubjectItem: protectedProcedure.input(getSubjectItemQuerySchema).query(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const subject = await ctx.db.discipline.findUnique({
            where: {
                id: input.id,
            },
            select: {
                id: true,
                name: true,
                abbreviation: true,
                code: true,
                description: true,
                credits: true,
                semesters: true,
                otherLecturers: true,
                departmentLecturers: true,
            },
        });

        return subject;
    }),
    createSubject: protectedProcedure.input(createSubjectSchema).mutation(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const { semesters, departmentLecturers, otherLecturers, ...rest } = input;

        const departmentLecturersData = await ctx.db.employee.findMany({
            where: {
                id: {
                    in: departmentLecturers?.map((lecturer) => {
                        return lecturer.value;
                    }),
                },
            },
            select: {
                id: true,
            },
        });

        const subject = await ctx.db.discipline.create({
            data: {
                ...rest,
                semesters: semesters
                    .map((semester) => {
                        return semester.value;
                    })
                    .join(','),
                otherLecturers: otherLecturers.join(','),
                departmentLecturers: {
                    connect: departmentLecturersData,
                },
            },
        });

        return subject;
    }),
    updateSubject: protectedProcedure.input(updateSubjectSchema).mutation(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const { semesters, otherLecturers, departmentLecturers = [], ...rest } = input;

        const subject = await ctx.db.discipline.update({
            where: {
                id: input.id,
            },
            data: {
                ...rest,
                semesters: semesters
                    ?.map((semester) => {
                        return semester.value;
                    })
                    .join(','),
                ...(otherLecturers?.length ? { otherLecturers: otherLecturers.join(',') } : {}),
                departmentLecturers: {
                    set: departmentLecturers.map((lecturer) => {
                        return {
                            id: lecturer.value,
                        };
                    }),
                },
            },
        });

        return subject;
    }),
    removeSubject: protectedProcedure.input(removeSubjectSchema).mutation(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const allEmployeesIncludeSubject = await ctx.db.employee.findMany({
            where: {
                disciplines: {
                    some: {
                        id: input.id,
                    },
                },
            },
            select: {
                id: true,
                disciplines: true,
            },
        });

        try {
            const removeSubjectFromRelativeEmployeesPromises = allEmployeesIncludeSubject.map((employee) => {
                return async () => {
                    const disciplines = employee.disciplines.filter((discipline) => {
                        return discipline.id !== input.id;
                    });

                    await ctx.db.employee.update({
                        where: {
                            id: employee.id,
                        },
                        data: {
                            disciplines: {
                                set: disciplines,
                            },
                        },
                    });
                };
            });

            await Promise.allSettled(removeSubjectFromRelativeEmployeesPromises);
        } catch (e) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error while removing tag from articles',
            });
        }

        const subject = await ctx.db.discipline.delete({
            where: {
                id: input.id,
            },
        });

        return subject;
    }),
    butchRemoveSubjects: protectedProcedure.input(butchRemoveSubjectsSchema).mutation(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const allEmployeesIncludeSubjects = await ctx.db.employee.findMany({
            where: {
                disciplines: {
                    some: {
                        id: {
                            in: input.ids,
                        },
                    },
                },
            },
            select: {
                id: true,
                disciplines: true,
            },
        });

        try {
            const removeSubjectFromRelativeEmployeesPromises = allEmployeesIncludeSubjects.map((employee) => {
                return async () => {
                    const disciplines = employee.disciplines.filter((discipline) => {
                        return !input.ids.includes(discipline.id);
                    });

                    await ctx.db.employee.update({
                        where: {
                            id: employee.id,
                        },
                        data: {
                            disciplines: {
                                set: disciplines,
                            },
                        },
                    });
                };
            });

            await Promise.allSettled(removeSubjectFromRelativeEmployeesPromises);
        } catch (e) {
            throw new TRPCError({
                code: 'INTERNAL_SERVER_ERROR',
                message: 'Error while removing tag from articles',
            });
        }

        await ctx.db.discipline.deleteMany({
            where: {
                id: {
                    in: input.ids,
                },
            },
        });

        return input.ids.length;
    }),
});
