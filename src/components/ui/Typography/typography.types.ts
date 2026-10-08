import {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";

export type TypographyOwnProps = {
  children: ReactNode;
  className?: string;
};

export type TypographyProps<
  T extends ElementType,
> = TypographyOwnProps & {
  as?: T;
} & Omit<
  ComponentPropsWithoutRef<T>,
  keyof TypographyOwnProps | "as"
>;