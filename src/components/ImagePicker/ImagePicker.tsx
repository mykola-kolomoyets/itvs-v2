import type { ImagePickerProps } from './types';
import { IMAGES_ALLOWED_DOMAINS } from './constants';
import { Input } from '@/components/Input';
import { useToast } from '@/components/Toaster/hooks/useToast';
import { Label } from '../Label';

const ImagePicker: React.FC<ImagePickerProps> = ({ url, onUrlChange }) => {
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

                        console.log(newValue);

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
        </>
    );
};

export default ImagePicker;
