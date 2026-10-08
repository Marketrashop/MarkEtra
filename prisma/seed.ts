import "dotenv/config";

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import {
  ProcessingFeeType,
  WithdrawalMethodType,
} from "../generated/prisma/enums";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  adapter,
});

const depositMethods = [
  {
    name: "Bitcoin",
    symbol: "BTC",
    network: "Bitcoin",
    walletAddress: "",
    instructions: "Send only BTC on the Bitcoin network.",
    iconKey: "/images/crypto/btc.svg",
    minimumAmount: "50",
    maximumAmount: "1000000",
    displayOrder: 1,
  },
  {
    name: "Ethereum",
    symbol: "ETH",
    network: "Ethereum",
    walletAddress: "",
    instructions: "Send only ETH on the Ethereum network.",
    iconKey: "/images/crypto/eth.svg",
    minimumAmount: "50",
    maximumAmount: "1000000",
    displayOrder: 2,
  },
  {
    name: "XRP",
    symbol: "XRP",
    network: "XRP Ledger",
    walletAddress: "",
    instructions: "Send only XRP on the XRP Ledger.",
    iconKey: "/images/crypto/xrp.svg",
    minimumAmount: "50",
    maximumAmount: "1000000",
    displayOrder: 3,
  },
  {
    name: "TRON",
    symbol: "TRX",
    network: "TRON",
    walletAddress: "",
    instructions: "Send only TRX on the TRON network.",
    iconKey: "/images/crypto/trx.svg",
    minimumAmount: "50",
    maximumAmount: "1000000",
    displayOrder: 4,
  },
  {
    name: "Litecoin",
    symbol: "LTC",
    network: "Litecoin",
    walletAddress: "",
    instructions: "Send only LTC on the Litecoin network.",
    iconKey: "/images/crypto/ltc.svg",
    minimumAmount: "50",
    maximumAmount: "1000000",
    displayOrder: 5,
  },
];

const withdrawalMethods = [
  {
    type: WithdrawalMethodType.CRYPTO,
    name: "Bitcoin",
    symbol: "BTC",
    network: "Bitcoin",
    iconKey: "/images/crypto/btc.svg",
    placeholder: "Enter BTC wallet address",
    minimumAmount: "50",
    maximumAmount: "1000000",
    processingFee: "0",
    processingFeeType: ProcessingFeeType.FIXED,
    displayOrder: 1,
  },
  {
    type: WithdrawalMethodType.CRYPTO,
    name: "Ethereum",
    symbol: "ETH",
    network: "Ethereum",
    iconKey: "/images/crypto/eth.svg",
    placeholder: "Enter ETH wallet address",
    minimumAmount: "50",
    maximumAmount: "1000000",
    processingFee: "0",
    processingFeeType: ProcessingFeeType.FIXED,
    displayOrder: 2,
  },
  {
    type: WithdrawalMethodType.CRYPTO,
    name: "XRP",
    symbol: "XRP",
    network: "XRP Ledger",
    iconKey: "/images/crypto/xrp.svg",
    placeholder: "Enter XRP wallet address",
    minimumAmount: "50",
    maximumAmount: "1000000",
    processingFee: "0",
    processingFeeType: ProcessingFeeType.FIXED,
    displayOrder: 3,
  },
  {
    type: WithdrawalMethodType.CRYPTO,
    name: "TRON",
    symbol: "TRX",
    network: "TRON",
    iconKey: "/images/crypto/trx.svg",
    placeholder: "Enter TRX wallet address",
    minimumAmount: "50",
    maximumAmount: "1000000",
    processingFee: "0",
    processingFeeType: ProcessingFeeType.FIXED,
    displayOrder: 4,
  },
  {
    type: WithdrawalMethodType.CRYPTO,
    name: "Litecoin",
    symbol: "LTC",
    network: "Litecoin",
    iconKey: "/images/crypto/ltc.svg",
    placeholder: "Enter LTC wallet address",
    minimumAmount: "50",
    maximumAmount: "1000000",
    processingFee: "0",
    processingFeeType: ProcessingFeeType.FIXED,
    displayOrder: 5,
  },
];

async function main() {
  for (const method of depositMethods) {
    await prisma.depositMethod.upsert({
      where: {
        symbol_network: {
          symbol: method.symbol,
          network: method.network,
        },
      },
      update: method,
      create: method,
    });
  }

  for (const method of withdrawalMethods) {
    await prisma.withdrawalMethod.upsert({
      where: {
        symbol_network: {
          symbol: method.symbol,
          network: method.network,
        },
      },
      update: method,
      create: method,
    });
  }

  console.log("✅ Deposit and withdrawal methods seeded successfully.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });