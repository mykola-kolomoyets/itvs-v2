import { useSession } from "next-auth/react";
import { useMemo } from "react";

export const useMePermissions = () => {
  const { data: sessionData, ...rest } = useSession();

  const isAdmin = sessionData?.user?.role === "ADMIN";
  const isAuthor = sessionData?.user?.role === "AUTHOR";
  const isUser = sessionData?.user?.role === "USER";

  const permissions = useMemo(() => {
    return {
      canCreateArticle: true,
      canGoToSettings: isAdmin,
      canViewAllArticlesStatistics: isAdmin,
      canViewAllArticles: isAdmin,
      canViewOnlyOwnArticles: isAuthor || isUser,
      canRemoveAnyArticle: isAdmin,
      canChangeAnyUserRole: isAdmin,
      canEditAnyArticle: isAdmin,
      canEditOnlyOwnArticle: isAuthor || isUser,
    };
  }, [isAdmin, isAuthor, isUser]);

  console.log(permissions);

  return {
    permissions,
    user: sessionData?.user,
    ...rest,
  };
};
