import NavigationLink from "@/components/ui/Preloader/NavigationLink";

import { LucideIcon } from "lucide-react";

type DashboardStatCardProps = {
  title: string;
  value: string;
  icon: LucideIcon;
  href?: string;
};

export default function DashboardStatCard({
  title,
  value,
  icon: Icon,
  href,
}: DashboardStatCardProps) {
  const className = `
    group
    relative
    flex
    h-[92px]
    items-center
    overflow-hidden
    rounded-lg
    border
    border-[var(--dashboard-card-border)]
    bg-[var(--dashboard-card)]
    px-3
    shadow-[0_10px_30px_rgba(0,0,0,.08)]
    transition-all
    duration-300
    hover:-translate-y-[3px]
    hover:border-[color-mix(in_srgb,var(--dashboard-card-border)_70%,var(--primary)_30%)]
    hover:shadow-[0_18px_45px_rgba(91,92,240,.16)]
    sm:h-[122px]
    sm:rounded-2xl
    sm:px-5
  `;

  const content = (
    <>
      <span
        className="
          pointer-events-none
          absolute
          right-[-20px]
          top-1/2
          h-24
          w-24
          -translate-y-1/2
          rounded-full
          bg-[var(--dashboard-card-glow)]
          opacity-70
          blur-[55px]
          transition-opacity
          duration-300
          group-hover:opacity-100
          sm:right-[-24px]
          sm:h-32
          sm:w-32
          sm:blur-[75px]
        "
      />

      <div
        className="
          relative
          flex
          h-8
          w-8
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[#5b5cf0]
          text-white
          sm:h-10
          sm:w-10
        "
      >
        <Icon
          size={16}
          strokeWidth={2.2}
          className="
            h-4
            w-4
            text-white
            sm:h-5
            sm:w-5
          "
        />
      </div>

      <div
        className="
          w-[calc(100%-44px)]
          pl-2.5
          text-left
          sm:w-[calc(100%-60px)]
          sm:pl-[15px]
        "
      >
        <h5
          className="
            mb-1.5
            truncate
            text-[13px]
            font-semibold
            leading-none
            text-[var(--foreground)]
            sm:mb-[10px]
            sm:text-[17px]
          "
        >
          {title}
        </h5>

        <p
          className="
            truncate
            text-[11px]
            leading-none
            text-[var(--foreground-muted)]
            sm:text-[14px]
          "
        >
          {value}
        </p>
      </div>
    </>
  );

  if (href) {
    return (
      <NavigationLink
        href={href}
        className={className}
      >
        {content}
      </NavigationLink>
    );
  }

  return (
    <div
      className={className}
    >
      {content}
    </div>
  );
}