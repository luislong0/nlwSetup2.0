import * as Dialog from "@radix-ui/react-dialog";
import { Plus, X } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import Cookies from "universal-cookie";

import logoImage from "../assets/logo.svg";
import { UserContext } from "../contexts/UserContext";
import { api } from "../lib/axios";
import { AvatarImg } from "./AvatarImg";
import { FriendsBtn } from "./FriendsBtn";
import { NewHabitForm } from "./NewHabitForm";
import { SearchBtn } from "./SeachBtn";

export function Header() {
  const { userInfo } = useContext(UserContext);

  return (
    <div className="w-full max-w-5xl mx-auto flex items-center justify-between ">
      <img src={logoImage} alt="Habits" />
      <div className="flex items-center gap-6">
        <Dialog.Root>
          <Dialog.Trigger
            type="button"
            className="border border-violet-500 font-semibold rounded-lg px-6 py-4 flex items-center gap-3 hover:border-violet-300 transition-all focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background"
          >
            <Plus size={20} weight="bold" className="text-violet-500" />
            Novo hábito
          </Dialog.Trigger>

          <Dialog.Portal>
            <Dialog.Overlay className="w-screen h-screen bg-black/80 fixed inset-0" />

            <Dialog.Content className="absolute p-10 bg-zinc-900 rounded-2xl w-full max-w-md top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              <Dialog.Close className="absolute right-6 top-6 text-zinc-400 rounded-lg hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background">
                <X size={24} aria-label="Fechar" />
              </Dialog.Close>

              <Dialog.Title className="text-3xl leading-tight text-white font-extrabold">
                Criar hábito
              </Dialog.Title>

              <NewHabitForm />
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>

        <SearchBtn />
        <FriendsBtn userInfoId={userInfo.id} />
        <AvatarImg photoUrl={userInfo.photoUrl} />
      </div>
    </div>
  );
}
