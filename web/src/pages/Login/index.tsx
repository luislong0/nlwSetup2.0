import { LoginBox } from "./components/LoginBox";

export function Login() {
  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-screen h-screen bg-[url('./src/assets/loginBackground.png')] bg-contain bg-no-repeat bg-center absolute opacity-30 -z-10" />
      <LoginBox />
    </div>
  );
}
