import { SpaceUserInfo2 } from "@/src/libs/model";
import { formatTimestamp, getUserAvatar, textCenterEllipsis } from "@/src/utils/text-center-ellipsis";
import { Avatar, Box, Typography } from "@mui/material";
import React, { ReactNode } from "react";

interface CreateInfo {
    blockTimestamp?: number;
    sender: string;
    spaceUserInfo?: SpaceUserInfo2;
    imgWidth?: number;
    showSpaceId?: boolean;
    handleClick?: () => void;
    MoreBox?: ReactNode
}

export const BlogUser2 = ({ sender,
    blockTimestamp,
    spaceUserInfo,
    imgWidth,
    showSpaceId,
    handleClick,
    MoreBox
}: CreateInfo) => {

    const { avatar, spacename } = getUserAvatar(sender, spaceUserInfo) 

    return <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }}
            component={'div'}
            onClick={() => { handleClick && handleClick() }}
        >
            {
                showSpaceId && (
                    <Typography variant={'main16'} sx={{
                        mr: 2,
                    }}>
                        #{spaceUserInfo?.spaceId}
                    </Typography>
                )
            }

            <Avatar sx={{ width: !imgWidth ? '36px' : `${imgWidth}px`, height: !imgWidth ? '36px' : `${imgWidth}px`, }} alt={spacename} src={avatar} />
            <Box sx={{ ml: 2 }}>
                <Typography variant={'main16'}>
                    {spacename}
                </Typography>
                <Typography variant={'secondary14'} color={'text.secondary'}>
                    {textCenterEllipsis(sender, 4, 4)}
                </Typography>
            </Box>
        </Box>
        <Box sx={{
            display:'flex',
            alignItems:'center',
            gap:3
        }}>
            {
                blockTimestamp && (
                    <Box>
                        <Typography variant={'secondary14'} color={'text.secondary'}>{formatTimestamp(blockTimestamp)}</Typography>
                    </Box>
                )
            }
            {
                MoreBox && (
                    <Box>
                        {MoreBox}
                    </Box>
                )
            }
        </Box>

    </>
}