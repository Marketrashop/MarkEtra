import type {
  ProductCard,
} from "@/lib/products";

export type AppSearchProps = {};

export type AppSearchHeaderProps = {
  onClose: () => void;
};

export type AppSearchInputProps = {
  value: string;

  onChange: (
    value: string,
  ) => void;

  autoFocus?: boolean;

  placeholder?: string;
};

export type AppSearchResultProps = {
  product: ProductCard;

  onSelect: () => void;

  showDivider?: boolean;
};

export type AppSearchResultsProps = {
  loading: boolean;

  query: string;

  results: ProductCard[];

  onSelect: () => void;
};

export type AppSearchPopularProps = {
  searches: string[];

  onSelect: (
    value: string,
  ) => void;
};

export type AppSearchLoadingProps = {
  rows?: number;
};

export type AppSearchEmptyProps = {
  query: string;
};

export type AppSearchBackdropProps = {
  onClose: () => void;
};