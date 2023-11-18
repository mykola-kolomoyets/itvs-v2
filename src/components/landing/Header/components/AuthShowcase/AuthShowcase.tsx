import { memo } from "react";
import { useSession } from "next-auth/react";
import { useSignIn } from "@/hooks/useSignIn";
import { getFirstLetters } from "@/utils/common";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  const { googleSignIn, signOut } = useSignIn();

  if (!sessionData) {
    return (
      <button className="" onClick={googleSignIn}>
        Увійти
      </button>
    );
  }

  return (
    <div>
      <Avatar>
        <AvatarImage
          src={sessionData.user.image ?? ""}
          alt={sessionData.user.name ?? "No Name"}
        />
        <AvatarFallback>
          {getFirstLetters(sessionData.user.name ?? "")}
        </AvatarFallback>
      </Avatar>
      <button onClick={signOut}>Вийти</button>
    </div>
  );
};

export default memo(AuthShowcase);
