"use client";

import { FAQ_ITEM_GAP } from "./faq.constants";
import FAQItem from "./FAQItem";
import { FAQItem as FAQItemType } from "./faq.types";

type FAQAccordionProps = {
  items: FAQItemType[];
};

export default function FAQAccordion({
  items,
}: FAQAccordionProps) {
  return (
    <div className={FAQ_ITEM_GAP}>
      {items.map((item) => (
        <FAQItem
          key={item.id}
          item={item}
        />
      ))}
    </div>
  );
}