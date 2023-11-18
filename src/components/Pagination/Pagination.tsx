import type { PaginationProps } from "./types";
import { cn } from "@/utils/common";
import { Button } from "@/components/Button";
import { memo } from "react";

const Pagination: React.FC<PaginationProps> = ({
  className,
  count,
  limit,
  page,
  onPageChange,
}) => {
  const currentPage = page ?? 1;
  const from = (currentPage - 1) * limit + 1;
  const to = Math.min(count, currentPage * limit);
  const lastPage = Math.max(0, Math.ceil(count / limit));
  const disabledBackButtons = currentPage === 1;
  const disabledNextButtons = currentPage === lastPage;

  console.log({
    count,
    limit,
    page,
  });

  return (
    <div
      className={cn("flex items-center justify-end space-x-2 py-4", className)}
    >
      <div className="flex-1 text-sm text-muted-foreground">
        {from} - {to} з {count}
      </div>
      <div className="space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onPageChange(page - 1);
          }}
          disabled={disabledBackButtons}
        >
          Назад
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            onPageChange(page + 1);
          }}
          disabled={disabledNextButtons}
        >
          Далі
        </Button>
      </div>
    </div>
  );
};

export default memo(Pagination);
