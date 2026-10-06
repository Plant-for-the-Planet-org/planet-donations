export interface SupportedDonationConfig {
  [key: string]: {
    supportPercentage: number;
    country: string;
    currency: string;
    supportedProject: string;
    languages: string[];
  };
}

export const supportedDonationConfig: SupportedDonationConfig = {
  ten_61F97F9j: {
    supportPercentage: 0.25,
    country: "DE",
    currency: "EUR",
    supportedProject: "proj_bFH0BU0Qw02RuetpQlLOMVYX",
    languages: ["en"],
  },
};
