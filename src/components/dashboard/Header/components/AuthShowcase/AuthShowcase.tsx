import { useSession, signIn, signOut } from "next-auth/react";
import { useCallback } from "react";
import { Button } from "@/components/Button";
import { LogOutIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/Tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/Avatar";
import { getFirstLetters } from "@/utils/common";
import Link from "next/link";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/HoverCard";
import UserRole from "@/components/UserRole";

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const googleSignInHandler = useCallback(() => {
    void signIn("google", { callbackUrl: "/dashboard/articles" });
  }, []);

  const sighOutHandler = useCallback(() => {
    void signOut({
      callbackUrl: "/",
    });
  }, []);

  console.log(sessionData);

  return (
    <div className="flex items-center justify-center gap-4">
      {sessionData ? (
        <HoverCard>
          <HoverCardTrigger asChild>
            <Link href="/dashboard/articles">
              <Avatar>
                <AvatarImage
                  src={sessionData.user.image ?? ""}
                  alt={sessionData.user.name ?? "No Name"}
                />
                <AvatarFallback>
                  {getFirstLetters(sessionData.user.name ?? "")}
                </AvatarFallback>
              </Avatar>
            </Link>
          </HoverCardTrigger>
          <HoverCardContent className="mr-6 w-80">
            <div className="flex flex-col items-start">
              <div className="truncate">
                <h4 className="text-sm text-accent-foreground">Імʼя</h4>
                <p className="truncate text-base font-medium">
                  {sessionData.user.name}
                </p>
              </div>
              <div className="mt-3 truncate">
                <h4 className="text-sm text-accent-foreground">Роль</h4>
                <UserRole role={sessionData.user.role} />
              </div>
            </div>
          </HoverCardContent>
        </HoverCard>
      ) : null}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              onClick={sessionData ? sighOutHandler : googleSignInHandler}
              aria-label={sessionData ? "Вийти" : "Увійти"}
            >
              <LogOutIcon size={20} />
            </Button>
          </TooltipTrigger>
          <TooltipContent align="center" side="bottom">
            <p>{sessionData ? "Вийти" : "Увійти"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export { AuthShowcase };
