import { zodResolver } from "@hookform/resolvers/zod";
import * as Dialog from "@radix-ui/react-dialog";
import { AxiosError } from "axios";
import { MagnifyingGlass, UserPlus, X } from "phosphor-react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { UserContext } from "../contexts/UserContext";
import { api } from "../lib/axios";
import { errorNotification } from "./Notifiers/Error";
import { successNotification } from "./Notifiers/Success";

const followUserFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O usuário precisa ter pelo menos 3 letras!" })
    .transform((name) => name.toLowerCase()),
});

type FollowUserFormData = z.infer<typeof followUserFormSchema>;

export function FollowUserModal() {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FollowUserFormData>({
    resolver: zodResolver(followUserFormSchema),
  });

  const { userInfo, toggleFollowUserByModal } = useContext(UserContext);

  async function handleFollowUser(data: FollowUserFormData) {
    console.log(data.name);

    try {
      const searchUserIdResponse = await api.get(`/users`, {
        params: {
          name: data.name,
        },
      });

      console.log("searchUserIdResponse: ", searchUserIdResponse);

      const followingUserId = searchUserIdResponse.data.id;

      const createFollowResponse = await api.post(
        `/users/${userInfo.id}/relationships`,
        {
          following_user_id_data: followingUserId,
          search_user_name: data.name,
        }
      );

      console.log(createFollowResponse)
      toggleFollowUserByModal()
      successNotification("Usuário adicionado com sucesso!")

    } catch (error) {
      if (error instanceof AxiosError) {
        // throw error
        errorNotification(error.response?.data.message);
      }
    }

    // const createFollowResponse = await api.post(
    //   `/users/${userInfo.id}/relationships`, {
    //     following_user_id_data: "cle8iu8hb0000vw6wr72peqyw"
    //   }
    // );

    // console.log(createFollowResponse.data);

    reset()
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger
        type="button"
        className="flex w-full py-2 px-4 items-center mt-6 bg-violet-500 justify-center gap-2 rounded font-semibold transition-colors hover:bg-violet-600"
      >
        <UserPlus size={18} weight="bold" />
        Adicionar
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="w-screen h-screen bg-black/80 fixed inset-0" />

        <Dialog.Content className="absolute p-10 bg-zinc-900 rounded-2xl w-full max-w-sm top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <Dialog.Close className="absolute right-6 top-6 text-zinc-400 rounded-lg hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background">
            <X size={24} aria-label="Fechar" />
          </Dialog.Close>

          <Dialog.Title className="text-2xl leading-tight text-white font-extrabold">
            Adicionar usuário
          </Dialog.Title>

          <form className="mt-8" onClick={handleSubmit(handleFollowUser)}>
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-full py-2 px-4 bg-zinc-800 border-violet-500 rounded focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
              {...register("name")}
            />

            
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full py-2 px-4 items-center mt-4 bg-violet-500 justify-center gap-2 rounded font-semibold transition-colors hover:bg-violet-600"
            >
              <UserPlus size={18} weight="bold" />
              Adicionar
            </button>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
