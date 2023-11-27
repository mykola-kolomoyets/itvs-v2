import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogCancel,
} from '@/components/AlertDialog';
import type { ButchRemoveEmployeesDialogProps } from './types';
import { toast } from '@/components/Toaster/hooks/useToast';
import { api } from '@/utils/api';
import { Button } from '@/components/Button';

const ButchRemoveEmployeesDialog: React.FC<ButchRemoveEmployeesDialogProps> = ({
    ids,
    open,
    onOpenChange,
    onSuccess,
    ...rest
}) => {
    const utils = api.useUtils();

    const { mutateAsync: removeEmployees, isLoading: isEmployeesRemoving } =
        api.employees.butchRemoveEmployees.useMutation({
            async onSuccess(removedEmployeesAmount) {
                await utils.employees.getAllEmployees.invalidate();

                onSuccess?.();

                onOpenChange?.(false);

                toast({
                    title: 'Співробітники успішно видалені',
                    description: (
                        <p>
                            було видалено <strong>{removedEmployeesAmount}</strong> співробітників.
                        </p>
                    ),
                });
            },
        });

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange} {...rest}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        Видалити <strong>{ids.length}</strong> співробітників?
                    </AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="secondary" disabled={isEmployeesRemoving}>
                            Відмінити
                        </Button>
                    </AlertDialogCancel>
                    <Button
                        variant="destructive"
                        disabled={isEmployeesRemoving}
                        onClick={async () => {
                            await removeEmployees({
                                ids,
                            });
                        }}
                    >
                        {isEmployeesRemoving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Видалити
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default memo(ButchRemoveEmployeesDialog);
