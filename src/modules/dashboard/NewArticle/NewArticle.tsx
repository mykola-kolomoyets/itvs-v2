import { memo, useCallback, useMemo, useState } from 'react';
import { useMarkdownNodes } from './hooks/useMarkdownNodes';
import DashboardLayout from '@/components/layout/DashboardLayout';
import { Button } from '@/components/Button';
import { Label } from '@/components/Label';
import { Input } from '@/components/Input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import { api } from '@/utils/api';
import { ArrowDownIcon, ArrowUpIcon, CheckIcon, Loader2, PlusIcon, RotateCcw, TrashIcon } from 'lucide-react';
import { ScrollArea } from '@/components/ScrollArea';
import { Badge } from '@/components/Badge';
import { useDebouncedState } from '@/hooks/useDebouncedState';
import { PopoverClose } from '@radix-ui/react-popover';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/DropdownMenu';
import { Case, Switch } from '@/components/utils/Switch';
import { Textarea } from '@/components/TextArea';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/Tooltip';
import Image from 'next/image';
import { shimmer, toBase64 } from '@/utils/common';
import { IMAGES_ALLOWED_DOMAINS } from './constants';
import { useToast } from '@/components/Toaster/hooks/useToast';
import { useRouter } from 'next/navigation';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogTitle,
    DialogTrigger,
} from '@/components/Dialog';
import { useToggle } from '@/hooks/useToggle';

