import type {
  DepositMethod,
} from "./deposit.types";

export const DEPOSIT_METHODS: DepositMethod[] =
  [
    {
      id: "bitcoin",

      name: "Bitcoin",

      symbol: "BTC",

      icon:
        "/assets/images/crypto/Icon-SVGs/btc.svg",

      address:
        "bc1qxxxxxxxxxxxxxxxxxxxxxxxx",

      qrCode:
        "/assets/images/crypto/QR-Code/btc.jpg",
    },

    {
      id: "ethereum",

      name: "Ethereum",

      symbol: "ETH",

      icon:
        "/assets/images/crypto/Icon-SVGs/eth.svg",

      address:
        "0xxxxxxxxxxxxxxxxxxxxxxxx",

      qrCode:
        "/assets/images/crypto/QR-Code/eth.jpg",
    },

    {
      id: "xrp",

      name: "XRP",

      symbol: "XRP",

      icon:
        "/assets/images/crypto/Icon-SVGs/xrp.svg",

      address:
        "rxxxxxxxxxxxxxxxxxxxxxxxx",

      qrCode:
        "/assets/images/crypto/QR-Code/xrp.jpg",
    },

    {
      id: "tron",

      name: "TRON",

      symbol: "TRX",

      icon:
        "/assets/images/crypto/Icon-SVGs/trx.svg",

      address:
        "Txxxxxxxxxxxxxxxxxxxxxxxx",

      qrCode:
        "/assets/images/crypto/QR-Code/trx.jpg",
    },

    {
      id: "litecoin",

      name: "Litecoin",

      symbol: "LTC",

      icon:
        "/assets/images/crypto/Icon-SVGs/ltc.svg",

      address:
        "ltc1qxxxxxxxxxxxxxxxxxxxx",

      qrCode:
        "/assets/images/crypto/QR-Code/ltc.jpg",
    },
  ];