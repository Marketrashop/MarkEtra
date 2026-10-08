import { prisma } from "@/lib/prisma";

import AdminKycPage from "@/components/admin/kyc/AdminKycPage";

export default async function Page() {
  const submissions =
    await prisma.kycVerification.findMany({
      include: {
        user: {
          select: {
            email: true,
            phoneNumber: true,
          },
        },
      },

      orderBy: {
        submittedAt: "desc",
      },
    });

  return (
    <AdminKycPage
      submissions={submissions.map(
        (submission) => ({
          id: submission.id,

          userId: submission.userId,

          firstName:
            submission.firstName,

          lastName:
            submission.lastName,

          dateOfBirth:
            submission.dateOfBirth.toISOString(),

          nationality:
            submission.nationality,

          residentialAddress:
            submission.residentialAddress,

          city: submission.city,

          state: submission.state,

          postalCode:
            submission.postalCode,

          country:
            submission.country,

          documentType:
            submission.documentType,

          frontDocumentKey:
            submission.frontDocumentKey,

          backDocumentKey:
            submission.backDocumentKey,

          selfieKey:
            submission.selfieKey,

          status:
            submission.status,

          rejectionReason:
            submission.rejectionReason,

          reviewedAt:
            submission.reviewedAt?.toISOString() ??
            null,

          submittedAt:
            submission.submittedAt.toISOString(),

          createdAt:
            submission.createdAt.toISOString(),

          updatedAt:
            submission.updatedAt.toISOString(),

          email:
            submission.user.email,

          phoneNumber:
            submission.user.phoneNumber,
        })
      )}
    />
  );
}