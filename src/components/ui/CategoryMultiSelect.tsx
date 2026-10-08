"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Check,
  ChevronDown,
  Search,
  X,
} from "lucide-react";

type Option = {
  id: string;
  name: string;
};

type CategoryMultiSelectProps = {
  options: Option[];
  value: string[];
  onChange: (
    value: string[],
  ) => void;
  placeholder?: string;
};

export default function CategoryMultiSelect({
  options,
  value,
  onChange,
  placeholder = "Select categories",
}: CategoryMultiSelectProps) {
  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    search,
    setSearch,
  ] = useState("");

  const containerRef =
    useRef<HTMLDivElement>(
      null,
    );

  const inputRef =
    useRef<HTMLInputElement>(
      null,
    );

  useEffect(() => {
    function handleClickOutside(
      event: MouseEvent,
    ) {
      if (
        containerRef.current &&
        !containerRef.current.contains(
          event.target as Node,
        )
      ) {
        setOpen(false);
        setSearch("");
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
  }, []);

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        inputRef.current?.focus();
      });
    }
  }, [open]);

  function toggleCategory(
    id: string,
  ) {
    if (
      value.includes(id)
    ) {
      onChange(
        value.filter(
          (item) =>
            item !== id,
        ),
      );

      return;
    }

    onChange([
      ...value,
      id,
    ]);
  }

  const selectedOptions =
    options.filter(
      (option) =>
        value.includes(
          option.id,
        ),
    );

  const filteredOptions =
    useMemo(
      () =>
        options.filter(
          (option) =>
            option.name
              .toLowerCase()
              .includes(
                search.toLowerCase(),
              ),
        ),
      [
        options,
        search,
      ],
    );

  return (
    <div
      ref={containerRef}
      className="relative"
    >
      <div
        role="button"
        tabIndex={0}
        onClick={() =>
          setOpen(
            (value) =>
              !value,
          )
        }
        onKeyDown={(
          event,
        ) => {
          if (
            event.key ===
              "Enter" ||
            event.key ===
              " "
          ) {
            event.preventDefault();
            setOpen(
              (value) =>
                !value,
            );
          }

          if (
            event.key ===
            "Escape"
          ) {
            setOpen(false);
            setSearch("");
          }
        }}
        className="
          flex
          min-h-11
          w-full
          cursor-pointer
          flex-wrap
          items-center
          gap-2
          rounded-[var(--admin-input-radius)]
          border
          border-[var(--admin-input-border)]
          bg-[var(--admin-input-bg)]
          px-3
          py-2
        "
      >
        {selectedOptions.length ===
        0 ? (
          <span
            className="
              text-sm
              text-[var(--admin-muted)]
            "
          >
            {placeholder}
          </span>
        ) : (
          selectedOptions.map(
            (
              option,
            ) => (
              <span
                key={
                  option.id
                }
                className="
                  inline-flex
                  items-center
                  gap-1
                  rounded-full
                  bg-[var(--admin-card-bg)]
                  px-3
                  py-1
                  text-xs
                  font-medium
                "
              >
                {
                  option.name
                }

                <span
                  role="button"
                  tabIndex={0}
                  onClick={(
                    event,
                  ) => {
                    event.stopPropagation();

                    toggleCategory(
                      option.id,
                    );
                  }}
                  onKeyDown={(
                    event,
                  ) => {
                    if (
                      event.key ===
                        "Enter" ||
                      event.key ===
                        " "
                    ) {
                      event.preventDefault();

                      toggleCategory(
                        option.id,
                      );
                    }
                  }}
                  className="
                    cursor-pointer
                    rounded-full
                    p-0.5
                    hover:bg-black/10
                  "
                >
                  <X
                    size={14}
                  />
                </span>
              </span>
            ),
          )
        )}

        <ChevronDown
          size={18}
          className="
            ml-auto
            shrink-0
            text-[var(--admin-muted)]
          "
        />
      </div>

      {open && (
        <div
          className="
            absolute
            z-50
            mt-2
            w-full
            overflow-hidden
            rounded-[var(--admin-input-radius)]
            border
            border-[var(--admin-input-border)]
            bg-[var(--admin-card-bg)]
            shadow-xl
          "
        >
          <div className="border-b border-[var(--admin-input-border)] p-3">
            <div className="relative">
              <Search
                size={16}
                className="
                  absolute
                  left-3
                  top-1/2
                  -translate-y-1/2
                  text-[var(--admin-muted)]
                "
              />

              <input
                ref={
                  inputRef
                }
                type="text"
                value={
                  search
                }
                onClick={(
                  event,
                ) =>
                  event.stopPropagation()
                }
                onChange={(
                  event,
                ) =>
                  setSearch(
                    event.target
                      .value,
                  )
                }
                placeholder="Search categories..."
                className="
                  h-10
                  w-full
                  rounded-md
                  border
                  border-[var(--admin-input-border)]
                  bg-[var(--admin-input-bg)]
                  pl-10
                  pr-3
                  text-sm
                  outline-none
                "
              />
            </div>
          </div>

          <div className="max-h-72 overflow-y-auto">
            {filteredOptions.length >
            0 ? (
              filteredOptions.map(
                (
                  option,
                ) => {
                  const selected =
                    value.includes(
                      option.id,
                    );

                  return (
                    <button
                      key={
                        option.id
                      }
                      type="button"
                      onClick={() =>
                        toggleCategory(
                          option.id,
                        )
                      }
                      className="
                        flex
                        w-full
                        items-center
                        justify-between
                        px-4
                        py-3
                        text-left
                        text-sm
                        hover:bg-[var(--admin-hover-bg)]
                      "
                    >
                      <span>
                        {
                          option.name
                        }
                      </span>

                      {selected && (
                        <Check
                          size={
                            18
                          }
                        />
                      )}
                    </button>
                  );
                },
              )
            ) : (
              <div
                className="
                  px-4
                  py-6
                  text-center
                  text-sm
                  text-[var(--admin-muted)]
                "
              >
                No categories found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}