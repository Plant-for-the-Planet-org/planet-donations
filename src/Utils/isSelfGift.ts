export const isSelfGift = (
  recipientEmail: string,
  giverEmail: string
): boolean => {
  if (!recipientEmail) return false;
  return (
    recipientEmail.trim().toLowerCase() === giverEmail.trim().toLowerCase()
  );
};
