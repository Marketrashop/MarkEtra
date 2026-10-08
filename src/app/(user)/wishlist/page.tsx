import DashboardPageLayout from "@/components/dashboard/DashboardPage";
import { WishlistPage } from "@/components/Wishlist";

export default function Page() {
  return (
    <DashboardPageLayout
      environment="user"
      breadcrumb={[
        {
          label: "Wishlist",
        },
      ]}
    >
      <WishlistPage />
    </DashboardPageLayout>
  );
}