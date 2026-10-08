import {
  prisma,
} from "@/lib/prisma";

import type {
  CreateAddressInput,
  UpdateAddressInput,
} from "@/types/address.types";

export async function getUserAddresses(
  userId: string,
) {
  return prisma.address.findMany({
    where: {
      userId,
    },

    orderBy: [
      {
        isPrimary: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });
}

export async function getUserAddressById(
  userId: string,
  addressId: string,
) {
  return prisma.address.findFirst({
    where: {
      id: addressId,
      userId,
    },
  });
}

export async function createUserAddress(
  userId: string,
  input: CreateAddressInput,
) {
  return prisma.$transaction(
    async (tx) => {
      if (input.isPrimary) {
        await tx.address.updateMany({
          where: {
            userId,
            isPrimary: true,
          },

          data: {
            isPrimary: false,
          },
        });
      }

      const existingCount =
        await tx.address.count({
          where: {
            userId,
          },
        });

      return tx.address.create({
        data: {
          userId,

          fullName:
            input.fullName,

          phoneNumber:
            input.phoneNumber,

          alternatePhoneNumber:
            input.alternatePhoneNumber ??
            null,

          addressLine1:
            input.addressLine1,

          addressLine2:
            input.addressLine2 ??
            null,

          city:
            input.city,

          state:
            input.state ??
            null,

          country:
            input.country,

          postalCode:
            input.postalCode ??
            null,

          label:
            input.label ??
            null,

          isPrimary:
            input.isPrimary ??
            existingCount ===
              0,
        },
      });
    },
  );
}

export async function updateUserAddress(
  userId: string,
  addressId: string,
  input: UpdateAddressInput,
) {
  return prisma.$transaction(
    async (tx) => {
      const address =
        await tx.address.findFirst({
          where: {
            id: addressId,
            userId,
          },
        });

      if (!address) {
        throw new Error(
          "ADDRESS_NOT_FOUND",
        );
      }

      if (input.isPrimary) {
        await tx.address.updateMany({
          where: {
            userId,
            isPrimary: true,
            NOT: {
              id: addressId,
            },
          },

          data: {
            isPrimary: false,
          },
        });
      }

      return tx.address.update({
        where: {
          id: addressId,
        },

        data: {
          ...(input.fullName !==
          undefined
            ? {
                fullName:
                  input.fullName,
              }
            : {}),

          ...(input.phoneNumber !==
          undefined
            ? {
                phoneNumber:
                  input.phoneNumber,
              }
            : {}),

          ...(input.alternatePhoneNumber !==
          undefined
            ? {
                alternatePhoneNumber:
                  input.alternatePhoneNumber ??
                  null,
              }
            : {}),

          ...(input.addressLine1 !==
          undefined
            ? {
                addressLine1:
                  input.addressLine1,
              }
            : {}),

          ...(input.addressLine2 !==
          undefined
            ? {
                addressLine2:
                  input.addressLine2 ??
                  null,
              }
            : {}),

          ...(input.city !==
          undefined
            ? {
                city:
                  input.city,
              }
            : {}),

          ...(input.state !==
          undefined
            ? {
                state:
                  input.state ??
                  null,
              }
            : {}),

          ...(input.country !==
          undefined
            ? {
                country:
                  input.country,
              }
            : {}),

          ...(input.postalCode !==
          undefined
            ? {
                postalCode:
                  input.postalCode ??
                  null,
              }
            : {}),

          ...(input.label !==
          undefined
            ? {
                label:
                  input.label ??
                  null,
              }
            : {}),

          ...(input.isPrimary !==
          undefined
            ? {
                isPrimary:
                  input.isPrimary,
              }
            : {}),
        },
      });
    },
  );
}

export async function deleteUserAddress(
  userId: string,
  addressId: string,
) {
  return prisma.$transaction(
    async (tx) => {
      const address =
        await tx.address.findFirst({
          where: {
            id: addressId,
            userId,
          },
        });

      if (!address) {
        throw new Error(
          "ADDRESS_NOT_FOUND",
        );
      }

      await tx.address.delete({
        where: {
          id: addressId,
        },
      });

      if (address.isPrimary) {
        const replacement =
          await tx.address.findFirst({
            where: {
              userId,
            },

            orderBy: {
              createdAt: "desc",
            },
          });

        if (replacement) {
          await tx.address.update({
            where: {
              id: replacement.id,
            },

            data: {
              isPrimary: true,
            },
          });
        }
      }
    },
  );
}

export async function setPrimaryAddress(
  userId: string,
  addressId: string,
) {
  return prisma.$transaction(
    async (tx) => {
      const address =
        await tx.address.findFirst({
          where: {
            id: addressId,
            userId,
          },
        });

      if (!address) {
        throw new Error(
          "ADDRESS_NOT_FOUND",
        );
      }

      await tx.address.updateMany({
        where: {
          userId,
          isPrimary: true,
          NOT: {
            id: addressId,
          },
        },

        data: {
          isPrimary: false,
        },
      });

      return tx.address.update({
        where: {
          id: addressId,
        },

        data: {
          isPrimary: true,
        },
      });
    },
  );
}