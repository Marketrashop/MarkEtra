"use client";

import { useRef, useState } from "react";

import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { AuthLayout, AuthTabs, LoginForm, RegisterForm } from "@/components/auth";
import type { RegisterFormValues } from "@/components/auth/RegisterForm";
import { useAuth } from "@/context/AuthContext";
import { useCartContext } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { submitAffiliateProduct } from "@/services/affiliate-api.service";
import useExperience from "@/components/ui/ExperienceOverlay/useExperience";

type LoginSuccessResponse = {
  success: true;

  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: "USER" | "ADMIN";
    status: string;
  };
};

type LoginErrorResponse = {
  success: false;

  error?: string;

  code?: string;

  email?: string;
};

type LoginResponse =
  | LoginSuccessResponse
  | LoginErrorResponse;

export default function AuthPageClient() {
  const router =
    useRouter();

const {
  refresh: refreshAuth,
} = useAuth();

const {
  showExperience,
} = useExperience();

const {
  addToWishlist,
} = useWishlist();

  const searchParams =
    useSearchParams();

  const redirect =
    searchParams.get(
      "redirect",
    );

  const wishlistProduct =
    searchParams.get(
      "wishlistProduct",
    );

const affiliateProduct =
  searchParams.get(
    "affiliateProduct",
  );

const buyNowProduct =
  searchParams.get(
    "buyNowProduct",
  );

const buyNowVariantSizeId =
  searchParams.get(
    "buyNowVariantSizeId",
  );

const buyNowQuantity =
  Number(
    searchParams.get(
      "buyNowQuantity",
    ) ?? "1",
  );

const {
  addToCart,
  openCart,
} = useCartContext();

  const [
    mode,
    setMode,
  ] = useState<
    "login" | "register"
  >("login");

const [
  loading,
  setLoading,
] = useState(false);

const [
  loadingText,
  setLoadingText,
] = useState(
  "Creating account...",
);

const keepLoadingRef =
  useRef(false);

  async function submitAffiliateProductAfterLogin(
    productId: string,
  ) {
    const subscriptionResponse =
      await fetch(
        "/api/subscriptions/current",
        {
          credentials:
            "include",

          cache:
            "no-store",
        },
      );

    const subscriptionData =
      await subscriptionResponse.json();

    if (
      !subscriptionResponse.ok
    ) {
      throw new Error(
        subscriptionData.error ??
          "Unable to verify your subscription.",
      );
    }

    if (
      !subscriptionData.subscription ||
      subscriptionData.subscription.status !==
        "ACTIVE"
    ) {
      toast.info(
        "You need an active subscription plan to become an affiliate.",
      );

router.push("/plans");

      return false;
    }

    await submitAffiliateProduct(
      productId,
    );

    toast.success(
      "Product submitted for admin review.",
    );

router.push("/affiliate");

    return true;
  }

  async function handleLogin(
    values: {
      email: string;
      password: string;
      rememberMe: boolean;
    },
  ) {
    try {
      setLoading(
        true,
      );

setLoadingText(
  "Signing in...",
);

keepLoadingRef.current =
  false;

      const response =
        await fetch(
          "/api/auth/login",
          {
            method:
              "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(
                values,
              ),
          },
        );

      const data =
        (await response.json()) as LoginResponse;

      if (!response.ok) {
        if (
          data.success ===
            false &&
          data.code ===
            "EMAIL_NOT_VERIFIED"
        ) {
          if (data.email) {
router.replace(
  `/verify-email?email=${encodeURIComponent(
    data.email,
  )}`,
);
          }

          return;
        }

        toast.error(
          data.success ===
            false &&
            data.error
            ? data.error
            : "Unable to sign in",
        );

        return;
      }

      if (
        data.success !==
          true ||
        !data.user
      ) {
        toast.error(
          "Unable to sign in. Please try again.",
        );

        return;
      }

      void refreshAuth();

      router.prefetch("/Dashboard");
      router.prefetch("/admin");
      router.prefetch("/checkout");
      router.prefetch("/wishlist");

if (
  buyNowProduct &&
  buyNowVariantSizeId &&
  data.user.role !== "ADMIN"
) {
  try {
    await addToCart({
      productId:
        buyNowProduct,

      variantSizeId:
        buyNowVariantSizeId,

      quantity:
        buyNowQuantity,
    });

router.push("/checkout");
  } catch (error) {
    toast.error(
      error instanceof Error
        ? error.message
        : "Unable to continue to checkout.",
    );
  }

  return;
}

      const wantsCart =
        redirect ===
        "/checkout";

      if (wantsCart) {
        openCart();

router.push("/Dashboard");

        return;
      }

      if (
        affiliateProduct &&
        data.user.role !==
          "ADMIN"
      ) {
        try {
          await submitAffiliateProductAfterLogin(
            affiliateProduct,
          );
        } catch (
          error
        ) {
          console.error(
            "Affiliate submission after login failed:",
            error,
          );

          toast.error(
            error instanceof
              Error
              ? error.message
              : "Unable to submit this product for review.",
          );
        }

        return;
      }

if (
  wishlistProduct &&
  data.user.role !==
    "ADMIN"
) {
  try {
    await addToWishlist(
      wishlistProduct,
    );

    toast.success(
      "Product saved to wishlist.",
    );
  } catch (error) {
    console.error(
      "Wishlist save after login failed:",
      error,
    );

    toast.error(
      error instanceof Error
        ? error.message
        : "Unable to save product to wishlist.",
    );
  }
}

      const destination =
        data.user.role ===
        "ADMIN"
          ? "/admin"
          : wishlistProduct
            ? "/wishlist"
            : redirect ??
              "/Dashboard";

setLoadingText(
  "Please wait...",
);

keepLoadingRef.current =
  true;

toast.success(
  "Signed in successfully",
);

router.push(destination);

return;
} catch (
  error
) {
  console.error(
    "Login request error:",
    error,
  );

  toast.error(
    "Unable to sign in. Please try again.",
  );
} finally {
  if (
    !keepLoadingRef.current
  ) {
    setLoading(
      false,
    );
  }
}
  }

