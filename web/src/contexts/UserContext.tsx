import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { createContext, ReactNode, useEffect, useState } from "react";
import Cookies from "universal-cookie";
import { api } from "../lib/axios";

interface loggedUserProps {
  id: string;
  email: string;
  name: string;
  photoUrl: string;
}

interface UserContextType {
  userInfo: loggedUserProps;
  toggleFollowUser: boolean;
  getUserInfo: (token: string) => Promise<void>;
  toggleFollowUserByModal: () => void;
}

interface UserContextProviderProps {
  children: ReactNode;
}

export const UserContext = createContext({} as UserContextType);
export function UserContextProvider({ children }: UserContextProviderProps) {
  const [userInfo, setUserInfo] = useState({} as loggedUserProps);
  const [toggleFollowUser, setToggleFollowUser] = useState(false);

  async function getUserInfo(token: string) {
    const user = await api.get("/me", {
      headers: {
        Authorization: `Basic ${token}`,
      },
    });

    setUserInfo(user.data);
    console.log("User info", user);
  }

  async function toggleFollowUserByModal() {
    setToggleFollowUser(!toggleFollowUser);
  }

  return (
    <UserContext.Provider
      value={{
        userInfo,
        getUserInfo,
        toggleFollowUserByModal,
        toggleFollowUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}
