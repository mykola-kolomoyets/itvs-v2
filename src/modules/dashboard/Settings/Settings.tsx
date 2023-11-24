import { memo, useCallback } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/Tabs';
import DashboardLayout from '@/components/layout/DashboardLayout';

const TagsTabContent = dynamic(() => {
    return import('./components/TagsTabContent');
});
const SubjectsTabContent = dynamic(() => {
    return import('./components/SubjectsTabContent');
});
const EmployeesTabContent = dynamic(() => {
    return import('./components/EmployeesTabContent');
});

const SettingsModule: React.FC = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const router = useRouter();

    const tabView = searchParams.get('tab') ?? 'news';

    const tabChangeHandler = useCallback(
        (value: string) => {
            router.replace(`${pathname}?tab=${value}`);
        },
        [pathname, router]
    );

    if (!['news', 'staff', 'subjects', 'tags'].includes(tabView)) {
        router.replace('/404');
    }

    return (
        <DashboardLayout>
            <Tabs defaultValue={tabView} value={tabView} className="w-full" onValueChange={tabChangeHandler}>
                <section className="border-b border-solid border-border pb-4 pt-[18px]">
                    <div className="container flex items-start justify-between">
                        <h1 className="mb-[1.125rem] text-3xl font-semibold">Налаштування</h1>
                    </div>
                    <TabsList className="mx-6 grid w-[750px] grid-cols-4">
                        <TabsTrigger value="news" disabled>
                            Новини
                        </TabsTrigger>
                        <TabsTrigger value="staff">Колектив кафедри</TabsTrigger>
                        <TabsTrigger value="subjects">Дисципліни</TabsTrigger>
                        <TabsTrigger value="tags">Теги</TabsTrigger>
                    </TabsList>
                </section>
                <section className="mt-6">
                    <TabsContent value="news">
                        <div className="container my-16 flex w-full flex-col items-center">
                            <Image
                                className="dark:rounded-2xl dark:bg-foreground dark:py-5"
                                src="/images/error.png"
                                width={316}
                                height={202}
                                alt="Ще нічого не опубліковано"
                            />
                            <h3 className="mt-5 text-center text-base">Упс, ця секція ще в процесі розробки</h3>
                        </div>
                    </TabsContent>
                    <TabsContent value="staff">
                        <EmployeesTabContent />
                    </TabsContent>
                    <TabsContent value="subjects">
                        <SubjectsTabContent />
                    </TabsContent>
                    <TabsContent value="tags">
                        <TagsTabContent />
                    </TabsContent>
                </section>
            </Tabs>
        </DashboardLayout>
    );
};

export default memo(SettingsModule);
