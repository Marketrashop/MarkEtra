"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  TESTIMONIALS_AUTOPLAY_DELAY,
  TESTIMONIALS_SLIDE_GAP,
} from "./testimonials.constants";
import { testimonials } from "./testimonials.data";
import TestimonialCard from "./TestimonialCard";
import TestimonialDialog from "./TestimonialDialog";
import { Testimonial } from "./testimonials.types";

export default function TestimonialsSlider() {
  const [selectedTestimonial, setSelectedTestimonial] =
    useState<Testimonial | null>(null);

  const autoplay = useRef(
    Autoplay({
      delay: TESTIMONIALS_AUTOPLAY_DELAY,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      align: "start",
      loop: true,
      skipSnaps: false,
      dragFree: false,
      duration: 20,
    },
    [autoplay.current]
  );

  const onMouseEnter = useCallback(() => {
    autoplay.current.stop();
  }, []);

  const onMouseLeave = useCallback(() => {
    autoplay.current.play();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;

    emblaApi.reInit();
  }, [emblaApi]);

  const openDialog = (
    testimonial: Testimonial
  ) => {
    autoplay.current.stop();
    setSelectedTestimonial(testimonial);
  };

const closeDialog = () => {
  setSelectedTestimonial(null);

  requestAnimationFrame(() => {
    autoplay.current.play();
  });
};

  return (
    <>
      <div
        className="overflow-hidden"
        ref={emblaRef}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="flex -mx-3">
          {testimonials.map((testimonial) => (
<div
  key={testimonial.id}
  className="
    min-w-0
    shrink-0

    basis-full

    md:basis-1/2

    xl:basis-1/3
  "
  style={{
    paddingInline:
      TESTIMONIALS_SLIDE_GAP / 2,
  }}
>
  <TestimonialCard
    testimonial={testimonial}
    onClick={() =>
      openDialog(testimonial)
    }
  />
</div>
          ))}
        </div>
      </div>

      <TestimonialDialog
        testimonial={selectedTestimonial}
        open={
          selectedTestimonial !== null
        }
        onClose={closeDialog}
      />
    </>
  );
}