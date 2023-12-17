import { forwardRef, useState } from 'react';
import type { TagInputProps } from './types';
import { cn } from '@/utils/common';
import { Badge } from '../Badge';
import { Check, Edit3, X } from 'lucide-react';
import { Button } from '../Button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../Tooltip';

const TagInput = forwardRef<HTMLInputElement, TagInputProps>(
    ({ className, values, onItemAdd, onItemChange, onItemRemove, ...rest }, ref) => {
        const [changeItemId, setChangeItemId] = useState<string | null>(null);
        const [changeItemValue, setChangeItemValue] = useState<string>('');
        const [inputValue, setInputValue] = useState('');

        const allValuesLength = values.length;

        return (
            <div
                className={cn(
                    'group flex w-full flex-col rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
            >
                <div className="flex flex-wrap gap-2">
                    {values.map(({ label, value }) => {
                        return (
                            <Badge
                                key={value}
                                variant="outline"
                                onBlur={() => {
                                    if (changeItemId === value) {
                                        onItemChange(value, changeItemValue);
                                    }
                                    setChangeItemId(null);
                                    setChangeItemValue('');
                                }}
                            >
                                {changeItemId === value ? (
                                    <input
                                        className="w-min bg-primary underline outline-none focus:ring-background group-hover:bg-transparent"
                                        autoFocus
                                        type="text"
                                        value={changeItemValue}
                                        onChange={(event) => {
                                            setChangeItemValue(event.target.value);
                                        }}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                if (!changeItemValue.length) {
                                                    onItemRemove(value);
                                                    return;
                                                }

                                                onItemChange(value, changeItemValue);
                                                setChangeItemId(null);
                                                setChangeItemValue('');
                                            }
                                        }}
                                    />
                                ) : (
                                    <TooltipProvider>
                                        <Tooltip>
                                            <TooltipTrigger asChild>
                                                <span
                                                    className="max-w-[200px] truncate"
                                                    aria-label={label}
                                                    onClick={() => {
                                                        setChangeItemId(value);
                                                        setChangeItemValue(label);
                                                    }}
                                                >
                                                    {label}
                                                </span>
                                            </TooltipTrigger>
                                            <TooltipContent className="max-w-[50vw] break-all">{label}</TooltipContent>
                                        </Tooltip>
                                    </TooltipProvider>
                                )}
                                {changeItemId === value ? (
                                    <Edit3 size={12} />
                                ) : (
                                    <button
                                        className="ml-2 rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                        type="button"
                                        onClick={() => onItemRemove(value)}
                                    >
                                        <X size={12} />
                                    </button>
                                )}
                            </Badge>
                        );
                    })}
                </div>

                <div
                    className={cn('flex h-10 items-center justify-between', {
                        'mt-4': values.length,
                    })}
                >
                    <input
                        {...rest}
                        ref={ref}
                        className={cn('flex-grow bg-transparent outline-none focus:ring-background', {
                            'ml-2': values.length,
                        })}
                        type="text"
                        placeholder="Введіть імʼя та ініціали"
                        value={inputValue}
                        onChange={(event) => {
                            setInputValue(event.target.value);
                        }}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                onItemChange(event.currentTarget.value, changeItemValue);
                                setChangeItemId(null);
                                setChangeItemValue('');
                            }
                        }}
                    />
                    {inputValue.length ? (
                        <div className="ml-4">
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => {
                                                onItemAdd((allValuesLength + 1).toString(), inputValue);

                                                setInputValue('');
                                            }}
                                        >
                                            <Check className="text-green-600" size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Додати</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button
                                            className="text-red-600"
                                            size="icon"
                                            variant="ghost"
                                            onClick={() => {
                                                setInputValue('');
                                            }}
                                        >
                                            <X size={16} />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Відмінити</TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        </div>
                    ) : null}
                </div>
            </div>
        );
    }
);
TagInput.displayName = 'TagInput';

export default TagInput;
