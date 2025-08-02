// Filter fields
type TSubmissionFilters = {
  searchTerm?: string;
  status?: string;
  isAvailable?: string;
  isDeleted?: string;
};

// Pagination fields
type TSubmissionPagination = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};

// Additional dynamic filters
type TDynamicSubmissionFilters = Record<string, string>;

// Common combined query options type
export type TSubmissionQueryFilter = {
  filters: TSubmissionFilters;
  pagination: TSubmissionPagination;
  additional?: TDynamicSubmissionFilters;
};
