import {MAX_RETRY} from '../utils/constants';
import {ApiResponse} from './getUserDataService';

export const RetryService = async <T>(
  service: () => Promise<ApiResponse<T>>,
): Promise<ApiResponse<T>> => {
  let attempts = 0;

  while (attempts < MAX_RETRY) {
    const serviceResponse = await service();
    if (serviceResponse.success) {
      return serviceResponse;
    }

    attempts++;
  }

  return {
    success: false,
    errorMessage: `Error después de ${MAX_RETRY} intentos`,
  };
};
