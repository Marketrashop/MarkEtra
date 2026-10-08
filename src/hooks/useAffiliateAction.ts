"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import useExperience from "@/components/ui/ExperienceOverlay/useExperience";
import { useAuth } from "@/context/AuthContext";
import { useCurrentSubscription } from "@/hooks/useCurrentSubscription";
import { submitAffiliateProduct } from "@/services/affiliate-api.service";

type UseAffiliateActionResult = {
  execute: (
    productId: string,
  ) => Promise<void>;

  loading: boolean;

  hasActiveSubscription: boolean;
};

export function useAffiliateAction(): UseAffiliateActionResult {
const router =
  useRouter();

const {
  showExperience,
} = useExperience();

  const {
    user,
    loading: authLoading,
  } = useAuth();

  const {
    subscription,
    refresh:
      refreshSubscription,
  } = useCurrentSubscription();

  const [
    loading,
    setLoading,
  ] = useState(false);

  const hasActiveSubscription =
    Boolean(
      subscription &&
        subscription.status ===
          "ACTIVE",
    );

  const execute =
    useCallback(
      async (
        productId: string,
      ) => {
        if (loading) {
          return;
        }

        if (!productId) {
          toast.error(
            "Unable to identify this product.",
          );

          return;
        }

        if (authLoading) {
          toast.info(
            "Checking your account. Please wait a moment.",
          );

          return;
        }

        if (!user) {
          toast.info(
            "Please sign in to submit this product.",
          );

          const params =
            new URLSearchParams({
              redirect:
                "/affiliate",

              affiliateProduct:
                productId,
            });

          router.push(
            `/Auth?${params.toString()}`,
          );

          return;
        }

        try {
          setLoading(true);

          const currentSubscription =
            await refreshSubscription();

          if (
            !currentSubscription ||
            currentSubscription.status !==
              "ACTIVE"
          ) {
            toast.info(
              "You need an active subscription plan to become an affiliate.",
            );

            router.push(
              "/plans",
            );

            return;
          }

          await submitAffiliateProduct(
            productId,
          );

showExperience({
  title:
    "Affiliate Request Submitted",
  description:
    "Your product has been submitted successfully and is now awaiting admin review. You'll be notified once a decision has been made.",
  status: "success",
  onComplete: () => {
    router.push(
      "/affiliate",
    );
  },
});
        } catch (error) {
          toast.error(
            error instanceof Error
              ? error.message
              : "Unable to submit this product for review.",
          );
        } finally {
          setLoading(false);
        }
      },
      [
        loading,
        authLoading,
        user,
        refreshSubscription,
        router,
      ],
    );

  return {
    execute,

    loading,

    hasActiveSubscription,
  };
}