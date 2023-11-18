import type { CreateTagDialogProps } from './types';
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

const CreateTagDialog: React.FC<CreateTagDialogProps> = ({ open, onOpenChange, ...rest }) => {
    const [tagName, setTagName] = useState('');

    const utils = api.useUtils();

    const { mutateAsync: createTag, isLoading: isTagCreating } = api.tags.createTag.useMutation({
        async onSuccess() {
            await utils.tags.getAllTags.invalidate();
        },
    });

    const { toast } = useToast();

    return (
        <Dialog open={open} onOpenChange={onOpenChange} {...rest}>
            <DialogContent className="w-[90vw] max-w-[650px]">
                <DialogHeader>
                    <DialogTitle>Створити новий тег</DialogTitle>
                    <DialogDescription>Створіть новий тег, щоб віднести статтю до певної категорії</DialogDescription>
                </DialogHeader>
                <div>
                    <div className="flex items-center">
                        <div className="w-[24.0625rem]">
                            <Label htmlFor="name">Назва тегу</Label>
                            <Input
                                type="text"
                                id="name"
                                placeholder="Введіть назву тегу"
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
                        <Button className="mt-2" variant="secondary" disabled={isTagCreating}>
                            Відмінити
                        </Button>
                    </DialogClose>
                    <Button
                        className="ml-2 mt-2"
                        variant="default"
                        disabled={isTagCreating}
                        onClick={async () => {
                            await createTag({
                                name: tagName,
                            });

                            onOpenChange?.(false);

                            toast({
                                title: 'Тег успішно створено',
                                description: (
                                    <p>
                                        Тег <strong>{tagName}</strong> успішно створено. Тепер ви можете віднести статтю
                                        до цієї категорії
                                    </p>
                                ),
                            });
                        }}
                    >
                        {isTagCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        Додати
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default memo(CreateTagDialog);
