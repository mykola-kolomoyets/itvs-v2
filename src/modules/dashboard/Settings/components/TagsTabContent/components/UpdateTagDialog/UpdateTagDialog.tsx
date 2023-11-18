import type { UpdateTagDialogProps } from './types';
import { api } from '@/utils/api';
import { useToast } from '@/components/Toaster/hooks/useToast';
import { Button } from '@/components/Button';
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/Dialog';
import { memo, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';

const UpdateTagDialog: React.FC<UpdateTagDialogProps> = ({ id, open, onOpenChange, onSuccess, ...rest }) => {
    const [tagName, setTagName] = useState('');

    const utils = api.useUtils();
    const { toast } = useToast();

    const { data: tagItem } = api.tags.getTagItem.useQuery({
        id,
    });
    const { mutateAsync: updateTag, isLoading: isTagUpdating } = api.tags.updateTag.useMutation({
        async onSuccess() {
            await utils.tags.getAllTags.invalidate();
        },
    });

    const isFormValid = tagName.trim().length > 3 && tagName.trim() !== tagItem?.name;

    return (
        <Dialog open={open} onOpenChange={onOpenChange} {...rest}>
            <DialogContent className="w-[90vw] max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Оновити тег</DialogTitle>
                    <DialogDescription>
                        Оновіть назву тегу <strong>{tagItem?.name}</strong>
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div className="flex items-center">
                        <div className="w-[24.0625rem]">
                            <Label htmlFor="name">Назва тегу</Label>
                            <Input
                                defaultValue={tagItem?.name}
                                type="text"
                                id="name"
                                placeholder="Введіть нову назву тегу"
                                value={tagName}
                                onChange={(event) => {
                                    setTagName(event.target.value);
                                }}
                            />
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button className="mt-2" variant="secondary" disabled={isTagUpdating}>
                            Відмінити
                        </Button>
                    </DialogClose>
                    <Button
                        className="ml-2 mt-2"
                        variant="default"
                        disabled={!isFormValid || isTagUpdating}
                        onClick={async () => {
                            await updateTag({
                                id,
                                name: tagName,
                            });

                            onSuccess?.();
                            onOpenChange?.(false);

                            toast({
                                title: 'Тег успішно оновлено',
                                description: (
                                    <p>
                                        Тег <strong>{tagName}</strong> успішно оновлено.
                                    </p>
                                ),
                            });
                        }}
                    >
                        {isTagUpdating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Оновити
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default memo(UpdateTagDialog);
