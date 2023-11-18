import type { Article, Tag, User } from "@prisma/client";
import type { inferAsyncReturnType } from "@trpc/server";
import type { db } from "./server/db";

export type ObjValues<T> = T[keyof T];
export type ObjKeys<T> = keyof T;

export type WithClassName<T> = T & {
  /**
        Extendable classnames of component
    */
  className?: string;
};

export type WithChildren<T> = T & {
  /**
        The content of the component.
    */
  children?: React.ReactNode;
};

export type FCProps<T> = WithClassName<WithChildren<T>>;

export type SetStateValue<T> = React.Dispatch<React.SetStateAction<T>>;

export type Option = {
  label: string;
  value: string;
};

export type ArticleForTableItem = Pick<
  Article,
  "id" | "title" | "createdAt"
> & {
  author: Pick<User, "id" | "name" | "role">;
  tags: Tag[];
};

export type UserForTableItem = Omit<
  NonNullable<inferAsyncReturnType<typeof db.user.findFirst>>,
  "emailVerified"
>;
