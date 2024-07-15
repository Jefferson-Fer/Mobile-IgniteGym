import axios, { AxiosError, AxiosInstance } from "axios";

import {
  storageAuthTokenUserGet,
  storageAuthTokenUserSave,
} from "@/storage/storageAuthTokenUser";
import { AppError } from "@/utils/AppErros";

type SignOut = () => void;

type PromiseType = {
  onSuccess: (token: string) => void;
  onFailure: (error: AxiosError) => void;
};

type APIInstanceProps = AxiosInstance & {
  registerInterceptTokenManager: (signOut: SignOut) => () => void;
};

const api = axios.create({
  baseURL: "http://192.168.0.7:3333",
}) as APIInstanceProps;

let failedQueue: PromiseType[] = [];
let isRefresh = false;

api.registerInterceptTokenManager = (signOut) => {
  const interceptTokenManager = api.interceptors.response.use(
    (response) => response,
    async (requestError) => {
      if (requestError?.response?.status === 401) {
        if (
          requestError.response.data?.message === "token.expired" ||
          requestError.response.data?.message === "token.invalid"
        ) {
          const { refreshToken, token } = await storageAuthTokenUserGet();

          if (!refreshToken) {
            signOut();
            return Promise.reject(requestError);
          }

          const originalRequestConfig = requestError.config;

          if (isRefresh) {
            return new Promise((resolve, reject) => {
              failedQueue.push({
                onSuccess: (token: string) => {
                  originalRequestConfig.headers = {
                    Authorization: `Bearer ${token}`,
                  };
                  resolve(api(originalRequestConfig));
                },
                onFailure: (error: AxiosError) => {
                  reject(error);
                },
              });
            });
          }

          isRefresh = true;

          return new Promise(async (resolve, reject) => {
            try {
              console.log("refreshToken => ", refreshToken);
              console.log("token => ", token);
              const { data } = await api.post("/sessions/refresh-token", {
                token,
              });

              await storageAuthTokenUserSave(data.token, data.refresh_token);

              if (originalRequestConfig.data) {
                originalRequestConfig.data = JSON.parse(
                  originalRequestConfig.data,
                );
              }

              originalRequestConfig.headers = {
                Authorization: `Bearer ${data.token}`,
              };
              api.defaults.headers.common["Authorization"] =
                `Bearer ${data.token}`;

              failedQueue.forEach((request) => {
                request.onSuccess(data.token);
              });

              console.log("TOKEN ATUALIZADO");

              resolve(api(originalRequestConfig));
            } catch (error: any) {
              failedQueue.forEach((request) => {
                request.onFailure(error);
              });

              signOut();
              reject(error);
            } finally {
              isRefresh = false;
              failedQueue = [];
            }
          });
        }

        signOut();
      }

      if (requestError.response && requestError.response.data) {
        return Promise.reject(new AppError(requestError.response.data.message));
      } else {
        return Promise.reject(requestError);
      }
    },
  );

  return () => {
    api.interceptors.response.eject(interceptTokenManager);
  };
};

export { api };
