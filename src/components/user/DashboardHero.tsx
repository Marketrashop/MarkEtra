"use client";

import NavigationLink from "@/components/ui/Preloader/NavigationLink";
import { Wallet } from "lucide-react";
import { useEffect, useState } from "react";

type DashboardHeroProps = {
  firstName: string;
};

const blueSlides = [
  "/assets/images/dashboard/mark-etra-hero-blue-1.png",
  "/assets/images/dashboard/mark-etra-hero-blue-2.png",
  "/assets/images/dashboard/mark-etra-hero-blue-3.png",
];

const lightSlides = [
  "/assets/images/dashboard/mark-etra-hero-light-1.png",
  "/assets/images/dashboard/mark-etra-hero-light-2.png",
  "/assets/images/dashboard/mark-etra-hero-light-3.png",
];

export default function DashboardHero({
  firstName,
}: DashboardHeroProps) {
  const [activeSlide, setActiveSlide] = useState(0);
  const [isBlueTheme, setIsBlueTheme] = useState(true);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const root = document.documentElement;

    const syncTheme = () => {
      setIsBlueTheme(root.getAttribute("data-theme") === "blue");
    };

    syncTheme();

    const observer = new MutationObserver(syncTheme);
    observer.observe(root, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });

    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const syncMotion = () => setReduceMotion(motionQuery.matches);
    syncMotion();
    motionQuery.addEventListener("change", syncMotion);

    return () => {
      observer.disconnect();
      motionQuery.removeEventListener("change", syncMotion);
    };
  }, []);

  const slides = isBlueTheme ? blueSlides : lightSlides;

  useEffect(() => {
    setActiveSlide(0);
  }, [isBlueTheme]);

  useEffect(() => {
    if (reduceMotion) return;

    const interval = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length);
    }, 4000);

    return () => window.clearInterval(interval);
  }, [slides.length, reduceMotion, isBlueTheme]);

  return (
    <section
      aria-labelledby="dashboard-hero-title"
      className="dashboard-hero"
    >
      <div className="dashboard-hero__slides" aria-hidden="true">
        {slides.map((src, index) => (
          <div
            key={src}
            className={`dashboard-hero__slide ${
              index === activeSlide ? "is-active" : ""
            }`}
            style={{ backgroundImage: `url("${src}")` }}
          />
        ))}
      </div>

      <div className="dashboard-hero__content">
        <span className="dashboard-hero__eyebrow">
          YOUR ACCOUNT
        </span>

        <h1
          id="dashboard-hero-title"
          className="dashboard-hero__title"
        >
          Welcome back, {firstName} 👋
        </h1>

        <p className="dashboard-hero__description">
          Shop smarter. Everything you want,
          all in one place.
        </p>

        <NavigationLink
          href="/wallet"
          className="dashboard-hero__button"
        >
          <Wallet size={18} strokeWidth={2} aria-hidden="true" />
          <span>My Shopping Wallet</span>
        </NavigationLink>
      </div>

      <div
        className="dashboard-hero__indicators"
        aria-label={`Slide ${activeSlide + 1} of ${slides.length}`}
      >
        {slides.map((src, index) => (
          <button
            key={src}
            type="button"
            className={`dashboard-hero__indicator ${
              index === activeSlide ? "is-active" : ""
            }`}
            aria-label={`Show slide ${index + 1}`}
            aria-current={index === activeSlide ? "true" : undefined}
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </section>
  );
}
