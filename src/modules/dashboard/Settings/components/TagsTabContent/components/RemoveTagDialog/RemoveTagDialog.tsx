import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from '@/components/AlertDialog';
import type { RemoveTagDialogProps } from './types';
import { api } from '@/utils/api';
import { Button } from '@/components/Button';
import { toast } from '@/components/Toaster/hooks/useToast';
import { Loader2 } from 'lucide-react';
import { memo } from 'react';

const RemoveTagDialog: React.FC<RemoveTagDialogProps> = ({ id, open, onOpenChange, onSuccess, ...rest }) => {
    const utils = api.useUtils();

    const { mutateAsync: removeTag, isLoading: isTagRemoving } = api.tags.removeTag.useMutation({
        async onSuccess(removedTag) {
            await utils.tags.getAllTags.invalidate();

            onSuccess?.();
            onOpenChange?.(false);

            toast({
                title: 'Тег успішно видалено',
                description: (
                    <p>
                        Тег <strong>{removedTag.name}</strong> успішно видалено. Всі статті з цим тегом були оновлені
                    </p>
                ),
            });
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange} {...rest}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Видалити тег?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Якщо ви видалите цей тег, то всі статті, які до нього належать, будуть без тегу. Ви впевнені, що
                        хочете видалити цей тег?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="secondary" disabled={isTagRemoving}>
                            Відмінити
                        </Button>
                    </AlertDialogCancel>
                    <Button
                        variant="destructive"
                        disabled={isTagRemoving}
                        onClick={async () => {
                            await removeTag({
                                id,
                            });
                        }}
                    >
                        {isTagRemoving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Видалити
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default memo(RemoveTagDialog);
