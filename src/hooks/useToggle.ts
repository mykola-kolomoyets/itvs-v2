import { useCallback, useState } from "react";
import type { SetStateValue } from "@/types";

export const useToggle = (
  defaultValue?: boolean,
): [boolean, () => void, SetStateValue<boolean>] => {
  const [value, setValue] = useState(Boolean(defaultValue));

  const toggle = useCallback(() => {
    setValue((x) => {
      return !x;
    });
  }, []);

  return [value, toggle, setValue];
};
