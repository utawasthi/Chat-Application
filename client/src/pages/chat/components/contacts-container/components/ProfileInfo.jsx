import { getColor } from "@/lib/utils";
import { useAppStore } from "@/store"
import { HOST } from "@/utils/constants";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar"
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"

const ProfileInfo = () => {
  const { userInfo } = useAppStore();

  return (
    <div className='absolute bottom-0 h-16 flex items-center justify-between px-10 w-full bg-[#2a2b33]'>
      <div className="flex gap-3 items-center justify-center">
        <div className='w-12 h-12 relative'>
          <Avatar className="h-32 w-32 md:h-48 md:w-48 rounded-full overflow-hidden">
            {
              image ? (
                <AvatarImage
                  src={`${HOST}/${userInfo.image}`}
                  alt="profile"
                  className="object-cover w-full h-full bg-black"
                />
              ) : (
                <div className={`uppercase h-12 w-12 text-lg border-[1px] flex items-center justify-center rounded-full text-white ${getColor(userInfo.color)}`}>
                  {
                    userInfo.firstName ?
                      userInfo.firstName.split("").shift() :
                      userInfo.email.split("").shift()
                  }
                </div>
              )
            }
          </Avatar>
        </div>
        <div>
          {
            userInfo.firstName && userInfo.lastName ? `${userInfo.firstName}` `${userInfo.lastName}` : ""
          }
        </div>
      </div>
      <div className='flex gap-5'>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>Hover</TooltipTrigger>
            <TooltipContent>
              <p>Add to library</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  )
}

export default ProfileInfo