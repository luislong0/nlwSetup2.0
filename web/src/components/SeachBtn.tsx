import * as Popover from "@radix-ui/react-popover";
import { MagnifyingGlass, X } from "phosphor-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "../lib/axios";
import { Navigate, redirect } from "react-router-dom";
import { useState } from "react";
import { AxiosError } from "axios";
import { successNotification } from "./Notifiers/Success";
import { errorNotification } from "./Notifiers/Error";

const searchUserFormSchema = z.object({
  name: z
    .string()
    .min(3, { message: "O usuário precisa ter pelo menos 3 letras!" })
    .transform((name) => name.toLowerCase()),
});

type SearchUserFormData = z.infer<typeof searchUserFormSchema>;

export function SearchBtn() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<SearchUserFormData>({
    resolver: zodResolver(searchUserFormSchema),
  });

  const [findUser, setFindUser] = useState(false);
  const [userId, setUserId] = useState("");

  async function handleSearchUser(data: SearchUserFormData) {
    console.log(data.name);
    try {
      const userResponse = await api.get("/users", {
        params: {
          name: data.name,
        },
      });

      if (userResponse.data) {
        console.log("chegou");
        setUserId(userResponse.data.id);
        setFindUser(true);
        successNotification("Usuário encontrado com sucesso!");
      }
    } catch (error) {
      if (error instanceof AxiosError) {
        errorNotification(error.response?.data.message);
      }
    }
  }

  return (
    <Popover.Root>
      {findUser && <Navigate to={`/users/${userId}`} />}
      <Popover.Trigger
        type="button"
        className="rounded-lg px-2 py-2 flex items-center gap-3 hover:bg-violet-500 transition-all focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background text-zinc-100"
      >
        <MagnifyingGlass size={24} weight="bold" />
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content className="w-64 bg-zinc-900 px-4 pt-1 pb-4 rounded-lg">
          <Popover.Close className="flex text-zinc-400 mt-2 mb-4 rounded-lg ml-auto hover:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-violet-700 focus:ring-offset-2 focus:ring-offset-background">
            <X size={16} aria-label="Fechar" fontWeight="bold" />
          </Popover.Close>
          <Popover.Arrow className="fill-zinc-900" />

          <form onSubmit={handleSubmit(handleSearchUser)}>
            <input
              type="text"
              placeholder="Pesquisar..."
              className="w-full py-2 px-4 bg-zinc-800 border-violet-500 rounded focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-zinc-900"
              {...register("name")}
            />

            <div className="h-[2px] bg-zinc-700 mt-4" />
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex w-full py-2 px-4 items-center mt-4 bg-violet-500 justify-center gap-2 rounded font-semibold transition-colors hover:bg-violet-600"
            >
              <MagnifyingGlass size={18} weight="bold" />
              Seguir
            </button>
          </form>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
