export interface SupportedDonationConfig {
  [key: string]: {
    supportPercentage: number;
    supportedProjects: string[];
  };
}

export const supportedDonationConfig: SupportedDonationConfig = {
  ten_3hEjJCBs: {
    supportPercentage: 0.25,
    supportedProjects: ["proj_bFH0BU0Qw02RuetpQlLOMVYX"],
  },
};
