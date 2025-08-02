// For filter from all submissions
export const submissionFilterableFields: string[] = ["searchTerm", "status"];

// For pagination
export const submissionPaginationFields: string[] = [
  "limit",
  "page",
  "sortBy",
  "sortOrder",
];

// For query search fields (used in OR conditions for searchTerm)
export const submissionQueryFields: string[] = [
  "student.username",
  "student.email",
];
