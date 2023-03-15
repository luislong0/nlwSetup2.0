import dayjs from "dayjs";
import { CaretLeft, Check, UserPlus } from "phosphor-react";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AvatarImg } from "../../../components/AvatarImg";
import { UserContext } from "../../../contexts/UserContext";
import { api } from "../../../lib/axios";
import { NavLink } from "react-router-dom";
import { successNotification } from "../../../components/Notifiers/Success";
import { AxiosError } from "axios";
import { errorNotification } from "../../../components/Notifiers/Error";

interface SearchUserHeaderProps {
  userId?: string;
}

type relationshipUsersProps = {
  User: {
    id: string;
    name: string;
  };
  following_user_id: string;
  id: string;
  user_id: string;
};

interface UserProps {
  id: string;
  name: string;
  photoUrl: string;
  bio?: string;
  createdAt: string;
}

export function SearchUserHeader({ userId }: SearchUserHeaderProps) {
  const [user, setUser] = useState<UserProps>({} as UserProps);
  const [isFollowing, setIsFollowing] = useState(false);
  const { userInfo } = useContext(UserContext);

  let { id } = useParams();
  console.log(id);

  async function getUserData() {
    const userData = await api.get(`/users/${userId}`);
    console.log(userData.data);
    setUser(userData.data);

    const getRelationShipData = await api.get(
      "/users/cle4j6f9l0000vwhkicx6n1el/relationships"
    );

    getRelationShipData.data.map((relationship: relationshipUsersProps) => {
      if (relationship.User.id === id) {
        console.log("following");
        setIsFollowing(true);
      }
    });
  }

  async function toggleFollowUser(following_user_id: string) {
    console.log("UserINFO ", userInfo);
    console.log(following_user_id);

    try {
      await api.patch(
      `http://localhost:3333/users/${userInfo.id}/relationships`,
      {
        following_user_id_data: following_user_id,
      }
    );

    setIsFollowing(!isFollowing);

    if (isFollowing === true) {
      successNotification(`Você parou de seguir ${user.name}`);
    } else {
      successNotification(`Você começou a seguir ${user.name}`);
    }
    } catch (error) {
      if (error instanceof AxiosError) {
        errorNotification(error.response?.data.error);
      }
    }
  }

  const formattedDate = dayjs(user.createdAt).format("DD/MM/YYYY");

  useEffect(() => {
    getUserData();
    console.log(user.id);
  }, [id, isFollowing]);

  return (
    <div className="flex flex-col justify-center items-center">
      <NavLink
        to="/summary"
        className="flex items-center font-semibold text-zinc-400 mr-auto transition-colors hover:text-zinc-100"

      >
        <CaretLeft size={18} weight="bold" />
        Voltar
      </NavLink>
      <AvatarImg photoUrl={user.photoUrl} />
      <div className="flex flex-col gap-1 justify-center items-center mt-4">
        <h2 className="text-zinc-100 text-xl font-semibold mb-2">
          {user.name}
        </h2>
        {user.bio && <code className="text-zinc-500">{user.bio}</code>}

        <code className="text-zinc-500 text-sm">Since {formattedDate}</code>

        {user.id !== userInfo.id && isFollowing === false ? (
          <button
            onClick={() => toggleFollowUser(id!)}
            className="bg-violet-600 flex items-center gap-2 py-2 px-4 mt-2 text-sm font-semibold rounded-lg transition-colors hover:bg-violet-500"
          >
            <UserPlus size={14} weight="bold" />
            Seguir
          </button>
        ) : (
          <></>
        )}

        {user.id !== userInfo.id && isFollowing === true ? (
          <button
            onClick={() => toggleFollowUser(id!)}
            className="bg-violet-600 flex items-center gap-2 py-2 px-4 mt-2 text-sm font-semibold rounded-lg transition-colors hover:bg-violet-500"
          >
            <Check size={14} weight="bold" />
            Seguindo
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
