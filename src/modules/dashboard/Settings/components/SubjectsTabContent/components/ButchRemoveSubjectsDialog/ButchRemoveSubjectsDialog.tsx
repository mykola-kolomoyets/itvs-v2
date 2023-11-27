import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from '@/components/AlertDialog';
import type { ButchRemoveSubjectsDialogProps } from './types';
import { toast } from '@/components/Toaster/hooks/useToast';
import { api } from '@/utils/api';
import { Button } from '@/components/Button';

const ButchRemoveSubjectsDialog: React.FC<ButchRemoveSubjectsDialogProps> = ({
    ids,
    open,
    onOpenChange,
    onSuccess,
    ...rest
}) => {
    const utils = api.useUtils();

    const { mutateAsync: removeSubjects, isLoading: isSubjectsRemoving } = api.subjects.butchRemoveSubjects.useMutation(
        {
            async onSuccess(removedTagsAmount) {
                await utils.subjects.getAllSubjects.invalidate();

                onSuccess?.();
                onOpenChange?.(false);

                toast({
                    title: 'Теги успішно видалені',
                    description: (
                        <p>
                            було видалено <strong>{removedTagsAmount}</strong> тегів. Всі статті з цими тегами були
                            оновлені
                        </p>
                    ),
                });
            },
        }
    );

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange} {...rest}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Видалити <strong>{ids.length}</strong> дисциплін?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        Якщо ви видалите ці дисципліни, то всі викладачі, які до неї привʼязані, будуть без них. Ви
                        впевнені, що хочете видалити ці дисципліни?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="secondary" disabled={isSubjectsRemoving}>
                            Відмінити
                        </Button>
                    </AlertDialogCancel>
                    <Button
                        variant="destructive"
                        disabled={isSubjectsRemoving}
                        onClick={async () => {
                            await removeSubjects({
                                ids,
                            });
                        }}
                    >
                        {isSubjectsRemoving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Видалити
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default memo(ButchRemoveSubjectsDialog);
