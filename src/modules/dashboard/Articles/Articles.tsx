import Link from "next/link";
import { useMePermissions } from "@/hooks/useMePermissions";
import { api } from "@/utils/api";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StatisticCard from "@/components/dashboard/StatisticCard";
import { Separator } from "@/components/Separator";
import { Button } from "@/components/Button";
import StatisticsSkeleton from "./components/StatisticsSkeleton";
import ArticlesTable from "./components/ArticlesTable";

const ArticlesModule: React.FC = () => {
  const { status: sessionStatus, permissions } = useMePermissions();

  const { data: articlesStatistics, isLoading: isArticlesStatisticsLoading } =
    api.article.getStatistics.useQuery();

  const statisticsLoading =
    isArticlesStatisticsLoading || sessionStatus === "loading";

  return (
    <DashboardLayout>
      <section className=" border-b border-solid border-border pb-4 pt-[18px]">
        <div className=" container flex items-start justify-between">
          <h1 className="mb-[1.125rem] text-3xl font-semibold">Статті</h1>
          {permissions.canCreateArticle ? (
            <Button variant="default" asChild>
              <Link href="/create-article">Написати статтю</Link>
            </Button>
          ) : null}
        </div>
        <section className="container flex">
          {statisticsLoading ? (
            <StatisticsSkeleton />
          ) : (
            <>
              {permissions.canViewAllArticlesStatistics ? (
                <>
                  <StatisticCard
                    title="Всього статтей"
                    description="Скільки статтей написано всіма авторами"
                    isLoading={isArticlesStatisticsLoading}
                    value={articlesStatistics?.totalArticles ?? 0}
                  />

                  <Separator
                    className="mx-4 h-[148px]"
                    orientation="vertical"
                  />
                </>
              ) : null}
              <StatisticCard
                title="Моїх статтей"
                description="Скільки статтей написано персонально вами"
                isLoading={isArticlesStatisticsLoading}
                value={articlesStatistics?.myArticles ?? 0}
              />
            </>
          )}
        </section>
      </section>
      <ArticlesTable />
    </DashboardLayout>
  );
};

export default ArticlesModule;
