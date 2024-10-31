import { Button, List, ListItem, ListItemIcon, ListItemText, Typography, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import * as React from 'react';
import HomeIcon from '@mui/icons-material/Home';
import ExploreIcon from '@mui/icons-material/Explore';
import MessageIcon from '@mui/icons-material/Message';

interface NavItemsProps {
  setOpen?: (value: boolean) => void;
}


export const NavItems = ({ setOpen }: NavItemsProps) => {

  return (
    <List
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '10px',
      }}
      disablePadding
    >
      <ListItem
        sx={{
          width: { xs: '100%', md: 'unset' },
          mr: { xs: 0, md: 2 },
        }}
        disablePadding
      >
        <Link href={'/'} style={{ display: 'flex', textDecoration: 'none' }}>
          <ListItemIcon>
            <HomeIcon fontSize="medium" sx={{
              color: "text.primary"
            }} />
          </ListItemIcon>
          <ListItemText primary="Trending" sx={{
            color: "text.primary",
            fontSize: '0.985rem'
          }} />
        </Link>
      </ListItem>

      <ListItem
        sx={{
          width: { xs: '100%', md: 'unset' },
          mr: { xs: 0, md: 2 },
        }}
        disablePadding
      >
        <Link href={'/space'} style={{ display: 'flex', textDecoration: 'none' }}>
          <ListItemIcon>
            <ExploreIcon fontSize="medium" sx={{
              color: "text.primary"
            }} />
          </ListItemIcon>
          <ListItemText primary="Spaces" sx={{
            color: "text.primary",
            fontSize: '0.985rem'
          }} />
        </Link>
      </ListItem> 

    </List>
  );
};
