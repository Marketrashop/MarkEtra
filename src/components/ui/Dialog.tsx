"use client";

import * as React from "react";

import * as DialogPrimitive from "@radix-ui/react-dialog";

import { X } from "lucide-react";

function cn(
  ...classes: Array<
    string | false | null | undefined
  >
) {
  return classes
    .filter(Boolean)
    .join(" ");
}

const Dialog =
  DialogPrimitive.Root;

const DialogTrigger =
  DialogPrimitive.Trigger;

const DialogPortal =
  DialogPrimitive.Portal;

const DialogClose =
  DialogPrimitive.Close;

const DialogOverlay =
  React.forwardRef<
    React.ElementRef<
      typeof DialogPrimitive.Overlay
    >,
    React.ComponentPropsWithoutRef<
      typeof DialogPrimitive.Overlay
    >
  >(function DialogOverlay(
    {
      className,
      ...props
    },
    ref,
  ) {
    return (
      <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
          `
          fixed
          inset-0
          z-50
          bg-black/60
          backdrop-blur-sm
          `,
          className,
        )}
        {...props}
      />
    );
  });

DialogOverlay.displayName =
  DialogPrimitive.Overlay.displayName;

const DialogContent =
  React.forwardRef<
    React.ElementRef<
      typeof DialogPrimitive.Content
    >,
    React.ComponentPropsWithoutRef<
      typeof DialogPrimitive.Content
    >
  >(function DialogContent(
    {
      className,
      children,
      ...props
    },
    ref,
  ) {

        return (
      <DialogPortal>
        <DialogOverlay />

        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            `
            fixed
            left-1/2
            top-1/2
            z-50

            w-[calc(100%-2rem)]
            max-w-lg

            -translate-x-1/2
            -translate-y-1/2

            rounded-2xl

            border
            border-[var(--border)]

            bg-[var(--background)]

            p-6

            shadow-2xl

            focus:outline-none
            `,
            className,
          )}
          {...props}
        >
          {children}

          <DialogPrimitive.Close
            className="
              absolute
              right-4
              top-4

              rounded-md

              p-1

              opacity-70

              transition-opacity

              hover:opacity-100

              focus:outline-none
            "
          >
            <X size={18} />

            <span className="sr-only">
              Close
            </span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPortal>
    );
  });

DialogContent.displayName =
  DialogPrimitive.Content.displayName;

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      `
      flex
      flex-col

      space-y-2

      text-center

      sm:text-left
      `,
      className,
    )}
    {...props}
  />
);

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      `
      mt-6

      flex
      flex-col-reverse

      gap-3

      sm:flex-row
      sm:justify-end
      `,
      className,
    )}
    {...props}
  />
);

const DialogTitle =
  React.forwardRef<
    React.ElementRef<
      typeof DialogPrimitive.Title
    >,
    React.ComponentPropsWithoutRef<
      typeof DialogPrimitive.Title
    >
  >(function DialogTitle(
    {
      className,
      ...props
    },
    ref,
  ) {

        return (
      <DialogPrimitive.Title
        ref={ref}
        className={cn(
          `
          text-lg
          font-semibold
          leading-none
          tracking-tight
          `,
          className,
        )}
        {...props}
      />
    );
  });

DialogTitle.displayName =
  DialogPrimitive.Title.displayName;

const DialogDescription =
  React.forwardRef<
    React.ElementRef<
      typeof DialogPrimitive.Description
    >,
    React.ComponentPropsWithoutRef<
      typeof DialogPrimitive.Description
    >
  >(function DialogDescription(
    {
      className,
      ...props
    },
    ref,
  ) {
    return (
      <DialogPrimitive.Description
        ref={ref}
        className={cn(
          `
          text-sm
          text-[var(--muted-foreground)]
          `,
          className,
        )}
        {...props}
      />
    );
  });

DialogDescription.displayName =
  DialogPrimitive.Description.displayName;

export {
  Dialog,
  DialogTrigger,
  DialogPortal,
  DialogClose,
  DialogOverlay,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};