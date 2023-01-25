/**
 * Returns image url
 */
export default function getImageUrl(
  category: string,
  variant: string,
  imageName: string
): string {
  return `${process.env.CDN_URL}/media/cache/${category}/${variant}/${imageName}`;
}

/**
 * Returns PDF URL
 */
export function getPDFFile(category: string, fileName: string): string {
  return `${process.env.CDN_URL}/media/uploads/pdfs/${category}/${fileName}`;
}

/**
 * Returns URLs for payment option icons
 */
export function getPaymentOptionIcons(logoName: string): string {
  return `${process.env.CDN_URL}/media/images/app/payment_options/${logoName} `;
}
