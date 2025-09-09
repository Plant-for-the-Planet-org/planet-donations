export interface SupportedDonationConfig {
  [key: string]: {
    supportPercentage: number;
    supportedProjects: {
      [countryCode: string]: string;
    };
  };
}

export const supportedDonationConfig: SupportedDonationConfig = {
  ten_670y1ZHn: {
    supportPercentage: 0.25,
    supportedProjects: {
      DE: "proj_bFH0BU0Qw02RuetpQlLOMVYX",
    },
  },
};
