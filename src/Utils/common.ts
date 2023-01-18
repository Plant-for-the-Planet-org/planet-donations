export const approximatelyEqual = (
  v1: number,
  v2: number,
  epsilon = 0.001
): boolean => Math.abs(v1 - v2) < epsilon;
