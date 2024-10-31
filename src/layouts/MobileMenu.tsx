import {
  Box,
  Button,
  Divider,
  IconButton,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  SvgIcon,
  Typography,
} from '@mui/material';
import React, { ReactNode} from 'react';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import { DrawerWrapper } from './components/DrawerWrapper';
import { NavItems } from './components/NavItems';
import XIcon from '@mui/icons-material/X';
import GitHubIcon from '@mui/icons-material/GitHub';
import { toastInfo } from '../libs/toastAlert';

interface MobileMenuProps {
  open: boolean;
  setOpen: (value: boolean) => void;
  headerHeight: number;
}

const MenuItemsWrapper = ({ children, title }: { children: ReactNode; title: ReactNode }) => (
  <Box sx={{ mb: 6, '&:last-of-type': { mb: 0, '.MuiDivider-root': { display: 'none' } } }}>
    <Box sx={{ px: 2 }}>
      <Typography variant="subheader2" sx={{ color: '#9CA0A8', px: 4, py: 2 }}>
        {title}
      </Typography>

      {children}
    </Box>

    <Divider sx={{ borderColor: '#F2F3F729', mt: 6 }} />
  </Box>
);

export const MobileMenu = ({ open, setOpen, headerHeight }: MobileMenuProps) => {

  return (
    <>
      {open ? (

        <IconButton onClick={() => setOpen(false)} sx={{ p: 0, mr: { xs: -2, xsm: 1 } }}>
          <SvgIcon sx={{ color: '#F1F1F3', fontSize: '32px' }}>
            <CloseIcon />
          </SvgIcon>
        </IconButton>
      ) : (
        <Button className='menu-btn'
          variant="surface"
          sx={{ p: '7px 8px', minWidth: 'unset', ml: 2 }}
          onClick={() => setOpen(true)}
        >
          <SvgIcon sx={{ color: '#F1F1F3' }} fontSize="small">
            <MenuIcon />
          </SvgIcon>
        </Button>
      )}

      <DrawerWrapper open={open} setOpen={setOpen} headerHeight={headerHeight}>

        <>
          <MenuItemsWrapper title={<span>Menu</span>}>
            <NavItems setOpen={setOpen} />
          </MenuItemsWrapper>

          <MenuItemsWrapper title={<span>Global settings</span>}>
            <List> 

              <ListItemText sx={{color:'text.secondary'}}>
                <>Coming soon</>
              </ListItemText>
            </List>
          </MenuItemsWrapper>

          <MenuItemsWrapper title={<span>Links</span>}>
            <List>

              <ListItem component={Link} target='_blank' href={'https://x.com/ZencoSpace'} sx={{ color: '#F1F1F3' }}>
                <ListItemIcon sx={{ minWidth: 'unset', mr: 3 }}>
                  <SvgIcon sx={{ fontSize: '20px', color: '#F1F1F3' }}>
                    <XIcon />
                  </SvgIcon>
                </ListItemIcon>
                <ListItemText>Twitter</ListItemText>
              </ListItem>

              <ListItem component={Link} target='_blank' href={'https://discord.gg/anxkqrJm'} sx={{ color: '#F1F1F3' }}>
                <ListItemIcon sx={{ minWidth: 'unset', mr: 3 }}>
                  <SvgIcon sx={{ fontSize: '20px', color: '#F1F1F3' }}>
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1897" id="mx_n_1722125676534" width="18" height="18">
                      <path d="M658.432 486.4c0 31.232-23.04 56.832-52.224 56.832-28.672 0-52.224-25.6-52.224-56.832s23.04-56.832 52.224-56.832c29.184 0 52.224 25.6 52.224 56.832z m-239.104-56.832c-29.184 0-52.224 25.6-52.224 56.832s23.552 56.832 52.224 56.832c29.184 0 52.224-25.6 52.224-56.832 0.512-31.232-23.04-56.832-52.224-56.832zM960 105.472V1024c-128.988-113.988-87.736-76.256-237.568-215.552l27.136 94.72H168.96C111.104 903.168 64 856.064 64 797.696V105.472C64 47.104 111.104 0 168.96 0h686.08C912.896 0 960 47.104 960 105.472z m-145.92 485.376c0-164.864-73.728-298.496-73.728-298.496-73.728-55.296-143.872-53.76-143.872-53.76l-7.168 8.192c87.04 26.624 127.488 65.024 127.488 65.024-121.622-66.658-264.488-66.67-382.464-14.848-18.944 8.704-30.208 14.848-30.208 14.848s42.496-40.448 134.656-67.072l-5.12-6.144s-70.144-1.536-143.872 53.76c0 0-73.728 133.632-73.728 298.496 0 0 43.008 74.24 156.16 77.824 0 0 18.944-23.04 34.304-42.496-65.024-19.456-89.6-60.416-89.6-60.416 7.532 5.272 19.952 12.106 20.992 12.8 86.42 48.396 209.176 64.252 319.488 17.92 17.92-6.656 37.888-16.384 58.88-30.208 0 0-25.6 41.984-92.672 60.928 15.36 19.456 33.792 41.472 33.792 41.472 113.152-3.584 156.672-77.824 156.672-77.824z"
                        fill="#F9FFFE" p-id="1898"></path></svg>
                  </SvgIcon>
                </ListItemIcon>
                <ListItemText>Discord</ListItemText>
              </ListItem>

              <ListItem component={Link} href={'#'} onClick={() => {
                toastInfo(false, ' Coming soon!')
              }} sx={{ color: '#F1F1F3' }}>
                <ListItemIcon sx={{ minWidth: 'unset', mr: 3 }}>
                  <SvgIcon sx={{ fontSize: '20px', color: '#F1F1F3' }}>
                    <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3062" width="20" height="20"><path d="M512 0C229.205333 0 0 229.205333 0 512s229.205333 512 512 512 512-229.205333 512-512S794.794667 0 512 0z m-16.768 735.573333a23.978667 23.978667 0 0 0-23.722667-24.234666 24.021333 24.021333 0 0 0-23.68 24.234666 23.978667 23.978667 0 0 0 23.68 24.234667 24.021333 24.021333 0 0 0 23.722667-24.234667z m324.949333-198.698666a23.978667 23.978667 0 0 0 23.68 24.234666 24.064 24.064 0 0 0 23.722667-24.192 23.978667 23.978667 0 0 0-23.68-24.277333 24.021333 24.021333 0 0 0-23.722667 24.234667z m-49.706666 0c0-41.386667 32.938667-75.093333 73.429333-75.093334 40.490667 0 73.429333 33.706667 73.429333 75.093334 0 41.429333-32.938667 75.093333-73.429333 75.093333-16.341333 0-32.341333-5.632-45.141333-15.914667l-253.781334 140.629334c-0.64 40.917333-33.322667 73.984-73.472 73.984-36.48 0-67.413333-27.52-72.618666-64.341334l-230.4-121.514666c-37.845333-20.309333-64.341333-75.648-61.653334-128.725334 1.792-33.493333 15.232-60.458667 36.992-74.026666 12.16-7.509333 225.621333-115.626667 385.109334-196.266667l8.533333-4.352c4.394667-2.816 29.013333-16.64 59.605333-0.213333 35.413333 18.986667 116.138667 57.6 187.306667 91.690666l1.408 0.64c32.853333 15.786667 66.389333 31.829333 88.32 42.581334 0 0 11.946667 4.650667 11.946667 16.426666 0 8.533333-6.656 14.165333-12.373334 16.384l-390.656 207.786667c-20.906667 10.112-27.733333 7.722667-39.978666 1.962667-8.021333-3.797333-196.992-105.6-254.72-136.704l-1.450667-0.768c-7.68-4.138667-14.933333-4.437333-20.906667-0.938667-9.472 5.504-15.701333 19.84-16.64 38.229333-1.834667 35.285333 15.402667 74.069333 38.4 86.442667l217.941334 117.504a73.386667 73.386667 0 0 1 65.834666-41.984c24.149333 0 46.506667 12.032 60.288 32.341333l242.56-132.053333c-2.56-7.68-3.84-15.786667-3.882666-23.893333z"
                      fill="#F9FFFE" p-id="3063"></path></svg>

                  </SvgIcon>
                </ListItemIcon>
                <ListItemText>Docs</ListItemText>
              </ListItem>

              <ListItem component={Link} target='_blank' href={'https://github.com/zencoLabs'} sx={{ color: '#F1F1F3' }}>
                <ListItemIcon sx={{ minWidth: 'unset', mr: 3 }}>
                  <SvgIcon sx={{ fontSize: '20px', color: '#F1F1F3' }}>
                    <GitHubIcon />
                  </SvgIcon>
                </ListItemIcon>
                <ListItemText>GitHub</ListItemText>
              </ListItem>

            </List>
          </MenuItemsWrapper>
        </>

      </DrawerWrapper>
    </>
  );
};
