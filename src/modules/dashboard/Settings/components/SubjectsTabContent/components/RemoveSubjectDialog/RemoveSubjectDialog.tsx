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
import type { RemoveSubjectDialogProps } from './types';
import { toast } from '@/components/Toaster/hooks/useToast';
import { api } from '@/utils/api';
import { Button } from '@/components/Button';

const RemoveSubjectDialog: React.FC<RemoveSubjectDialogProps> = ({ id, open, onOpenChange, onSuccess, ...rest }) => {
    const utils = api.useUtils();

    const { data: subjectTpDeleteData } = api.subjects.getSubjectItem.useQuery({
        id,
    });
    const { mutateAsync: removeSubject, isLoading: isSubjectRemoving } = api.subjects.removeSubject.useMutation({
        async onSuccess(removedSubject) {
            await utils.subjects.getAllSubjects.invalidate();

            onSuccess?.();
            onOpenChange?.(false);

            toast({
                title: 'Дисципліну успішно видалено',
                description: (
                    <p>
                        Дисципліну <strong>{removedSubject.name}</strong> успішно видалено. Всі викладачі з цією
                        дисципліною були оновлені
                    </p>
                ),
            });
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange} {...rest}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Видалити дисципліну {subjectTpDeleteData?.name}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Якщо ви видалите цю дисципліну, то всі викладачі, які до неї привʼязані, будуть без неї. Ви
                        впевнені, що хочете видалити цю дисципліну?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="secondary" disabled={isSubjectRemoving}>
                            Відмінити
                        </Button>
                    </AlertDialogCancel>
                    <Button
                        variant="destructive"
                        disabled={isSubjectRemoving}
                        onClick={async () => {
                            await removeSubject({
                                id,
                            });
                        }}
                    >
                        {isSubjectRemoving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Видалити
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default memo(RemoveSubjectDialog);
