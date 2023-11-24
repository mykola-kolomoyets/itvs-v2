import { z } from 'zod';
import { createTRPCRouter, protectedProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { AcademicStatus } from '@prisma/client';
import { EMPLOYEE_ACADEMIC_STATUSES } from '@/constants';

const getAllEmployeesQuerySchema = z.object({
    search: z.string().optional(),
});
const getEmployeesItemQuerySchema = z.object({
    id: z.string(),
});
const createEmployeeSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    image: z.string().optional(),
    url: z.string().optional(),
    academicStatus: z.nativeEnum(AcademicStatus),
    disciplines: z.array(z.string()).optional(),
});
const updateEmployeeSchema = z.object({
    id: z.string(),
    name: z.string().optional(),
    email: z.string().email().optional(),
    image: z.string().optional(),
    url: z.string().optional(),
    academicStatus: z.nativeEnum(AcademicStatus),
    disciplines: z.array(z.string()).optional(),
});
const removeEmployeeSchema = z.object({
    id: z.string(),
});
const butchRemoveEmployeesSchema = z.object({
    ids: z.array(z.string()),
});

export const employeesRouter = createTRPCRouter({
    getAllEmployees: protectedProcedure.input(getAllEmployeesQuerySchema).query(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const employees = await ctx.db.employee.findMany({
            where: {
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
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                url: true,
                academicStatus: true,
                disciplines: true,
            },
        });

        const sortedEmployees = employees.sort((a, b) => {
            if (!a.academicStatus || !b.academicStatus) {
                return 0;
            }

            const aPriority = EMPLOYEE_ACADEMIC_STATUSES[a.academicStatus].priority;
            const bPriority = EMPLOYEE_ACADEMIC_STATUSES[b.academicStatus].priority;

            return bPriority - aPriority;
        });

        return sortedEmployees;
    }),
    getEmployeesItem: protectedProcedure.input(getEmployeesItemQuerySchema).query(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const employee = await ctx.db.employee.findUnique({
            where: {
                id: input.id,
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                url: true,
                academicStatus: true,
                disciplines: true,
            },
        });

        return employee;
    }),
    createEmployee: protectedProcedure.input(createEmployeeSchema).mutation(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const { disciplines = [], ...rest } = input;

        const employee = await ctx.db.employee.create({
            data: {
                ...rest,
                disciplines: {
                    connect: disciplines.map((discipline) => ({
                        id: discipline,
                    })),
                },
            },
        });

        return employee;
    }),
    updateEmployee: protectedProcedure.input(updateEmployeeSchema).mutation(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const { disciplines = [], ...rest } = input;

        const employee = await ctx.db.employee.update({
            where: {
                id: input.id,
            },
            data: {
                ...rest,
                disciplines: {
                    connect: disciplines.map((discipline) => ({
                        id: discipline,
                    })),
                },
            },
        });

        return employee;
    }),
    removeEmployee: protectedProcedure.input(removeEmployeeSchema).mutation(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        const employee = await ctx.db.employee.delete({
            where: {
                id: input.id,
            },
        });

        return employee;
    }),
    butchRemoveEmployees: protectedProcedure.input(butchRemoveEmployeesSchema).mutation(async ({ ctx, input }) => {
        const user = ctx.session?.user;

        if (!user) {
            throw new TRPCError({
                code: 'FORBIDDEN',
                message: 'You must be logged in to view this page',
            });
        }

        await ctx.db.employee.deleteMany({
            where: {
                id: {
                    in: input.ids,
                },
            },
        });

        return input.ids.length;
    }),
});
