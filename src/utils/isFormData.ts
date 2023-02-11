export function isFormData(data: any): data is FormData {
  return data && data instanceof FormData;
}
