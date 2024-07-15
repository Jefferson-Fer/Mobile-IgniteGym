import AsyncStorage from "@react-native-async-storage/async-storage";

import { USER_TOKEN_STORAGE } from "./storageConfig";

type StorageAuthTokenProps = {
  token: string;
  refreshToken: string;
};

export const storageAuthTokenUserSave = async (
  token: string,
  refreshToken: string,
) => {
  await AsyncStorage.setItem(
    USER_TOKEN_STORAGE,
    JSON.stringify({ token, refreshToken }),
  );
};

export const storageAuthTokenUserGet = async () => {
  const response = await AsyncStorage.getItem(USER_TOKEN_STORAGE);

  const { token, refreshToken }: StorageAuthTokenProps = response
    ? JSON.parse(response)
    : {};

  return { token, refreshToken };
};

export const storageAuthTokenUserRemove = async () => {
  await AsyncStorage.removeItem(USER_TOKEN_STORAGE);
};
