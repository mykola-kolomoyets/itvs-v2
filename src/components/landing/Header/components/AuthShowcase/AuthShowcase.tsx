import { memo } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useSignIn } from '@/hooks/useSignIn';
import { getFirstLetters } from '@/utils/common';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/Avatar';
import { Button } from '@/components/Button';
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/HoverCard';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/Tooltip';
import UserRole from '@/components/UserRole';

const AuthShowcase: React.FC = () => {
    const { data: sessionData } = useSession();
    const { googleSignIn, signOut } = useSignIn();

    return (
        <div className="flex items-center justify-center gap-4">
            {sessionData ? (
                <HoverCard>
                    <HoverCardTrigger asChild>
                        <Link href="/dashboard/articles">
                            <Avatar>
                                <AvatarImage
                                    src={sessionData.user.image ?? ''}
                                    alt={sessionData.user.name ?? 'No Name'}
                                />
                                <AvatarFallback>{getFirstLetters(sessionData.user.name ?? '')}</AvatarFallback>
                            </Avatar>
                        </Link>
                    </HoverCardTrigger>
                    <HoverCardContent className="mr-6 w-80">
                        <div className="flex flex-col items-start">
                            <div className="truncate">
                                <h4 className="text-sm text-accent-foreground">Імʼя</h4>
                                <p className="truncate text-base font-medium">{sessionData.user.name}</p>
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
                            variant="ghost"
                            size="sm"
                            onClick={sessionData ? signOut : googleSignIn}
                            aria-label={sessionData ? 'Вийти' : 'Увійти'}
                        >
                            {sessionData ? 'Вийти' : 'Увійти'}
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent align="center" side="bottom">
                        <p>{sessionData ? 'Вийти' : 'Увійти'}</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
        </div>
    );
};

export default memo(AuthShowcase);
