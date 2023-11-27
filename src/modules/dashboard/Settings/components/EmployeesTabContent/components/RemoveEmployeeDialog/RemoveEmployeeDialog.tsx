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
import type { RemoveEmployeeDialogProps } from './types';
import { toast } from '@/components/Toaster/hooks/useToast';
import { api } from '@/utils/api';
import { Button } from '@/components/Button';

const RemoveEmployeeDialog: React.FC<RemoveEmployeeDialogProps> = ({
    employeeId,
    open,
    onOpenChange,
    onSuccess,
    ...rest
}) => {
    const utils = api.useUtils();

    const { data: employeeToDeleteData } = api.employees.getEmployeesItem.useQuery({
        id: employeeId,
    });
    const { mutateAsync: removeEmployee, isLoading: isEmployeeRemoving } = api.employees.removeEmployee.useMutation({
        async onSuccess(removedEmployee) {
            await utils.employees.getAllEmployees.invalidate();

            onSuccess?.();
            onOpenChange?.(false);

            toast({
                title: 'Співробітника успішно видалено',
                description: (
                    <p>
                        Співробітника <strong>{removedEmployee.name}</strong> успішно видалено.
                    </p>
                ),
            });
        },
    });

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange} {...rest}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Видалити співробітника {employeeToDeleteData?.name}?</AlertDialogTitle>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel asChild>
                        <Button variant="secondary" disabled={isEmployeeRemoving}>
                            Відмінити
                        </Button>
                    </AlertDialogCancel>
                    <Button
                        variant="destructive"
                        disabled={isEmployeeRemoving}
                        onClick={async () => {
                            await removeEmployee({
                                id: employeeId,
                            });
                        }}
                    >
                        {isEmployeeRemoving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Видалити
                    </Button>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default memo(RemoveEmployeeDialog);
