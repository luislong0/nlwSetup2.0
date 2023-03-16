import { useContext, useEffect } from "react";
import Cookies from "universal-cookie";
import { Header } from "../../components/Header";
import { MobileHeader } from "../../components/MobileHeader";
import { SummaryTable } from "../../components/SummaryTable";
import { UserContext } from "../../contexts/UserContext";

export function Summary() {
  const cookies = new Cookies();
  const token = cookies.get("jwt");

  const { getUserInfo } = useContext(UserContext);

  useEffect(() => {
    getUserInfo(token);
  }, []);

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-5xl px-6 flex flex-col gap-16">
        <Header />
        <MobileHeader />
        <SummaryTable userPage="summary" />
      </div>
    </div>
  );
}
