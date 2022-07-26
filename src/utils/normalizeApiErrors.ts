interface ApiError {
  path: string;
  message: string;
  errorCode: string;
}

export default function normalizeApiErrors(
  errors: ApiError[]
): Dictionary<string[]> {
  return errors.reduce<Dictionary<string[]>>((acc, error) => {
    const path = normalizePath(error.path);

    if (!acc[path]) {
      acc[path] = [];
    }

    acc[path].push(error.message);

    return acc;
  }, {});
}

function normalizePath(path: string): string {
  if (path.includes('/')) {
    return '';
  }

  return path.replace(/\.(body|query|params)\./g, '');
}
