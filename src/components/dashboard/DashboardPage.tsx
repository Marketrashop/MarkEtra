"use client";

import type { ReactNode } from "react";

import DashboardBreadcrumb from "./DashboardBreadcrumb";
import DashboardContainer from "./DashboardContainer";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type DashboardPageProps = {
  children: ReactNode;

  environment: "user" | "admin";

  breadcrumb?: BreadcrumbItem[];

  className?: string;

  containerClassName?: string;
};

export default function DashboardPage({
  children,
  environment,
  breadcrumb = [],
  className,
  containerClassName,
}: DashboardPageProps) {
  return (
    <>
      <DashboardBreadcrumb
        environment={environment}
        items={breadcrumb}
        className={className}
      />

      <DashboardContainer
        className={containerClassName}
      >
        {children}
      </DashboardContainer>
    </>
  );
}