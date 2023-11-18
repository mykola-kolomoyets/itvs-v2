import { useCallback } from "react";
import { signIn, signOut as authSignOut } from "next-auth/react";

export const useSignIn = () => {
  const googleSignIn = useCallback(() => {
    void signIn("google", { callbackUrl: "/dashboard/articles" });
  }, []);

  const signOut = useCallback(() => {
    void authSignOut({
      callbackUrl: "/",
    });
  }, []);

  return {
    googleSignIn,
    signOut,
  };
};
