import { createContext, ReactNode, useEffect, useState } from "react";

import { UserDTO } from "@/dtos/UserDTO";
import { api } from "@/services/api";
import {
  storageAuthTokenUserGet,
  storageAuthTokenUserRemove,
  storageAuthTokenUserSave,
} from "@/storage/storageAuthTokenUser";
import {
  storageUserGet,
  storageUserRemove,
  storageUserSave,
} from "@/storage/storageUser";

export type AuthContextDataProps = {
  user: UserDTO;
  isLoadingUserStorageData: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  updateUserProfile: (userUpdated: UserDTO) => Promise<void>;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextDataProps>(
  {} as AuthContextDataProps,
);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [user, setUser] = useState<UserDTO>({} as UserDTO);
  const [isLoadingUserStorageData, setIsLoadingUserStorageData] =
    useState(true);

  const userAndTokenUpdate = async (userData: UserDTO, token: string) => {
    try {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data } = await api.post("/sessions", { email, password });

      if (data.user && data.token && data.refresh_token) {
        setIsLoadingUserStorageData(true);
        await storageUserSave(data.user);
        await storageAuthTokenUserSave(data.token, data.refresh_token);

        userAndTokenUpdate(data.user, data.token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  };

  const signOut = async () => {
    try {
      setIsLoadingUserStorageData(true);
      setUser({} as UserDTO);

      await storageUserRemove();
      await storageAuthTokenUserRemove();
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  };

  const updateUserProfile = async (userUpdated: UserDTO) => {
    try {
      setUser(userUpdated);

      await storageUserSave(userUpdated);
    } catch (error) {
      throw error;
    }
  };

  const loadUserData = async () => {
    try {
      setIsLoadingUserStorageData(true);

      const userLogged = await storageUserGet();
      const { token } = await storageAuthTokenUserGet();

      if (token && userLogged) {
        userAndTokenUpdate(userLogged, token);
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoadingUserStorageData(false);
    }
  };

  useEffect(() => {
    loadUserData();
  }, []);

  useEffect(() => {
    const subscribe = api.registerInterceptTokenManager(signOut);

    return () => {
      subscribe();
    };
  }, [signOut]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoadingUserStorageData,
        signIn,
        signOut,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
