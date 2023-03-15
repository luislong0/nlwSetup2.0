import { GoogleAuthProvider, signInWithPopup, UserInfo } from "firebase/auth";
import { GoogleLogo } from "phosphor-react";
import { useEffect, useState } from "react";
import logoImg from "../../../assets/logo.svg";
import { api } from "../../../lib/axios";
import { auth, provider } from "../../../lib/firebase";
import Cookies from "universal-cookie";
import { Navigate } from "react-router-dom";

interface UserInfoProps {
  googleId: string;
  displayName: string;
  email: string;
  photoURL: string;
}

export function LoginBox() {
  const cookies = new Cookies();

  const [userInfo, setUserInfo] = useState<UserInfoProps>({} as UserInfoProps);
  const [hasLogged, setHasLogged] = useState<boolean>(false);

  async function signInWithGoogle() {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential?.accessToken;
        const googleId = credential?.idToken;
        console.log({
          token,
        });

        const { displayName, email, photoURL }: UserInfo = result.user;

        createOrSignIn({
          googleId: googleId!,
          displayName: displayName!,
          email: email!,
          photoURL: photoURL!,
        });
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  }

  async function createOrSignIn(data: UserInfoProps) {
    try {
      const accessToken = await api.post("/users", {
        name: data.displayName,
        email: data.email,
        googleId: data.googleId,
        avatarUrl: data.photoURL,
      });

      cookies.set("jwt", accessToken.data.token, {
        path: "/",
        maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
      });

      setHasLogged(true);
      // window.location.reload();

      // if (accessToken.data.token) {
      //   successNotification("Usuario logado com sucesso!");
      //   setCookieToken(cookies.get("jwt"));
      //   setHasLogged(true);
      // } else {
      //   errorNotification("Erro ao realizar o login do usuario!");
      // }
    } catch (err) {
      // errorNotification("Erro ao realizar o login do usuario!");
      throw err;
    }
  }
  const token = cookies.get("jwt");

  return (
    <div className="flex flex-col items-center w-80 bg-zinc-900 border-2 border-violet-600 opacity-100 px-4 py-8 rounded-md gap-6">
      {hasLogged || token ? <Navigate to="/summary" /> : <></>}
      <img src={logoImg} alt="Habits Logo" className="w-40" />
      <h2 className="text-lg text-zinc-300 font-bold text-center">
        Olá, realize o login com o Google para poder cadastrar e controlar seus
        hábitos!
      </h2>
      <button
        onClick={signInWithGoogle}
        className="w-full py-3 px-4 flex justify-around items-center font-semibold bg-violet-600 border-2 border-violet-500 rounded-md transition-colors hover:bg-violet-500 hover:border-violet-400 "
      >
        <GoogleLogo size={18} weight="bold" />
        Logar com o Google
      </button>
    </div>
  );
}
