import { SpaceUserInfo2 } from "@/src/libs/model";
import { getUserAvatar } from "@/src/utils/text-center-ellipsis";
import { Avatar } from "@mui/material";
import React from "react";

interface CreateInfo { 
    sender: string;
    spaceUserInfo?: SpaceUserInfo2;
    imgWidth?: number; 
}

export const UserAvatar = ({ 
    sender, 
    spaceUserInfo,
    imgWidth, 
}: CreateInfo) => {

    const { avatar, spacename } = getUserAvatar(sender, spaceUserInfo)
  
    return (
        <Avatar sx={{ width: !imgWidth ? '36px' : `${imgWidth}px`, height: !imgWidth ? '36px' : `${imgWidth}px`, }} alt={spacename} src={avatar} />
    )
}