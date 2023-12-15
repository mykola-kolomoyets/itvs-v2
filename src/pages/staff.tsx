import type { NextPage } from 'next';
import StaffModule from '@/modules/landing/Staff';

const StaffPage: NextPage = () => {
    return <StaffModule />;
};

export default StaffPage;

// export const getServerSideProps: GetServerSideProps<StaffModuleProps> = async (ctx) => {
//     const trpc = appRouter.createCaller(ctx as never);

//     const staff = await trpc.employees.getAllEmployees({ search: '' });

//     return {
//         props: {
//             staff,
//         },
//     };
// };
