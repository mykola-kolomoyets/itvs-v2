import { memo } from 'react';
import type { AboutCardProps } from './types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/Card';
import { Button } from '@/components/Button';
import { ArrowUpRightIcon } from 'lucide-react';
import Link from 'next/link';

const AboutCard: React.FC<AboutCardProps> = ({ title, description, Icon }) => {
    return (
        <Card className="flex flex-col border-border bg-background/30 backdrop-blur dark:supports-[backdrop-filter]:bg-background/30 ">
            <CardHeader className="flex-grow">
                <div className="mb-2">
                    <div className="bg-background/1 dark:supports-[backdrop-filter]:bg-background/1 inline-block rounded-lg border-border p-3 backdrop-blur ">
                        <Icon size={36} />
                    </div>
                </div>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
                <CardContent className="flex flex-grow items-end p-0 pt-5">
                    <Button variant="outline" asChild>
                        <Link href="/about">
                            Детальніше
                            <ArrowUpRightIcon className="ml-2" size={16} />
                        </Link>
                    </Button>
                </CardContent>
            </CardHeader>
        </Card>
    );
};

export default memo(AboutCard);
