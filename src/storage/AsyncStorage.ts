import AsyncStorage from '@react-native-async-storage/async-storage';
import {ApiResponse} from '../services/getUserDataService';

export enum StorageKeys {
  USERS = 'USERS',
}

export const storeData = async <T>(
  key: StorageKeys,
  value: T,
): Promise<ApiResponse<T>> => {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
    return {success: true, data: value};
  } catch (error) {
    console.error('Failed to save data:', error);
    return {
      success: false,
      errorMessage: 'Error al guardar la info: ' + JSON.stringify(error),
    };
  }
};

export const getData = async <T>(key: StorageKeys): Promise<ApiResponse<T>> => {
  try {
    const value = await AsyncStorage.getItem(key);
    if (value !== null) {
      return {success: true, data: JSON.parse(value) as T};
    }
    return {
      success: false,
      errorMessage: 'No info found',
    };
  } catch (error) {
    return {
      success: false,
      errorMessage: 'Error al consultar Storage: ' + JSON.stringify(error),
    };
  }
};
