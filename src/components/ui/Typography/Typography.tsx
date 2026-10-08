"use client";

import { ElementType } from "react";
import clsx from "clsx";

import { TYPOGRAPHY } from "./typography.constants";
import { TypographyProps } from "./typography.types";

function createTypography<
  DefaultTag extends ElementType,
>(
  defaultTag: DefaultTag,
  styles: string
) {
  return function Typography<
    T extends ElementType = DefaultTag,
  >({
    as,
    className,
    children,
    ...props
  }: TypographyProps<T>) {
    const Component = (
      as ?? defaultTag
    ) as ElementType;

    return (
      <Component
        className={clsx(
          styles,
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  };
}

const Typography = {
  Display: createTypography(
    "h1",
    TYPOGRAPHY.display
  ),

  H1: createTypography(
    "h1",
    TYPOGRAPHY.h1
  ),

  H2: createTypography(
    "h2",
    TYPOGRAPHY.h2
  ),

  H3: createTypography(
    "h3",
    TYPOGRAPHY.h3
  ),

  Body: createTypography(
    "p",
    TYPOGRAPHY.body
  ),

  Small: createTypography(
    "p",
    TYPOGRAPHY.small
  ),

  Caption: createTypography(
    "span",
    TYPOGRAPHY.caption
  ),

  Label: createTypography(
    "span",
    TYPOGRAPHY.label
  ),

  Quote: createTypography(
    "blockquote",
    TYPOGRAPHY.quote
  ),

  List: createTypography(
    "ul",
    TYPOGRAPHY.list
  ),

  ListItem: createTypography(
    "li",
    TYPOGRAPHY.listItem
  ),
};

export default Typography;