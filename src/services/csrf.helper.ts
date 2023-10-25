// additional helper in case of storing CSRF in localStorage

export const CSRF_NAME = 'CSRF';

export const addCsrfHeader = () => ({
  'X-Csrftoken': localStorage.getItem(CSRF_NAME)!,
});
