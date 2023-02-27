/* eslint import/no-anonymous-default-export: 0 */

import {
  faBox,
  faChartLine,
  faCode,
  faDollarSign,
  faEnvelope,
  faLayerGroup,
  faRocket,
  faUpload,
} from "@fortawesome/free-solid-svg-icons";

export default [
  {
    name: "Transparent",
    description:
      "Backed up 1 to 1 with funds. CLPX is backed by the the dollar stablecoin USDC. It is regulated and issued by a financial institution in the United States. It can be view on the blockchain(s).",
    icon: faLayerGroup,
  },
  {
    name: "Free Trading with other digital currencies",
    description:
      "Trade your XLM or other crypto to CLPX and then cash out. Check out or buy crypto seamlessly from your Chilean bank account.",
    icon: faChartLine,
  },
  {
    name: "Protect yourself from inflation",
    description: "Trade with stable tokens and earn daily interest on your balance.",
    icon: faDollarSign,
  },
  {
    name: "Programmable (Sep 10/24/6/31)",
    description: `Supports all Stellar SEP standards. Information available <a alt="Stellar developer documentation" href="https://developers.stellar.org/docs/anchoring-assets/enabling-deposit-and-withdrawal/" target="_blank"> here</a> and <a alt="stellar-payment-api" href="https://github.com/antb123/stellar-payment-api" target="_blank"> here</a>.`,
    icon: faCode,
  },
  {
    name: "Stable",
    description: "Backed up 1 to 1 with funds. It is pegged 1 to 1 with the Chilean Peso.",
    icon: faBox,
  },
  {
    name: "Fast",
    description: "All payments and trades are settled within 5 seconds.",
    icon: faRocket,
  },
  {
    name: "Free Deposits",
    description: "Free Deposits into the blockchain ecosystem",
    icon: faUpload,
  },

  {
    name: "Great support",
    description: "Join a chat for support",
    icon: faEnvelope,
  },
];
