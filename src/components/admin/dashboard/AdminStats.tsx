"use client";

import {
  Boxes,
  PackageCheck,
  ShoppingCart,
  Users,
} from "lucide-react";

import AdminStatCard from "./AdminStatCard";

type AdminStatsProps = {
  users: number;
  products: number;
  affiliateProducts: number;
  orders: number;
};

export default function AdminStats({
  users,
  products,
  affiliateProducts,
  orders,
}: AdminStatsProps) {
  return (
    <section
      className="
        grid
        grid-cols-1
        gap-1.5
        sm:grid-cols-2
        sm:gap-[var(--admin-page-gap)]
        xl:grid-cols-4
      "
    >
      <AdminStatCard
        title="Users"
        value={users}
        subtitle="Registered users"
        icon={
          <Users
            size={18}
            strokeWidth={2}
          />
        }
        href="/admin/users"
      />

      <AdminStatCard
        title="Products"
        value={products}
        subtitle="Published products"
        icon={
          <PackageCheck
            size={18}
            strokeWidth={2}
          />
        }
        href="/admin/products"
      />

      <AdminStatCard
        title="Affiliate Products"
        value={affiliateProducts}
        subtitle="Approved listings"
        icon={
          <Boxes
            size={18}
            strokeWidth={2}
          />
        }
        href="/admin/affiliate"
      />

      <AdminStatCard
        title="Orders"
        value={orders}
        subtitle="Completed orders"
        icon={
          <ShoppingCart
            size={18}
            strokeWidth={2}
          />
        }
        href="/admin/orders"
      />
    </section>
  );
}