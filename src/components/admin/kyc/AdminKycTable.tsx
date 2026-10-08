"use client";

import type {
  KycRecord,
} from "@/components/kyc/kyc.types";

type AdminKycTableProps = {
  submissions: KycRecord[];

  onReview: (
    id: string,
  ) => void;
};

export default function AdminKycTable({
  submissions,
  onReview,
}: AdminKycTableProps) {
  if (submissions.length === 0) {
    return (
      <div
        className="
          rounded-lg
          border
          border-[var(--admin-empty-border)]
          bg-[var(--admin-empty-bg)]
          px-3
          py-8
          text-center
          shadow-[var(--admin-empty-shadow)]
          sm:rounded-[var(--admin-card-radius)]
          sm:p-12
        "
      >
        <h3
          className="
            text-[12px]
            font-semibold
            text-[var(--admin-empty-title)]
            sm:text-lg
          "
        >
          No KYC submissions found
        </h3>

        <p
          className="
            mt-1
            text-[9px]
            leading-4
            text-[var(--admin-empty-text)]
            sm:mt-2
            sm:text-sm
            sm:leading-normal
          "
        >
          There are currently no submissions matching your filters.
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table
        className="
          min-w-[760px]
          w-full
        "
      >
        <thead
          className="
            sticky
            top-0
            z-10
            bg-[var(--admin-table-header-bg)]
          "
        >
          <tr>
            <th
              className="
                px-2.5
                py-2.5
                text-left
                text-[8px]
                font-semibold
                text-[var(--admin-table-header-text)]
                sm:px-6
                sm:py-4
                sm:text-sm
              "
            >
              Name
            </th>

            <th
              className="
                px-2.5
                py-2.5
                text-left
                text-[8px]
                font-semibold
                text-[var(--admin-table-header-text)]
                sm:px-6
                sm:py-4
                sm:text-sm
              "
            >
              Nationality
            </th>

            <th
              className="
                px-2.5
                py-2.5
                text-left
                text-[8px]
                font-semibold
                text-[var(--admin-table-header-text)]
                sm:px-6
                sm:py-4
                sm:text-sm
              "
            >
              Document
            </th>

            <th
              className="
                px-2.5
                py-2.5
                text-left
                text-[8px]
                font-semibold
                text-[var(--admin-table-header-text)]
                sm:px-6
                sm:py-4
                sm:text-sm
              "
            >
              Status
            </th>

            <th
              className="
                px-2.5
                py-2.5
                text-left
                text-[8px]
                font-semibold
                text-[var(--admin-table-header-text)]
                sm:px-6
                sm:py-4
                sm:text-sm
              "
            >
              Submitted
            </th>

            <th
              className="
                px-2.5
                py-2.5
                text-right
                text-[8px]
                font-semibold
                text-[var(--admin-table-header-text)]
                sm:px-6
                sm:py-4
                sm:text-sm
              "
            >
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {submissions.map(
            (submission) => (
              <tr
                key={
                  submission.id
                }
                className="
                  border-t
                  border-[var(--admin-table-border)]
                  transition-colors
                  duration-[var(--admin-card-transition)]
                  hover:bg-[var(--admin-table-row-hover)]
                "
              >
                <td
                  className="
                    whitespace-nowrap
                    px-2.5
                    py-2.5
                    text-[9px]
                    text-[var(--admin-table-text)]
                    sm:px-6
                    sm:py-4
                    sm:text-sm
                  "
                >
                  {submission.firstName}{" "}
                  {submission.lastName}
                </td>

                <td
                  className="
                    whitespace-nowrap
                    px-2.5
                    py-2.5
                    text-[9px]
                    text-[var(--admin-table-muted)]
                    sm:px-6
                    sm:py-4
                    sm:text-sm
                  "
                >
                  {
                    submission.nationality
                  }
                </td>

                <td
                  className="
                    whitespace-nowrap
                    px-2.5
                    py-2.5
                    text-[9px]
                    text-[var(--admin-table-muted)]
                    sm:px-6
                    sm:py-4
                    sm:text-sm
                  "
                >
                  {
                    submission.documentType
                  }
                </td>

                <td
                  className="
                    whitespace-nowrap
                    px-2.5
                    py-2.5
                    text-[9px]
                    text-[var(--admin-table-text)]
                    sm:px-6
                    sm:py-4
                    sm:text-sm
                  "
                >
                  {
                    submission.status
                  }
                </td>

                <td
                  className="
                    whitespace-nowrap
                    px-2.5
                    py-2.5
                    text-[9px]
                    text-[var(--admin-table-muted)]
                    sm:px-6
                    sm:py-4
                    sm:text-sm
                  "
                >
                  {new Date(
                    submission.submittedAt,
                  ).toLocaleDateString()}
                </td>

                <td
                  className="
                    px-2.5
                    py-2.5
                    text-right
                    sm:px-6
                    sm:py-4
                  "
                >
                  <button
                    type="button"
                    onClick={() =>
                      onReview(
                        submission.id,
                      )
                    }
                    className="
                      inline-flex
                      h-7
                      items-center
                      justify-center
                      rounded-md
                      border
                      px-2.5
                      text-[9px]
                      font-semibold
                      transition
                      hover:opacity-90
                      focus:outline-none
                      sm:h-9
                      sm:rounded-[var(--admin-input-radius)]
                      sm:px-4
                      sm:text-sm
                    "
                    style={{
                      background:
                        "var(--admin-table-header-bg)",
                      color:
                        "var(--admin-table-title)",
                      borderColor:
                        "var(--admin-card-border)",
                      boxShadow:
                        "0 1px 3px var(--admin-card-shadow)",
                    }}
                  >
                    Review
                  </button>
                </td>
              </tr>
            ),
          )}
        </tbody>
      </table>
    </div>
  );
}