/* eslint-disable @next/next/no-img-element */
import type { ImagePickerProps } from './types';
import { IMAGES_ALLOWED_DOMAINS } from './constants';
import { Input } from '@/components/Input';
import { useToast } from '@/components/Toaster/hooks/useToast';
import { Label } from '../Label';
import { TrashIcon } from 'lucide-react';
import { Button } from '../Button';
import Img from '../Img';
import { cn } from '@/utils/common';

const ImagePicker: React.FC<ImagePickerProps> = ({ imageWrapperClassName, url, errorMessage, onUrlChange }) => {
    const { toast } = useToast();

    return (
        <>
            <Label htmlFor="title">Зображення</Label>
            <Input
                type="url"
                id="title"
                placeholder="Вставте посилання на зображення"
                value={url}
                onChange={(event) => {
                    if (!event.target.value.length) {
                        onUrlChange('');
                        return;
                    }

                    if (
                        IMAGES_ALLOWED_DOMAINS.some((domain) => {
                            return event.target.value.includes(domain);
                        })
                    ) {
                        const url = new URL(event.target.value);

                        url.search = '';

                        const newValue = url.toString().replace('file/d/', 'uc?export=view&id=').replace('/view', '');

                        onUrlChange(newValue);
                    } else {
                        setTimeout(() => {
                            toast({
                                variant: 'destructive',
                                title: 'Некоректне посилання на зображення',
                                description: (
                                    <div className="flex flex-wrap">
                                        <span>Дозволені посилання:</span>
                                        <ul className=" mt-2">
                                            {IMAGES_ALLOWED_DOMAINS.map((domain) => {
                                                return (
                                                    <li key={domain}>
                                                        <strong>{domain}</strong>
                                                    </li>
                                                );
                                            })}
                                        </ul>
                                    </div>
                                ),
                            });
                        }, 0);
                    }
                }}
            />
            <span className="text-xs">
                Підтримуються зображення з наступних ресурсів: <strong>Google&nbsp;Docs</strong>,{' '}
                <strong>Unspash</strong>, <strong>Pexels</strong>, <strong>lpnu.ua</strong>
            </span>
            {errorMessage}
            <div className={cn('w-full max-w-[750px]', imageWrapperClassName)}>
                {url ? (
                    <>
                        <div className="relative mt-2 flex justify-center">
                            <Button
                                className="absolute right-4 top-4 z-40"
                                variant="destructive"
                                size="icon"
                                type="button"
                                onClick={() => {
                                    onUrlChange('');
                                }}
                            >
                                <TrashIcon size={16} />
                            </Button>
                            {/* <Loader2 className="-translate-1/2 absolute left-1/2 top-1/2 z-0 animate-spin" size={32} /> */}
                            <Img
                                wrapperClassName="max-h-[550px]"
                                className="w-full"
                                src={url}
                                width={720}
                                height={720}
                                alt="Зображення співробітника"
                                title="Зображення співробітника"
                                onError={() => {
                                    onUrlChange('');
                                }}
                            />
                        </div>
                    </>
                ) : (
                    <p className="mt-3 text-base">Зображення не вставлено, або посилання некоректне</p>
                )}
            </div>
        </>
    );
};

export default ImagePicker;