async function handleRegister(
  values: RegisterFormValues,
) {
  try {
    setLoading(
      true,
    );

    setLoadingText(
      "Creating account...",
    );

    keepLoadingRef.current =
      false;

    const registerResponse =
      await fetch(
        "/api/auth/register",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              firstName:
                values.firstName,

              lastName:
                values.lastName,

              email:
                values.email,

              phoneNumber:
                values.phoneNumber,

              country:
                values.country,

              password:
                values.password,

              confirmPassword:
                values.confirmPassword,

              heardFrom:
                values.heardFrom,

              acceptedTerms:
                values.acceptedTerms,
            }),
        },
      );

    const registerData: unknown =
      await registerResponse.json();

    if (
      typeof registerData !==
        "object" ||
      registerData === null
    ) {
      toast.error(
        "Unable to create your account. Please try again.",
      );

      return;
    }

    if (!registerResponse.ok) {
      const errorMessage =
        "error" in registerData &&
        typeof registerData.error ===
          "string"
          ? registerData.error
          : "Unable to create your account. Please try again.";

      toast.error(
        errorMessage,
      );

      return;
    }

    const loginResponse =
      await fetch(
        "/api/auth/login",
        {
          method:
            "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify({
              email:
                values.email,

              password:
                values.password,

              rememberMe: true,
            }),
        },
      );

    const loginData =
      (await loginResponse.json()) as LoginResponse;

    if (
      !loginResponse.ok ||
      loginData.success !==
        true
    ) {
      toast.success(
        "Account created successfully. Please sign in.",
      );

      setMode(
        "login",
      );

      return;
    }

void refreshAuth();

const destination =
  loginData.user.role ===
  "ADMIN"
    ? "/admin"
    : "/Dashboard";

router.prefetch(
  destination,
);

setLoadingText(
  "Preparing your dashboard...",
);

keepLoadingRef.current =
  true;
showExperience({
  title: `Welcome, ${values.firstName}!`,
  description:
    "Your account is ready. Enjoy a seamless experience on MarkEtra.",
  status:
    "Preparing your experience...",
onComplete: () => {
  keepLoadingRef.current =
    false;

  router.replace(
    destination,
  );
},
});

return;
  } catch (
    error
  ) {
    console.error(
      "Registration request error:",
      error,
    );

    toast.error(
      "Unable to create your account. Please try again.",
    );
} finally {
  if (
    !keepLoadingRef.current
  ) {
    setLoading(
      false,
    );
  }
}
}

  function handleModeChange(
    nextMode:
      | "login"
      | "register",
  ) {
    if (loading) {
      return;
    }

    setMode(
      nextMode,
    );
  }

return (
  <AuthLayout>
<Link
  href="/"
  aria-label="Return to home"
  className="
    group

    absolute
    left-4
    top-4
    z-20

    inline-flex
    items-center
    gap-1.5

    rounded-full

    border-[2.5px]
    border-[var(--border)]

    bg-[var(--auth-card-bg)]

    px-3
    py-1.5

    text-xs
    font-medium
    text-[var(--foreground)]

    shadow-[0_5px_16px_rgba(0,0,0,0.05)]

    backdrop-blur-xl

    transition-all
    duration-200

    hover:-translate-y-0.5
    hover:border-[var(--primary)]
    hover:shadow-[0_7px_20px_rgba(0,0,0,0.08)]

    active:translate-y-0
    active:scale-[0.98]

    sm:left-6
    sm:top-6
  "
>
  <ArrowLeft
    size={14}
    strokeWidth={2.5}
    className="
      transition-transform
      duration-200
      group-hover:-translate-x-0.5
    "
  />

  <span>Home</span>
</Link>

    <AnimatePresence
      mode="wait"
    >
      <motion.div
        key={mode}
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: -18,
        }}
        transition={{
          duration: 0.25,
        }}
      >
        {mode ===
        "login" ? (
<LoginForm
  loading={
    loading
  }
  loadingText={
    loadingText
  }
            onSubmit={
              handleLogin
            }
            onRegister={() =>
              handleModeChange(
                "register",
              )
            }
          />
        ) : (
<RegisterForm
  loading={
    loading
  }
  loadingText={
    loadingText
  }
            onSubmit={
              handleRegister
            }
            onSignIn={() =>
              handleModeChange(
                "login",
              )
            }
          />
        )}
      </motion.div>
    </AnimatePresence>
  </AuthLayout>
);
}