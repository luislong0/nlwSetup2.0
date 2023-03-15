import * as Avatar from "@radix-ui/react-avatar";
import { User } from "phosphor-react";

interface AvatarImgProps {
  photoUrl: string;
}

export function AvatarImg(props: AvatarImgProps) {
  return (
    // <>
    //   <Avatar.Root className="w-16">
    //     <Avatar.Image
    //       src={props.photoUrl}
    //       alt="Avatar photo"
    //       className="rounded-full p-[2px] border border-violet-500"
    //       referrerPolicy="no-referrer"
    //     />
    //     <Avatar.Fallback delayMs={5000}>
    //       <User
    //         size={18}
    //         className="w-14 h-full bg-zinc-600 p-3 rounded-full border-violet-500 outline-none ring-1 ring-violet-500 ring-offset-2 ring-offset-background"
    //       />
    //     </Avatar.Fallback>
    //   </Avatar.Root>
    // </>
    <img
      src={props.photoUrl}
      alt="Avatar photo"
      className="w-16 rounded-full p-[2px] border border-violet-500"
      referrerPolicy="no-referrer"
    />
  );
}
