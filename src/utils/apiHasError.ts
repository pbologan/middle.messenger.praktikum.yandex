import { APIError } from '../models/error';

export function apiHasError(response: any): response is APIError {
  return response && response.reason;
}
