export const getPaginatedFields = ({ page, limit }: { page: number; limit: number }) => {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit));
  const skip = (safePage - 1) * safeLimit;

  return {
    safePage,
    safeLimit,
    skip,
  };
};
