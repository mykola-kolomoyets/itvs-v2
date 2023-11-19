import type { ObjValues, WithClassName } from "@/types";
import type { MARKDOWN_NODES } from "./constants";

export type MarkdownProps = WithClassName<{
  children: string;
}>;

export type MarkdownNodes = ObjValues<typeof MARKDOWN_NODES>;
