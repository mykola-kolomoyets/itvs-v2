import { memo, useCallback } from 'react';
import { useTheme } from 'next-themes';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/Button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/DropdownMenu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/Tooltip';

const ThemeChanger: React.FC = () => {
    const { setTheme } = useTheme();

    const changeTheme = useCallback(
        (themeName: string) => {
            return () => {
                setTheme(themeName);
            };
        },
        [setTheme]
    );

    return (
        <DropdownMenu>
            <TooltipProvider>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <DropdownMenuTrigger asChild>
                            <Button className="mr-2 rounded-full" variant="ghost" size="icon">
                                <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                <span className="sr-only">Змінити тему</span>
                            </Button>
                        </DropdownMenuTrigger>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Змінити тему</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={changeTheme('light')}>Світла</DropdownMenuItem>
                <DropdownMenuItem onClick={changeTheme('dark')}>Темна</DropdownMenuItem>
                <DropdownMenuItem onClick={changeTheme('system')}>Системна</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};

export default memo(ThemeChanger);
