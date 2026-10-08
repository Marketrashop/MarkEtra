"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import { toast } from "sonner";

import type {
  CreatePlanInput,
  SubscriptionPlan,
} from "@/types/plan.types";

import {
  createPlan,
  deletePlan,
  getPlans,
  updatePlan,
} from "@/services/plan.service";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";
import { AdminPageHeader } from "@/components/admin";

import PlanTable from "./PlanTable";
import Button from "@/components/ui/Button";

import CreatePlanDialog from "./CreatePlanDialog";
import EditPlanDialog from "./EditPlanDialog";
import ViewPlanDialog from "./ViewPlanDialog";
import DeletePlanDialog from "./DeletePlanDialog";

type DialogType =
  | null
  | "create"
  | "view"
  | "edit"
  | "delete";

function sortPlans(
  plans: SubscriptionPlan[],
) {
  return [...plans].sort(
    (a, b) =>
      a.sortOrder -
      b.sortOrder,
  );
}

export default function AdminPlansPage() {
  const [
    plans,
    setPlans,
  ] = useState<
    SubscriptionPlan[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    selectedPlan,
    setSelectedPlan,
  ] =
    useState<SubscriptionPlan | null>(
      null,
    );

  const [
    activeDialog,
    setActiveDialog,
  ] =
    useState<DialogType>(null);

  const loadPlans =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await getPlans();

        setPlans(
          response.plans,
        );
      } catch (
        error
      ) {
        console.error(error);

        toast.error(
          "Failed to load plans.",
        );
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    void loadPlans();
  }, [loadPlans]);

  function closeDialog() {
    setActiveDialog(null);

    setSelectedPlan(null);
  }

  async function handleCreate(
    values: CreatePlanInput,
  ) {
    try {
      setSubmitting(true);

      const {
        plan,
      } = await createPlan(
        values,
      );

      setPlans((current) =>
        sortPlans([
          ...current,
          plan,
        ]),
      );

      toast.success(
        "Plan created successfully.",
      );

      closeDialog();
    } catch (
      error
    ) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to create plan.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleEdit(
    planId: string,
    values: CreatePlanInput,
  ) {
    try {
      setSubmitting(true);

      const {
        plan,
      } = await updatePlan(
        planId,
        values,
      );

      setPlans((current) =>
        sortPlans(
          current.map((item) =>
            item.id === plan.id
              ? plan
              : item,
          ),
        ),
      );

      toast.success(
        "Plan updated successfully.",
      );

      closeDialog();
    } catch (
      error
    ) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update plan.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDelete(
    planId: string,
  ) {
    try {
      setSubmitting(true);

      await deletePlan(
        planId,
      );

      setPlans((current) =>
        current.filter(
          (plan) =>
            plan.id !== planId,
        ),
      );

      toast.success(
        "Plan deleted successfully.",
      );

      closeDialog();
    } catch (
      error
    ) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to delete plan.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <DashboardPageLayout
      environment="admin"
      breadcrumb={[
        {
          label: "Subscription Plans",
        },
      ]}
    >
      <div
        className="
          space-y-3
          pb-12
          sm:space-y-6
          sm:pb-16
        "
      >
        <div
          className="
            flex
            flex-col
            items-stretch
            gap-3
            sm:flex-row
            sm:items-start
            sm:justify-between
            sm:gap-4
          "
        >
          <AdminPageHeader
            title="Subscription Plans"
            description="Create, update and manage subscription plans available to affiliates."
          />

          <Button
            type="button"
            onClick={() =>
              setActiveDialog(
                "create",
              )
            }
            className="
              w-full
              sm:w-auto
            "
          >
            Create Plan
          </Button>
        </div>

        <PlanTable
          plans={plans}
          loading={loading}
          onView={(plan) => {
            setSelectedPlan(plan);

            setActiveDialog(
              "view",
            );
          }}
          onEdit={(plan) => {
            setSelectedPlan(plan);

            setActiveDialog(
              "edit",
            );
          }}
          onDelete={(plan) => {
            setSelectedPlan(plan);

            setActiveDialog(
              "delete",
            );
          }}
        />

        <CreatePlanDialog
          open={
            activeDialog ===
            "create"
          }
          loading={submitting}
          onClose={closeDialog}
          onSubmit={
            handleCreate
          }
        />

        <EditPlanDialog
          open={
            activeDialog ===
            "edit"
          }
          loading={submitting}
          plan={selectedPlan}
          onClose={closeDialog}
          onSubmit={
            handleEdit
          }
        />

        <ViewPlanDialog
          open={
            activeDialog ===
            "view"
          }
          plan={selectedPlan}
          onClose={closeDialog}
        />

        <DeletePlanDialog
          open={
            activeDialog ===
            "delete"
          }
          loading={submitting}
          plan={selectedPlan}
          onClose={closeDialog}
          onConfirm={
            handleDelete
          }
        />
      </div>
    </DashboardPageLayout>
  );
}