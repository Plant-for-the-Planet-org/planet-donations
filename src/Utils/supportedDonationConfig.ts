export interface SupportedDonationConfig {
  [key: string]: {
    supportPercentage: number;
    supportedProjects: {
      [countryCode: string]: string;
      default: string;
    };
  };
}

export const supportedDonationConfig: SupportedDonationConfig = {
  ten_3hEjJCBs: {
    supportPercentage: 0.25,
    supportedProjects: {
      // TODO: To be updated once list of supported projects is confirmed
      DE: "proj_bFH0BU0Qw02RuetpQlLOMVYX",
      US: "proj_bFH0BU0Qw02RuetpQlLOMVYX",
      default: "proj_bFH0BU0Qw02RuetpQlLOMVYX",
    },
  },
};
