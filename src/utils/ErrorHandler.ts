import { isAxiosError } from 'axios';

/**
 * Generic error handler for API and other exceptions.
 * Can be reused across the app.
 */
export function handleApiError(error: unknown): string {
  if (isAxiosError(error)) {
    if (error.response) {
      // Server responded with a status outside 2xx
      const message = error.response.data?.errors[0].title ?? 'Something went wrong';
      return message;
    }

    if (error.request) {
      // Request was made but no response received
      return 'Network error. Please check your connection.';
    }

    // Axios config or unexpected issue
    return 'Unexpected error occurred.';
  }

  // Any other kind of error (non-Axios)
  return 'An unknown error occurred.';
}
