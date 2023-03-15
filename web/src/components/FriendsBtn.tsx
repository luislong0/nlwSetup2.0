import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { UserPlus, Users } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import Cookies from "universal-cookie";
import { UserContext } from "../contexts/UserContext";
import { api } from "../lib/axios";
import { FollowUserModal } from "./FollowUserModal";

type relationshipUsersProps = {
  User: {
    id: string;
    name: string;
  };
  following_user_id: string;
  id: string;
  user_id: string;
}[];

interface FriendsBtnProps {
  userInfoId: string
}

export function FriendsBtn({userInfoId}: FriendsBtnProps) {
  const cookies = new Cookies();
  const token = cookies.get("jwt");

  const { toggleFollowUser } = useContext(UserContext);

  const [relationshipUsers, setRelationshipUsers] =
    useState<relationshipUsersProps>([]);

  async function getRelationships(userId: string) {
    const relationshipsData = await api.get(
      `http://localhost:3333/users/${userId}/relationships`
    );

    setRelationshipUsers(relationshipsData.data);

    console.log("RELATIONSHIP", relationshipsData.data);
  }

  useEffect(() => {
    getRelationships(userInfoId);
  }, [userInfoId, toggleFollowUser]);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger
        type="button"
        className="rounded-lg px-2 py-2 flex items-center gap-3 hover:bg-violet-500 transition-all focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background text-zinc-100"
      >
        <Users size={24} weight="bold" />
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          sideOffset={3}
          className="w-60 bg-zinc-900 p-4 pt-6 rounded-lg"
        >
          <DropdownMenu.Group className="flex flex-col gap-4 max-h-36 scrollbar-thin scrollbar-thumb-violet-500 scrollbar-track-zinc-900 overflow-y-scroll scrollbar-thumb-rounded-full scrollbar-track-rounded-full">
            {relationshipUsers.map((relationshipUser) => {
              return (
                <DropdownMenu.Item
                  key={relationshipUser.User.id}
                  className="text-zinc-300 font-semibold transition-colors hover:outline-none hover:text-zinc-100 cursor-pointer"
                >
                  <NavLink to={`/users/${relationshipUser.User.id}`}>
                    {relationshipUser.User.name}
                  </NavLink>
                </DropdownMenu.Item>
              );
            })}
          </DropdownMenu.Group>
          <DropdownMenu.Arrow className="fill-zinc-900" />
          <DropdownMenu.Separator className="h-[2px] bg-zinc-700 mt-6" />

          <FollowUserModal />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
