"use client";

import { Send } from "lucide-react";

export default function NewsletterForm() {
  return (
    <div
      className="
        w-full

        lg:pl-8
      "
    >
      <form
        className="
          relative

          mx-auto
          w-full
          max-w-[470px]
        "
      >
        <input
          type="email"
          placeholder="Enter your mail..."
          className="
            h-14
            w-full

            rounded-[10px]

            border
            border-white/10

            bg-[#5658EC1A]

            px-5
            pr-20

            text-[15px]
            font-medium
            text-white

            outline-none

            placeholder:text-white

            transition-all
            duration-300

            focus:border-[#5658EC]
          "
        />

        <button
          type="submit"
          className="
            absolute
            right-[6px]
            top-[6px]

            flex
            h-[44px]
            w-[48px]
            items-center
            justify-center

            rounded-[8px]

            bg-[#5658EC]

            text-white

            transition-all
            duration-300

            hover:bg-[#4A4CDB]
          "
        >
          <Send
            size={18}
            fill="currentColor"
            strokeWidth={1.8}
          />
        </button>
      </form>
    </div>
  );
}