const NewArticleModule: React.FC = () => {
    const router = useRouter();

    const [title, setTitle] = useState('');
    const [tagsSearchValue, debouncesTagsSearchValue, setTagsSearchValue] = useDebouncedState('');
    const [selectedTagsIds, setSelectedTagsIds] = useState<string[]>([]);
    const [posterUrl, setPosterUrl] = useState('');
    const [isPosterUrlDialogOpened, , setPosterUrlDialogOpened] = useToggle();
    // const [attachments, setAttachments] = useState<string[]>([]);

    const utils = api.useUtils();

    const { mutateAsync: createArticle, isLoading: isArticleCreating } = api.articles.createArticle.useMutation({
        async onSuccess() {
            await utils.articles.getAllArticles.invalidate();
        },
    });
    const { data: allTags } = api.tags.getAllTags.useQuery(
        {
            search: debouncesTagsSearchValue.trim(),
        },
        {
            keepPreviousData: true,
            refetchOnWindowFocus: false,
        }
    );

    const {
        nodes,
        appendNode,
        removeNode,
        transformNodesToMarkdownString,
        nodeValueChangeHandler,
        shiftNodeUp,
        shiftNodeDown,
    } = useMarkdownNodes();
    const { toast } = useToast();

    const isPublishingEnabled = useMemo(() => {
        const isTitleValid = !!title.length;
        const areNodesValid =
            nodes.length &&
            nodes.every((node) => {
                return !!node.content;
            });

        return isTitleValid && areNodesValid;
    }, [nodes, title.length]);

    const selectedTags = useMemo(() => {
        return (
            allTags?.filter((tag) => {
                return selectedTagsIds.includes(tag.id);
            }) ?? []
        );
    }, [allTags, selectedTagsIds]);

    const createArticleHandler = useCallback(async () => {
        const markdownString = transformNodesToMarkdownString();

        await createArticle({
            title,
            content: markdownString,
            tags: selectedTagsIds,
            posterUrl,
        });

        toast({
            title: 'Стаття успішно створена',
        });

        console.log(markdownString);
        router.replace('/dashboard/articles');
    }, [createArticle, posterUrl, router, selectedTagsIds, title, toast, transformNodesToMarkdownString]);

    const toggleTagsHandler = useCallback(
        (value: string) => {
            if (selectedTagsIds.includes(value)) {
                setSelectedTagsIds((prev) => {
                    return prev.filter((id) => {
                        return id !== value;
                    });
                });

                return;
            }

            setSelectedTagsIds((prev) => {
                return [...prev, value];
            });
        },
        [selectedTagsIds]
    );

    return (
        <DashboardLayout>
            <section className="sticky top-[60px] border-b border-solid border-border bg-background/95 pb-4 pt-[18px] backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className=" container flex items-start justify-between">
                    <h1 className="mb-[1.125rem] text-3xl font-semibold">Нова стаття</h1>
                    <div className="flex">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button className="mr-2" variant="ghost">
                                    <PlusIcon className="mr-1" size={16} />
                                    Додати елемент
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-full" align="end">
                                <DropdownMenuItem
                                    className="w-[175px]"
                                    onClick={() => {
                                        appendNode('heading-two');
                                    }}
                                >
                                    Підзаголовок
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        appendNode('paragraph');
                                    }}
                                >
                                    Абзац
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    onClick={() => {
                                        appendNode('image');
                                    }}
                                >
                                    Зображення
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                            variant="default"
                            disabled={!isPublishingEnabled || isArticleCreating}
                            onClick={createArticleHandler}
                        >
                            {isArticleCreating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                            Опублікувати
                        </Button>
                    </div>
                </div>
                <section className="container flex items-end">
                    <div className="w-[24.0625rem]">
                        <Label htmlFor="title">Назва статті</Label>
                        <Input
                            type="text"
                            id="title"
                            placeholder="Введіть назву статті"
                            value={title}
                            onChange={(event) => {
                                setTitle(event.target.value);
                            }}
                        />
                    </div>
                    <div>
                        {!!allTags && !!allTags.length ? (
                            <div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button className="ml-3" variant="secondary" title="Фільтр">
                                            <PlusIcon className="mr-1" size={16} />
                                            Додати теги
                                            {selectedTagsIds.length ? ` (${selectedTagsIds.length})` : ''}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-80" align="start">
                                        <h6 className="mb-1 ml-4 text-sm">Теги</h6>
                                        <Input
                                            className="mt-3"
                                            type="search"
                                            placeholder="Введіть назву тегу"
                                            value={tagsSearchValue}
                                            onChange={(event) => {
                                                setTagsSearchValue(event.target.value);
                                            }}
                                        />
                                        <ScrollArea className="my-3 h-[400px] max-h-[400px]">
                                            <div className="flex flex-col">
                                                {allTags.map((tag) => {
                                                    return (
                                                        <Button
                                                            key={tag.id}
                                                            className="justify-between"
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={() => {
                                                                toggleTagsHandler(tag.id);
                                                            }}
                                                        >
                                                            {tag.name}
                                                            {selectedTagsIds.includes(tag.id) ? (
                                                                <CheckIcon size={16} />
                                                            ) : null}
                                                        </Button>
                                                    );
                                                })}
                                            </div>
                                        </ScrollArea>
                                        <PopoverClose>
                                            <Button
                                                variant="outline"
                                                onClick={() => {
                                                    setSelectedTagsIds([]);
                                                }}
                                            >
                                                Очистити
                                            </Button>
                                        </PopoverClose>
                                    </PopoverContent>
                                </Popover>
                            </div>
                        ) : null}
                    </div>
                    <div>
                        <Dialog open={isPosterUrlDialogOpened} onOpenChange={setPosterUrlDialogOpened}>
                            <DialogTrigger asChild>
                                <Button className="ml-2" variant="outline">
                                    {!!posterUrl ? 'Змінити постер' : 'Додати постер'}
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogTitle>Додати постер для статті</DialogTitle>
                                <DialogDescription>
                                    Постер буде відображатися у списку статтей та на сторінці статті
                                </DialogDescription>
                                <div className="mr-5 w-full">
                                    <Label htmlFor="title">Посилання на зображення</Label>
                                    <Input
                                        type="text"
                                        id="title"
                                        placeholder="Вставте посилання на зображення"
                                        value={posterUrl}
                                        onChange={(event) => {
                                            if (!event.target.value.length) {
                                                setPosterUrl('');
                                                return;
                                            }

                                            if (
                                                IMAGES_ALLOWED_DOMAINS.some((domain) => {
                                                    return event.target.value.includes(domain);
                                                })
                                            ) {
                                                const newValue = event.target.value
                                                    .replace('file/d/', 'uc?export=view&id=')
                                                    .replace('/view?usp=sharing', '');

                                                setPosterUrl(newValue);
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
                                        Підтримуються зображення з наступних ресурсів: <strong>Google&nbsp;Docs</strong>
                                        , <strong>Unspash</strong>, <strong>Pexels</strong>, <strong>lpnu.ua</strong>
                                    </span>
                                </div>
                                <div className="w-full max-w-[750px]">
                                    {posterUrl ? (
                                        <>
                                            <div className="mt-2 flex justify-center">
                                                <ScrollArea className="max-h-[500px] rounded-lg">
                                                    <Image
                                                        src={posterUrl}
                                                        width={750}
                                                        height={750}
                                                        alt={title}
                                                        title={title}
                                                        placeholder="blur"
                                                        blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                                            shimmer(750, 750)
                                                        )}`}
                                                        onError={() => {
                                                            setPosterUrl('');
                                                        }}
                                                    />
                                                </ScrollArea>
                                            </div>
                                            <DialogFooter className="mt-4">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => {
                                                        setPosterUrl('');
                                                    }}
                                                >
                                                    Стерти
                                                </Button>
                                                <Button
                                                    onClick={() => {
                                                        setPosterUrlDialogOpened(false);
                                                    }}
                                                >
                                                    Підтвердити
                                                </Button>
                                            </DialogFooter>
                                        </>
                                    ) : (
                                        <p className="mt-3 text-base">
                                            Зображення не вставлено, або посилання некоректне
                                        </p>
                                    )}
                                </div>
                            </DialogContent>
                        </Dialog>
                    </div>
                </section>
                <div className="container flex items-center">
                    {selectedTagsIds.length ? (
                        <div className=" mt-2 flex items-center">
                            <p className="mr-2 text-base">Теги:</p>
                            {selectedTags.map((tag) => {
                                return (
                                    <Badge
                                        key={tag.id}
                                        className="mr-1"
                                        title={tag.name}
                                        variant="secondary"
                                        onClick={() => {
                                            toggleTagsHandler(tag.id);
                                        }}
                                    >
                                        {tag.name}
                                    </Badge>
                                );
                            })}

                            <Button
                                className="ml-2"
                                variant="ghost"
                                size={'sm'}
                                onClick={() => {
                                    setSelectedTagsIds([]);
                                }}
                            >
                                <RotateCcw className="mr-1" size={16} />
                                Очистити всі
                            </Button>
                        </div>
                    ) : null}
                </div>
            </section>
            <section className="mt-6">
                {/* <div className="mr-5 w-full max-w-[400px]">
                    <Label htmlFor="title">Вкладення</Label>
                    <Input
                        type="text"
                        id="title"
                        placeholder="Введіть посилання вкладення"
                        value={attachments[0] ?? ''}
                        onChange={async (event) => {
                            if (!event.target.value.length) {
                                return;
                            }

                            const file = await fetch(event.target.value.trim());
                            const a = await file.blob();

                            console.log(a);
                        }}
                    />
                </div> */}
                {!!nodes.length ? (
                    <div>
                        {nodes.map((node, index) => {
                            console.log(nodes.length, index, index === nodes.length - 1);
                            return (
                                <div
                                    key={node.id}
                                    className="group px-6 pb-6 pt-4 transition-colors focus-within:bg-accent hover:bg-accent"
                                >
                                    <Switch>
                                        <Case condition={node.nodeType === 'heading-two'}>
                                            <div className="flex items-start justify-between">
                                                <div className="mr-5 w-full max-w-[400px]">
                                                    <Label htmlFor="title">Підзаголовок</Label>
                                                    <Input
                                                        type="text"
                                                        id="title"
                                                        placeholder="Введіть підзаголовок розділу"
                                                        value={node.content}
                                                        onChange={(event) => {
                                                            nodeValueChangeHandler(node.id, event.target.value);
                                                        }}
                                                    />
                                                </div>
                                                <div className="focus-within:opacity:100 mt-6 flex items-center opacity-0 transition-opacity hover:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100">
                                                    {index === 0 ? null : (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        className="mr-2"
                                                                        size="icon"
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            shiftNodeUp(index);
                                                                        }}
                                                                    >
                                                                        <ArrowUpIcon size={16} />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top">
                                                                    <p>Перемістити елемент вгору</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                    {index === nodes.length - 1 ? null : (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        className="mr-2"
                                                                        size="icon"
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            shiftNodeDown(index);
                                                                        }}
                                                                    >
                                                                        <ArrowDownIcon size={16} />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top">
                                                                    <p>Перемістити елемент вниз</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="icon"
                                                                    onClick={() => {
                                                                        removeNode(node.id);
                                                                    }}
                                                                >
                                                                    <TrashIcon size={16} />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top">
                                                                <p>Видалити елемент</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </div>
                                        </Case>
                                        <Case condition={node.nodeType === 'paragraph'}>
                                            <div className="flex items-start justify-between">
                                                <div className="mr-5 w-full">
                                                    <Label htmlFor="title">Абзац</Label>
                                                    <Textarea
                                                        placeholder="Введіть текст абзацу"
                                                        value={node.content}
                                                        onChange={(event) => {
                                                            nodeValueChangeHandler(node.id, event.target.value);
                                                        }}
                                                    />
                                                </div>
                                                <div className="focus-within:opacity:100 mt-6 flex items-center opacity-0 transition-opacity hover:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100">
                                                    {index === 0 ? null : (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        className="mr-2"
                                                                        size="icon"
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            shiftNodeUp(index);
                                                                        }}
                                                                    >
                                                                        <ArrowUpIcon size={16} />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top">
                                                                    <p>Перемістити елемент вгору</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                    {index === nodes.length - 1 ? null : (
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        className="mr-2"
                                                                        size="icon"
                                                                        variant="outline"
                                                                        onClick={() => {
                                                                            shiftNodeDown(index);
                                                                        }}
                                                                    >
                                                                        <ArrowDownIcon size={16} />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top">
                                                                    <p>Перемістити елемент вниз</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    )}
                                                    <TooltipProvider>
                                                        <Tooltip>
                                                            <TooltipTrigger asChild>
                                                                <Button
                                                                    variant="destructive"
                                                                    size="icon"
                                                                    onClick={() => {
                                                                        removeNode(node.id);
                                                                    }}
                                                                >
                                                                    <TrashIcon size={16} />
                                                                </Button>
                                                            </TooltipTrigger>
                                                            <TooltipContent side="top">
                                                                <p>Видалити елемент</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                </div>
                                            </div>
                                        </Case>
                                        <Case condition={node.nodeType === 'image'}>
                                            <div>
                                                <div className="flex items-start justify-between">
                                                    <div className="mr-5 w-full">
                                                        <Label htmlFor="title">Зображення</Label>
                                                        <Input
                                                            type="text"
                                                            id="title"
                                                            placeholder="Вставте посилання на зображення сюди"
                                                            value={node.content}
                                                            onChange={(event) => {
                                                                if (
                                                                    IMAGES_ALLOWED_DOMAINS.some((domain) => {
                                                                        return event.target.value.includes(domain);
                                                                    })
                                                                ) {
                                                                    const newValue = event.target.value
                                                                        .replace('file/d/', 'uc?export=view&id=')
                                                                        .replace('/view?usp=sharing', '');

                                                                    nodeValueChangeHandler(node.id, newValue);
                                                                } else {
                                                                    setTimeout(() => {
                                                                        toast({
                                                                            variant: 'destructive',
                                                                            title: 'Некоректне посилання на зображення',
                                                                            description: (
                                                                                <div className="flex flex-wrap">
                                                                                    <span>Дозволені посилання:</span>
                                                                                    <ul className=" mt-2">
                                                                                        {IMAGES_ALLOWED_DOMAINS.map(
                                                                                            (domain) => {
                                                                                                return (
                                                                                                    <li key={domain}>
                                                                                                        <strong>
                                                                                                            {domain}
                                                                                                        </strong>
                                                                                                    </li>
                                                                                                );
                                                                                            }
                                                                                        )}
                                                                                    </ul>
                                                                                </div>
                                                                            ),
                                                                        });
                                                                    }, 0);
                                                                }
                                                            }}
                                                        />
                                                        <span className="text-xs">
                                                            Підтримуються зображення з наступних ресурсів:{' '}
                                                            <strong>Google Docs</strong> , <strong>Unspash</strong>,{' '}
                                                            <strong>Pexels</strong>, <strong>lpnu.ua</strong>
                                                        </span>
                                                    </div>
                                                    <div className="focus-within:opacity:100 mt-6 flex items-center opacity-0 transition-opacity hover:opacity-100 group-focus-within:opacity-100 group-hover:opacity-100">
                                                        {index === 0 ? null : (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            className="mr-2"
                                                                            size="icon"
                                                                            variant="outline"
                                                                            onClick={() => {
                                                                                shiftNodeUp(index);
                                                                            }}
                                                                        >
                                                                            <ArrowUpIcon size={16} />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent side="top">
                                                                        <p>Перемістити елемент вгору</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        )}
                                                        {index === nodes.length - 1 ? null : (
                                                            <TooltipProvider>
                                                                <Tooltip>
                                                                    <TooltipTrigger asChild>
                                                                        <Button
                                                                            className="mr-2"
                                                                            size="icon"
                                                                            variant="outline"
                                                                            onClick={() => {
                                                                                shiftNodeDown(index);
                                                                            }}
                                                                        >
                                                                            <ArrowDownIcon size={16} />
                                                                        </Button>
                                                                    </TooltipTrigger>
                                                                    <TooltipContent side="top">
                                                                        <p>Перемістити елемент вниз</p>
                                                                    </TooltipContent>
                                                                </Tooltip>
                                                            </TooltipProvider>
                                                        )}
                                                        <TooltipProvider>
                                                            <Tooltip>
                                                                <TooltipTrigger asChild>
                                                                    <Button
                                                                        variant="destructive"
                                                                        size="icon"
                                                                        onClick={() => {
                                                                            removeNode(node.id);
                                                                        }}
                                                                    >
                                                                        <TrashIcon size={16} />
                                                                    </Button>
                                                                </TooltipTrigger>
                                                                <TooltipContent side="top">
                                                                    <p>Видалити елемент</p>
                                                                </TooltipContent>
                                                            </Tooltip>
                                                        </TooltipProvider>
                                                    </div>
                                                </div>
                                                {node.content ? (
                                                    <div className="mt-3 flex justify-center">
                                                        <Image
                                                            src={node.content}
                                                            width={640}
                                                            height={640}
                                                            alt={title}
                                                            title={title}
                                                            placeholder="blur"
                                                            blurDataURL={`data:image/svg+xml;base64,${toBase64(
                                                                shimmer(640, 640)
                                                            )}`}
                                                            onError={() => {
                                                                nodeValueChangeHandler(node.id, '');
                                                            }}
                                                        />
                                                    </div>
                                                ) : (
                                                    <p className="mt-3 text-base">
                                                        Зображення не вставлено, або посилання некоректне
                                                    </p>
                                                )}
                                            </div>
                                        </Case>
                                    </Switch>
                                </div>
                            );
                        })}
                    </div>
                ) : null}
            </section>
        </DashboardLayout>
    );
};

export default memo(NewArticleModule);
