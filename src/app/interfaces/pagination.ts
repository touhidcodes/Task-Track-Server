export type TPaginationOptions = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};

export type TPaginationResult = {
  page: number;
  limit: number;
  skip: number;
  sortBy?: string;
  sortOrder?: string;
};
