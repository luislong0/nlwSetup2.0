import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Cookies from "universal-cookie";
import { SummaryTable } from "../../components/SummaryTable";
import { UserContext } from "../../contexts/UserContext";
import { api } from "../../lib/axios";
import { SearchUserHeader } from "./Components/SearchUserHeader";

export function SearchUser() {
  const cookies = new Cookies();
  const token = cookies.get("jwt");

  const { getUserInfo } = useContext(UserContext);

  useEffect(() => {
    getUserInfo(token);
  }, []);

  let { id } = useParams();

  return (
    <div className="w-screen h-screen flex justify-center items-center">
      <div className="w-full max-w-5xl px-6 flex flex-col gap-10">
        <SearchUserHeader userId={id} />
        <SummaryTable userPage="searchUser" searchUserId={id} />
      </div>
    </div>
  );
}
