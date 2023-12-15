import { forwardRef, memo } from 'react';
import { cn } from '@/utils/common';
import { NavigationMenuLink } from '@/components/NavigationMenu';
import Link, { type LinkProps } from 'next/link';
import { type HeaderNavigationOption } from '@/types';
import type { FCProps } from '@/types';
import { usePathname } from 'next/navigation';

const NavigationListItem = forwardRef<React.ElementRef<'a'>, FCProps<HeaderNavigationOption> & LinkProps>(
    ({ className, title, children, disabled = false, href, ...props }, ref) => {
        const pathname = usePathname();
        console.log(pathname, href);

        return (
            <li key={href}>
                <NavigationMenuLink aria-disabled={disabled} active={pathname.includes(href)} asChild>
                    <Link
                        href={href}
                        ref={ref}
                        className={cn(
                            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                            className,
                            {
                                'pointer-events-none cursor-not-allowed opacity-50': disabled,
                                'bg-accent/75': pathname.includes(href),
                            }
                        )}
                        {...props}
                    >
                        <div className="text-sm font-medium leading-none">{title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
                    </Link>
                </NavigationMenuLink>
            </li>
        );
    }
);
NavigationListItem.displayName = 'NavigationListItem';

export default memo(NavigationListItem);
