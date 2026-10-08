"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";

import DepositMethodDialog, {
  DepositMethodFormValues,
} from "@/components/admin/deposit-methods/DepositMethodDialog";

import DeleteDepositMethodDialog from "@/components/admin/deposit-methods/DeleteDepositMethodDialog";

import DepositMethodsTable from "@/components/admin/deposit-methods/DepositMethodsTable";

import type {
  DepositMethod,
} from "@/components/admin/deposit-methods/types";

import DashboardPageLayout from "@/components/dashboard/DashboardPage";

import { AdminPageHeader } from "@/components/admin";

export default function DepositMethodsPage() {
  const [
    methods,
    setMethods,
  ] = useState<DepositMethod[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    dialogOpen,
    setDialogOpen,
  ] = useState(false);

  const [
    deleteOpen,
    setDeleteOpen,
  ] = useState(false);

  const [
    editingMethod,
    setEditingMethod,
  ] = useState<DepositMethod | null>(null);

  const dialogMode =
    editingMethod
      ? "edit"
      : "create";

  const loadMethods =
    useCallback(async () => {
      try {
        setLoading(true);

        const response =
          await fetch(
            "/api/admin/deposit-methods",
            {
              cache: "no-store",
            },
          );

        if (!response.ok) {
          throw new Error();
        }

        const data =
          await response.json();

        setMethods(data.data ?? []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }, []);

  useEffect(() => {
    loadMethods();
  }, [loadMethods]);

  function openCreateDialog() {
    setEditingMethod(null);

    setDialogOpen(true);
  }

  function openEditDialog(
    method: DepositMethod,
  ) {
    setEditingMethod(method);

    setDialogOpen(true);
  }

  function openDeleteDialog(
    method: DepositMethod,
  ) {
    setEditingMethod(method);

    setDeleteOpen(true);
  }

  function closeDialog() {
    if (submitting) {
      return;
    }

    setDialogOpen(false);

    setEditingMethod(null);
  }

  function closeDeleteDialog() {
    setDeleteOpen(false);

    setEditingMethod(null);
  }

  async function handleSubmit(
    values: DepositMethodFormValues,
  ) {
    setSubmitting(true);

    try {
      const isEditing =
        dialogMode === "edit";

      const response =
        await fetch(
          isEditing
            ? `/api/admin/deposit-methods/${editingMethod!.id}`
            : "/api/admin/deposit-methods",
          {
            method: isEditing
              ? "PUT"
              : "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(
              values,
            ),
          },
        );

      if (!response.ok) {
        const data =
          await response.json();

        throw new Error(
          data.error ??
            "Unable to save deposit method.",
        );
      }

      await loadMethods();

      closeDialog();
    } catch (error) {
      console.error(error);

      alert(
        error instanceof Error
          ? error.message
          : "Unable to save deposit method.",
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
          label: "Deposit Methods",
        },
      ]}
    >
      <div
        className="
          space-y-8
        "
      >
        <AdminPageHeader
          title="Deposit Methods"
          description="Manage every cryptocurrency deposit method available to users."
        />

        <DepositMethodsTable
          methods={methods}
          loading={loading}
          onCreate={openCreateDialog}
          onEdit={openEditDialog}
          onDelete={openDeleteDialog}
        />

        <DepositMethodDialog
          open={dialogOpen}
          mode={dialogMode}
          method={editingMethod}
          submitting={submitting}
          onClose={closeDialog}
          onSubmit={handleSubmit}
        />

        <DeleteDepositMethodDialog
          open={deleteOpen}
          method={editingMethod}
          onClose={closeDeleteDialog}
          onSuccess={async () => {
            await loadMethods();
            closeDeleteDialog();
          }}
        />
      </div>
    </DashboardPageLayout>
  );
}