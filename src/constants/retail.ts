export const MERCEDES_NTG_MODELS = [
  {
    ntg: "NTG 3.5",
    models: [
      {
        name: "S-Class",
        codes: ["W221"],
      },
      {
        name: "CL-Class",
        codes: ["W216"],
      },
    ],
  },

  {
    ntg: "NTG 4.5 / 4.7",
    models: [
      {
        name: "C-Class",
        codes: ["W204"],
      },
      {
        name: "E-Class",
        codes: ["W212", "W207"],
      },
      {
        name: "B-Class",
        codes: ["W246"],
      },
      {
        name: "A-Class",
        codes: ["W176"],
      },
      {
        name: "SLK / SLC",
        codes: ["R172"],
      },
      {
        name: "SL",
        codes: ["R231"],
      },
      {
        name: "GLE-Class / M-Class",
        codes: ["W166"],
      },
      {
        name: "GLA",
        codes: ["X156"],
      },
      {
        name: "G-Class",
        codes: ["W463"],
      },
    ],
  },

  {
    ntg: "NTG 5*1",
    models: [
      {
        name: "A-Class",
        codes: ["W176"],
      },
      {
        name: "CLA",
        codes: ["C117"],
      },
      {
        name: "B-Class",
        codes: ["W246"],
      },
      {
        name: "GLA",
        codes: ["X156"],
      },
      {
        name: "GLE-Class",
        codes: ["W166"],
      },
      {
        name: "GLE Coupé",
        codes: ["W292"],
      },
      {
        name: "E-Class",
        codes: ["W212"],
      },
    ],
  },

  {
    ntg: "NTG 5.5",
    models: [
      {
        name: "E-Class",
        codes: ["W213", "W238"],
      },
      {
        name: "C-Class",
        codes: ["W205"],
      },
      {
        name: "S-Class",
        codes: ["W222"],
      },
      {
        name: "GLC",
        codes: ["X253"],
      },
      {
        name: "G-Class",
        codes: ["W463"],
      },
      {
        name: "AMG GT",
        codes: ["X290"],
      },
    ],
  },

  {
    ntg: "NTG 6",
    models: [
      {
        name: "A-Class",
        codes: ["W177"],
      },
      {
        name: "B-Class",
        codes: ["W247"],
      },
      {
        name: "CLA",
        codes: ["C118"],
      },
      {
        name: "GLB",
        codes: ["X247"],
      },
      {
        name: "GLE-Class",
        codes: ["W167"],
      },
      {
        name: "GLC",
        codes: ["X253"],
      },
      {
        name: "E-Class",
        codes: ["W213"],
      },
    ],
  },

  {
    ntg: "NTG 7",
    models: [
      {
        name: "S-Class",
        codes: ["W223"],
      },
      {
        name: "C-Class",
        codes: ["W206"],
      },
      {
        name: "GLC",
        codes: ["W254"],
      },
      {
        name: "AMG GT",
        codes: ["W192"],
      },
      {
        name: "EQE / EQS",
        codes: ["W294", "W295", "W296"],
      },
      {
        name: "A-Class",
        codes: ["W177"],
      },
      {
        name: "B-Class",
        codes: ["W247"],
      },
      {
        name: "GLE-Class",
        codes: ["W167"],
      },
    ],
  },
  {
    ntg: "Gen20X",
    models: [
      {
        name: "E-Class",
        codes: ["W214"],
      },
      {
        name: "C-Class",
        codes: ["W206"],
      },
      {
        name: "S-Class",
        codes: ["W223"],
      },
    ],
  },
  {
    ntg: "NTG 5*2 / 5",
    brand: "Aston Martin",
    models: [
      {
        name: "Aston Martin",
        codes: [],
      },
    ],
  },
];

import {
  RetailOrderStatus,
  RetailOrderItemStatus,
  RetailPaymentStatus,
} from "@/types/retail";

export const RETAIL_ORDER_STATUS = {
  pending: {
    label: "En attente",
    color: "yellow",
  },

  processing: {
    label: "Traitement en cours",
    color: "blue",
  },

  completed: {
    label: "Terminée",
    color: "green",
  },

  partial: {
    label: "Partiellement terminée",
    color: "orange",
  },

  failed: {
    label: "Échec",
    color: "red",
  },

  action_required: {
    label: "Action requise",
    color: "grape",
  },
} satisfies Record<
  RetailOrderStatus,
  {
    label: string;
    color: string;
  }
>;

export const RETAIL_ORDER_ITEM_STATUS = {
  pending: {
    label: "En attente",
    color: "yellow",
  },

  success: {
    label: "Réussi",
    color: "green",
  },

  failed: {
    label: "Échec",
    color: "red",
  },
} satisfies Record<
  RetailOrderItemStatus,
  {
    label: string;
    color: string;
  }
>;

export const RETAIL_PAYMENT_STATUS = {
  pending: {
    label: "En attente",
    color: "yellow",
  },

  succeeded: {
    label: "Payé",
    color: "green",
  },

  failed: {
    label: "Échec",
    color: "red",
  },
} satisfies Record<
  RetailPaymentStatus,
  {
    label: string;
    color: string;
  }
>;