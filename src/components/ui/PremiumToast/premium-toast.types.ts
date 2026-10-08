export type PremiumToastVariant =
  | "success"
  | "info"
  | "warning"
  | "error";

export type PremiumToastOptions = {
  title: string;

  description?: string;

  variant?: PremiumToastVariant;

  duration?: number;

  dismissible?: boolean;

  persistOnNavigation?: boolean;

  actionLabel?: string;

  onAction?: () => void;

  onClose?: () => void;
};

export type PremiumToastState =
  PremiumToastOptions & {
    id: string;

    open: boolean;
  };

export type PremiumToastContextValue = {
  toast:
    | PremiumToastState
    | null;

  showToast: (
    options: PremiumToastOptions,
  ) => void;

  hideToast: () => void;
};