const queryFilters = (
  query: Record<string, any>,
  knownKeys: string[],
  paginationKeys: string[]
) => {
  const filters: Record<string, any> = {};
  const pagination: Record<string, any> = {};
  const additional: Record<string, any> = {};

  // Process each key in the query
  Object.keys(query).forEach((key) => {
    const value = query[key];

    // Skip empty values (empty strings, null, undefined)
    if (value === undefined || value === null || value === "") {
      return;
    }

    if (paginationKeys.includes(key)) {
      pagination[key] = value;
    } else if (knownKeys.includes(key)) {
      filters[key] = value;
    } else {
      additional[key] = value;
    }
  });

  return { filters, pagination, additional };
};

export default queryFilters;
