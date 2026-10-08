"use client";

import Link from "next/link";

import {
  Clock3,
  Mail,
  Phone,
} from "lucide-react";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
} from "react-icons/fa6";

import {
  CONTACT_INTRO,
  CONTACT_METHODS,
  SOCIAL_LINKS,
} from "./contact.constants";

export default function ContactContent() {
  return (
    <section
      className="
        bg-[var(--background)]
        py-10
        transition-colors
        duration-300
        sm:py-20
        lg:py-24
      "
    >
      <div
        className="
          mx-auto
          grid
          max-w-7xl
          gap-8
          px-4
          sm:gap-16
          sm:px-5
          lg:grid-cols-[420px_1fr]
          lg:gap-20
          lg:px-8
        "
      >
        {/* Left Side */}

        <div>
          <h2
            className="
              text-2xl
              font-bold
              leading-tight
              text-[var(--foreground)]
              sm:text-4xl
            "
          >
            {CONTACT_INTRO.title}
          </h2>

          <p
            className="
              mt-3
              text-sm
              leading-6
              text-[var(--foreground-muted)]
              sm:mt-6
              sm:text-lg
              sm:leading-8
            "
          >
            {CONTACT_INTRO.description}
          </p>

          <div
            className="
              mt-7
              border-t
              border-[var(--border)]
              pt-5
              sm:mt-12
              sm:pt-8
            "
          >
            <div
              className="
                space-y-4
                sm:space-y-6
              "
            >
              {CONTACT_METHODS.map((item) => {
                const Icon =
                  item.title === "Phone"
                    ? Phone
                    : item.title === "Email"
                      ? Mail
                      : Clock3;

                return (
                  <Link
                    key={item.title}
                    href={item.href ?? "#"}
                    className="
                      flex
                      items-center
                      gap-3
                      text-[var(--foreground)]
                      transition-colors
                      duration-300
                      hover:text-[var(--primary)]
                      sm:gap-4
                    "
                  >
                    <Icon
                      className="
                        h-4
                        w-4
                        shrink-0
                        text-[var(--primary)]
                        sm:h-5
                        sm:w-5
                      "
                    />

                    <span
                      className="
                        text-sm
                        font-medium
                        sm:text-lg
                      "
                    >
                      {item.value}
                    </span>
                  </Link>
                );
              })}
            </div>

            <div
              className="
                mt-7
                border-t
                border-[var(--border)]
                pt-5
                sm:mt-10
                sm:pt-8
              "
            >
              <p
                className="
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-[var(--primary)]
                  sm:text-sm
                  sm:tracking-[0.16em]
                "
              >
                Follow Us
              </p>

              <div
                className="
                  mt-3
                  flex
                  items-center
                  gap-2.5
                  sm:mt-5
                  sm:gap-4
                "
              >
                {SOCIAL_LINKS.map((social) => {
                  const icons = {
                    Facebook: FaFacebookF,
                    Instagram: FaInstagram,
                    X: FaXTwitter,
                    LinkedIn: FaLinkedinIn,
                  };

                  const Icon =
                    icons[
                      social.name as keyof typeof icons
                    ];

                  return (
                    <Link
                      key={social.name}
                      href={social.href}
                      aria-label={social.name}
                      className="
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-full
                        border
                        border-[var(--border)]
                        bg-[var(--background)]
                        text-[var(--foreground)]
                        transition-all
                        duration-300
                        hover:border-[var(--primary)]
                        hover:bg-[var(--primary)]
                        hover:text-[var(--background)]
                        sm:h-11
                        sm:w-11
                      "
                    >
                      <Icon
                        className="
                          h-4
                          w-4
                          sm:h-5
                          sm:w-5
                        "
                      />
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side */}

        <form
          id="contact-form"
          className="
            rounded-2xl
            border
            border-[var(--border)]
            bg-[var(--surface)]
            p-4
            transition-colors
            duration-300
            sm:rounded-3xl
            sm:p-8
            lg:p-10
          "
        >
          <div
            className="
              space-y-4
              pb-4
              sm:space-y-6
              sm:pb-16
            "
          >
            <div>
              <label
                htmlFor="fullName"
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-[var(--foreground)]
                  sm:mb-2
                "
              >
                Full Name
              </label>

              <input
                id="fullName"
                type="text"
                placeholder="Your Name"
                className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  border-[var(--border)]
                  bg-[var(--background)]
                  px-3
                  text-sm
                  text-[var(--foreground)]
                  outline-none
                  transition-all
                  duration-300
                  focus:border-[var(--primary)]
                  sm:h-auto
                  sm:rounded-xl
                  sm:px-5
                  sm:py-4
                "
              />
            </div>

            <div>
              <label
                htmlFor="email"
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-[var(--foreground)]
                  sm:mb-2
                "
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  border-[var(--border)]
                  bg-[var(--background)]
                  px-3
                  text-sm
                  text-[var(--foreground)]
                  outline-none
                  transition-all
                  duration-300
                  focus:border-[var(--primary)]
                  sm:h-auto
                  sm:rounded-xl
                  sm:px-5
                  sm:py-4
                "
              />
            </div>

            <div>
              <label
                htmlFor="subject"
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-[var(--foreground)]
                  sm:mb-2
                "
              >
                Subject
              </label>

              <input
                id="subject"
                type="text"
                placeholder="How can we help?"
                className="
                  h-10
                  w-full
                  rounded-lg
                  border
                  border-[var(--border)]
                  bg-[var(--background)]
                  px-3
                  text-sm
                  text-[var(--foreground)]
                  outline-none
                  transition-all
                  duration-300
                  focus:border-[var(--primary)]
                  sm:h-auto
                  sm:rounded-xl
                  sm:px-5
                  sm:py-4
                "
              />
            </div>

            <div>
              <label
                htmlFor="message"
                className="
                  mb-1.5
                  block
                  text-sm
                  font-medium
                  text-[var(--foreground)]
                  sm:mb-2
                "
              >
                Message
              </label>

              <textarea
                id="message"
                rows={5}
                placeholder="Tell us about your inquiry..."
                className="
                  min-h-[120px]
                  w-full
                  resize-none
                  rounded-lg
                  border
                  border-[var(--border)]
                  bg-[var(--background)]
                  px-3
                  py-2.5
                  text-sm
                  text-[var(--foreground)]
                  outline-none
                  transition-all
                  duration-300
                  focus:border-[var(--primary)]
                  sm:min-h-0
                  sm:rounded-xl
                  sm:px-5
                  sm:py-4
                "
              />
            </div>

<button
  type="submit"
  className="
    inline-flex
    h-10
    w-full
    items-center
    justify-center
    rounded-lg
    bg-[var(--primary-contact)]
    px-5
    text-sm
    font-semibold
    text-[var(--contact-button-text)]
    transition-all
    duration-300
    hover:opacity-90
    sm:h-auto
    sm:rounded-xl
    sm:px-8
    sm:py-4
  "
>
  Send Message
</button>
          </div>
        </form>
      </div>
    </section>
  );
}