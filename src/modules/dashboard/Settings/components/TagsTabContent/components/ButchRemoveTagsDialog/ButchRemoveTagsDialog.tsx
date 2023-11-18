import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from '@/components/AlertDialog';
import type { ButchRemoveTagsDialogProps } from './types';
import { api } from '@/utils/api';
import { Button } from '@/components/Button';
import { toast } from '@/components/Toaster/hooks/useToast';
import { Loader2 } from 'lucide-react';
import { memo } from 'react';

const RemoveTagDialog: React.FC<ButchRemoveTagsDialogProps> = ({ ids, open, onOpenChange, onSuccess, ...rest }) => {
    const utils = api.useUtils();

    const { mutateAsync: removeTags, isLoading: isTagsRemoving } = api.tags.butchRemoveTags.useMutation({
        async onSuccess() {
            await utils.tags.getAllTags.invalidate();
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange} {...rest}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Видалити <strong>{ids.length}</strong> тегів?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Якщо ви видалите ці теги, то всі статті, які до них належать, будуть без тегу. Ви впевнені, що
                        хочете видалити ці теги?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="secondary" disabled={isTagsRemoving}>
                            Відмінити
                        </Button>
                    </AlertDialogCancel>
                    <Button
                        variant="destructive"
                        disabled={isTagsRemoving}
                        onClick={async () => {
                            const removedTagsAmount = await removeTags({
                                ids,
                            });

                            onSuccess?.();
                            onOpenChange?.(false);

                            toast({
                                title: 'Теги успішно видалені',
                                description: (
                                    <p>
                                        було видалено <strong>{removedTagsAmount}</strong> тегів. Всі статті з цими
                                        тегами були оновлені
                                    </p>
                                ),
                            });
                        }}
                    >
                        {isTagsRemoving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Видалити
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default memo(RemoveTagDialog);
