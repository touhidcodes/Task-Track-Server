import {
  TPaginationOptions,
  TPaginationResult,
} from "../interfaces/pagination";

const calculatePagination = (
  options: TPaginationOptions
): TPaginationResult => {
  const page: number = Number(options.page) || 1;
  const limit: number = Number(options.limit) || 10;
  const skip: number = (Number(page) - 1) * limit;

  const sortBy: string | undefined = options.sortBy;
  const sortOrder: string | undefined = options.sortOrder;

  return {
    page,
    limit,
    skip,
    sortBy,
    sortOrder,
  };
};

export const paginationHelper = {
  calculatePagination,
};
