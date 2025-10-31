export interface SupportedDonationConfig {
  [key: string]: {
    supportPercentage: number;
    country: string;
    currency: string;
    supportedProject: string;
  };
}

export const supportedDonationConfig: SupportedDonationConfig = {
  ten_qBbv2i8m: {
    supportPercentage: 0.25,
    country: "DE",
    currency: "EUR",
    supportedProject: "proj_bFH0BU0Qw02RuetpQlLOMVYX",
  },
};
