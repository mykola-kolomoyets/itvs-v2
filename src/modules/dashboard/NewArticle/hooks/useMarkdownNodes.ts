import { useCallback, useState, useTransition } from 'react';
import { transformNodeToMarkdown } from '@/components/Markdown/utils/transformNodeToMarkdown';
import type { NewsItemConfig } from '../types';
import { produce } from 'immer';
import { moveItem } from '@/utils/common';

export const useMarkdownNodes = () => {
    const [nodes, setNodes] = useState<NewsItemConfig[]>([]);
    const [, startTransition] = useTransition();

    const appendNode = useCallback(
        (nodeType: NewsItemConfig['nodeType']) => {
            const newNode: NewsItemConfig = {
                id: `${nodeType}-${nodes.length}-${new Date().getTime()}}`,
                nodeType,
                content: '',
            };

            setNodes((prev) => {
                return prev.concat([newNode]);
            });
        },
        [nodes.length]
    );

    const removeNode = useCallback((id: string) => {
        setNodes((prev) => {
            return prev.filter((node) => node.id !== id);
        });
    }, []);

    const shiftNodeUp = useCallback((indexToShift: number) => {
        setNodes(
            produce((prev) => {
                moveItem(prev, indexToShift - 1, indexToShift);
            })
        );
    }, []);

    const shiftNodeDown = useCallback((indexToShift: number) => {
        setNodes(
            produce((prev) => {
                moveItem(prev, indexToShift, indexToShift + 1);
            })
        );
    }, []);

    const nodeValueChangeHandler = (id: string, newContent: string) => {
        startTransition(() => {
            setNodes((prev) => {
                return prev.map((node) => {
                    if (node.id === id) {
                        return {
                            ...node,
                            content: newContent,
                        };
                    }

                    return node;
                });
            });
        });
    };

    const transformNodesToMarkdownString = useCallback(() => {
        let markdownString = '';

        nodes.forEach(({ nodeType, content }) => {
            const nodeMarkdown = transformNodeToMarkdown(nodeType, content);
            markdownString += `${nodeMarkdown}\n\n`;
        });

        return markdownString;
    }, [nodes]);

    return {
        nodes,
        appendNode,
        removeNode,
        nodeValueChangeHandler,
        transformNodesToMarkdownString,
        shiftNodeUp,
        shiftNodeDown,
    };
};
