// For filter from all assignments
export const assignmentFilterableFields: string[] = [
  "searchTerm",
  "instructorId",
  "isAvailable",
  "isDeleted",
];

// For pagination
export const assignmentPaginationFields: string[] = [
  "limit",
  "page",
  "sortBy",
  "sortOrder",
];

// For query search fields (used in OR conditions for searchTerm)
export const assignmentQueryFields: string[] = ["title", "description"];
