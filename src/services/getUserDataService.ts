import axios from 'axios';
import {USERS_URL} from '../utils/constants';
import {StorageKeys, storeData} from '../storage/AsyncStorage';
import {User} from './Types';
import {RetryService} from './RetryService';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  errorMessage?: string;
}

export default async ({
  userName,
}: {
  userName: string;
}): Promise<ApiResponse<User[]>> => {
  const service = async (): Promise<ApiResponse<User[]>> => {
    try {
      const response = await axios.get(USERS_URL);
      const users = response.data;
      const filteredUsers = users.filter((user: User) =>
        user.name.toLowerCase().includes(userName.toLowerCase()),
      );
      await storeData(StorageKeys.USERS, filteredUsers);
      return {success: true, data: filteredUsers};
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        errorMessage: `API request failed: ${JSON.stringify(error)}`,
      };
    }
  };

  return RetryService(service);
};
