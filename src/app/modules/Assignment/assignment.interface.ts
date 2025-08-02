// Filter fields
type TAssignmentFilters = {
  searchTerm?: string;
  instructorId?: string;
  isAvailable?: string;
  isDeleted?: string;
};

// Pagination fields
type TAssignmentPagination = {
  page?: string;
  limit?: string;
  sortBy?: string;
  sortOrder?: string;
};

// Additional dynamic filters
type TDynamicAssignmentFilters = Record<string, string>;

// Common combined query options type
export type TAssignmentQueryFilter = {
  filters: TAssignmentFilters;
  pagination: TAssignmentPagination;
  additional?: TDynamicAssignmentFilters;
};
