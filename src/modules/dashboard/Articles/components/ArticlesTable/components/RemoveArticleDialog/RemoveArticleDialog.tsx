import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from '@/components/AlertDialog';
import type { RemoveArticleDialogProps } from './types';
import { api } from '@/utils/api';
import { Button } from '@/components/Button';
import { toast } from '@/components/Toaster/hooks/useToast';
import { Loader2 } from 'lucide-react';
import { memo } from 'react';

const RemoveArticleDialog: React.FC<RemoveArticleDialogProps> = ({ id, open, onOpenChange, onSuccess, ...rest }) => {
    const utils = api.useUtils();

    const { data: articleName } = api.articles.getArticleName.useQuery({
        id,
    });
    const { mutateAsync: removeArticle, isLoading: isArticleRemoving } = api.articles.removeArticle.useMutation({
        async onSuccess() {
            await utils.articles.getAllArticles.invalidate();
            await utils.articles.getStatistics.invalidate();
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange} {...rest}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Видалити статю?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Якщо ви видалите цю статтю, її неможливо буде відновити. Ви впевнені, що хочете видалити статтю{' '}
                        <strong>{articleName}</strong>?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="secondary" disabled={isArticleRemoving}>
                            Відмінити
                        </Button>
                    </AlertDialogCancel>
                    <Button
                        variant="destructive"
                        disabled={isArticleRemoving}
                        onClick={async () => {
                            const removedArticle = await removeArticle({
                                id,
                            });

                            onSuccess?.();
                            onOpenChange?.(false);

                            toast({
                                title: 'Статтю успішно видалено',
                                description: (
                                    <p>
                                        Статтю <strong>{removedArticle.title}</strong> успішно видалено.
                                    </p>
                                ),
                            });
                        }}
                    >
                        {isArticleRemoving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Видалити
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default memo(RemoveArticleDialog);
