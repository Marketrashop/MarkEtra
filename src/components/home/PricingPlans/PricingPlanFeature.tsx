
import { CheckCircle2 } from "lucide-react";

type PricingPlanFeatureProps = {
  text: string;
};

export default function PricingPlanFeature({
  text,
}: PricingPlanFeatureProps) {
  return (
    <li
      className="
        flex
        items-start
        gap-2

        sm:gap-2.5
      "
    >
      <CheckCircle2
        size={16}
        strokeWidth={2.5}
        fill="#5658EC"
        color="#FFFFFF"
        className="
          mt-[2px]
          shrink-0

          sm:mt-[3px]
        "
      />

      <span
        className="
          text-[13px]
          leading-[1.4]
          text-[var(--foreground)]

          sm:text-[15px]
          sm:leading-[1.45]
        "
      >
        {text}
      </span>
    </li>
  );
}
