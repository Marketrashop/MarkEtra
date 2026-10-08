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
        gap-2.5
      "
    >
<CheckCircle2
    size={16}
    strokeWidth={2.5}
    fill="#5658EC"
    color="#FFFFFF"
    className="
        mt-[3px]
        shrink-0
    "
/>

      <span
        className="
          text-[15px]
          leading-[1.45]

          text-[var(--foreground)]
        "
      >
        {text}
      </span>
    </li>
  );
}