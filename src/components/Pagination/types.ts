import type { WithClassName } from "@/types";

export type PaginationProps = WithClassName<{
  count: number;
  page: number;
  limit: number;
  onPageChange: (page?: number) => void;
}>;
