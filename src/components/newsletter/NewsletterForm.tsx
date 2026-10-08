"use client";

import {
  useState,
  FormEvent,
} from "react";

import {
  ArrowRight,
  X,
} from "lucide-react";

type NewsletterFormProps = {
  onClose: () => void;

  onSubscribe: (
    email: string,
    dontShowAgain: boolean,
  ) => void | Promise<void>;
};

export default function NewsletterForm({
  onClose,
  onSubscribe,
}: NewsletterFormProps) {
  const [
    email,
    setEmail,
  ] = useState("");

  const [
    dontShowAgain,
    setDontShowAgain,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(false);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setLoading(true);

    await new Promise(
      (resolve) =>
        setTimeout(resolve, 700),
    );

    await onSubscribe(
      email.trim(),
      dontShowAgain,
    );

    setLoading(false);

    setEmail("");
  }

  return (
    <div
      className="
        relative
        flex
        flex-1
        flex-col
        justify-center
        bg-[var(--newsletter-bg)]

        p-5
        sm:p-6
        lg:p-8
      "
    >
      <button
        type="button"
        onClick={onClose}
        className="
          absolute
          right-4
          top-4
          flex
          h-10
          w-10
          items-center
          justify-center
          rounded-full
          bg-[var(--newsletter-close-bg)]
          transition-colors
          hover:bg-[var(--newsletter-close-hover)]
        "
      >
        <X
          size={18}
          className="
            text-[var(--newsletter-close-icon)]
          "
        />
      </button>

      <h2
        className="
          text-3xl
          font-bold
          leading-tight
          text-[var(--newsletter-title)]

          sm:text-[2rem]
          lg:text-[2.25rem]
        "
      >
        Newsletter
      </h2>

      <p
        className="
          mt-2
          text-[15px]
          leading-6
          text-[var(--newsletter-text)]
        "
      >
        Subscribe to our newsletter.
      </p>

      <form
        onSubmit={handleSubmit}
        className="
          mt-6
          space-y-4
        "
      >
        <input
          type="email"
          required
          value={email}
          onChange={(event) =>
            setEmail(
              event.target.value,
            )
          }
          placeholder="Email Address"
          className="
            h-12
            w-full
            rounded-xl
            border
            border-[var(--newsletter-input-border)]
            bg-[var(--newsletter-input-bg)]
            px-5
            text-[15px]
            text-[var(--newsletter-title)]
            outline-none
            transition-colors
            placeholder:text-[var(--newsletter-placeholder)]
            focus:border-[var(--newsletter-input-focus)]
          "
        />

        <button
          type="submit"
          disabled={loading}
          className="
            flex
            h-12
            w-full
            items-center
            justify-center
            gap-2
            rounded-xl
            bg-[var(--newsletter-button-bg)]
            text-[15px]
            font-semibold
            text-[var(--newsletter-button-text)]
            transition-colors
            hover:bg-[var(--newsletter-button-hover)]
            disabled:cursor-not-allowed
            disabled:opacity-70
          "
        >
          {loading ? (
            "Subscribing..."
          ) : (
            <>
              Subscribe

              <ArrowRight
                size={18}
              />
            </>
          )}
        </button>

        <label
          className="
            flex
            cursor-pointer
            items-center
            gap-2.5
            text-sm
            leading-5
            text-[var(--newsletter-text)]
        "
        >
          <input
            type="checkbox"
            checked={
              dontShowAgain
            }
            onChange={(
              event,
            ) =>
              setDontShowAgain(
                event.target.checked,
              )
            }
            className="
              h-4
              w-4
              shrink-0
              accent-[var(--newsletter-checkbox)]
            "
          />

          Don't show this popup again.
        </label>
      </form>
    </div>
  );
}