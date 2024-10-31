import { Box, IconButton, Menu, MenuItem, SvgIcon } from "@mui/material"
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { useState } from "react"; 
import { SpaceFactoryUser } from "@/src/libs/model";

export const SpaceInfoMore = ({
    spaceUser
}: {
    spaceUser?: SpaceFactoryUser;
}) => {
  
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
 
    return (
        <Box>
            <IconButton
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    p: 0,
                    minWidth: 0,
                }}
                onClick={handleClick}
            >
                <SvgIcon
                    sx={{
                        fontSize: 18,
                        color: open ? 'info.main' : 'text.muted',
                        borderRadius: '50%',
                        '&:hover': 'info.main'
                    }}
                >
                    <MoreHorizIcon fontSize="medium" sx={{
                        color: '#d7e2e3',
                    }} />
                </SvgIcon>
            </IconButton>


            <Menu
                id="withdraw-item-extra-menu"
                anchorEl={anchorEl}
                open={open}
                // MenuListProps={{
                //   'aria-labelledby': 'supply-extra-button',
                //   sx: {
                //     py: 0,
                //   },
                // }}
                onClose={handleClose}
                keepMounted={true}
                PaperProps={{
                    sx: {
                        minWidth: '120px',
                        py: 0,
                    },
                }}
                sx={{ 
                    '& .MuiMenu-paper': {
                        backgroundColor: '#2e2c56',
                        boxShadow: "3px 3px 2px #1e1d35"
                    },
                }}
            >

                <MenuItem
                    sx={{ gap: 2 }}
                >
                    test 
                </MenuItem>
                <MenuItem
                    sx={{ gap: 2 }}
                >
                 test 
                </MenuItem>
            </Menu>

        </Box>
    )

}