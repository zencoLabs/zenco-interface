import { Box, ClickAwayListener, Popper, styled, Tooltip } from '@mui/material';
import React from 'react';
import { JSXElementConstructor, ReactElement, ReactNode, useState } from 'react';

interface ContentWithTooltipProps {
  children: ReactNode;
  // eslint-disable-next-line
  tooltipContent: ReactNode;
  placement?: 'top' | 'bottom';
  withoutHover?: boolean;
  open?: boolean;
  setOpen?: (value: boolean) => void;
  offset?: [number, number];
}

// const PopperComponent = styled(Popper)(
//   experimental_sx({
//     '.MuiTooltip-tooltip': {
//       color: 'text.primary',
//       backgroundColor: 'background.paper',
//       p: 0,
//       borderRadius: '6px',
//       boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 10px rgba(0, 0, 0, 0.1)',
//       maxWidth: '280px',
//     },
//     '.MuiTooltip-arrow': {
//       color: 'background.paper',
//       '&:before': {
//         boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.2), 0px 2px 10px rgba(0, 0, 0, 0.1)',
//       },
//     },
//   })
// );
const PopperComponent = styled(Popper)(({ theme }) => ({
      '.MuiTooltip-tooltip': {
      color: 'text.primary',
      backgroundColor: '#312f5c',
      p: 0,
      borderRadius: '6px',
      boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.3), 0px 2px 10px rgba(0, 0, 0, 0.2)',
      maxWidth: '280px',
    },
    '.MuiTooltip-arrow': {
     
      color: '#312f5c',
      '&:before': {
        boxShadow: '0px 0px 2px rgba(0, 0, 0, 0.3), 0px 2px 10px rgba(0, 0, 0, 0.2)',
      },
    },

}))

export const ContentWithTooltip = ({
  children,
  tooltipContent,
  placement = 'top',
  withoutHover,
  open,
  setOpen,
  offset,
}: ContentWithTooltipProps) => {
  const [openTooltip, setOpenTooltip] = useState(false);

  const formattedOpen = typeof open !== 'undefined' ? open : openTooltip;
  const toggleOpen = () =>
    typeof setOpen !== 'undefined' ? setOpen(!formattedOpen) : setOpenTooltip(!formattedOpen);
  const handleClose = () =>
    typeof setOpen !== 'undefined' ? setOpen(false) : setOpenTooltip(false);

  return (
    <Tooltip  sx={{
        
    }}
      open={formattedOpen}
      onClose={handleClose}
      disableFocusListener
      disableHoverListener
      disableTouchListener
      placement={placement}
       PopperComponent={PopperComponent}
      componentsProps={{
        popper: {
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: offset ?? [],
              },
            },
          ],
          onClick: (e) => {
            e.stopPropagation();
          },
        },
      }}
      title={
        <ClickAwayListener
          mouseEvent="onMouseDown"
          touchEvent="onTouchStart"
          onClickAway={handleClose}
        >
          <Box
            sx={{ 
              background:'#312f5c',
              py: 4,
              px: 6,
              fontSize: '12px',
              lineHeight: '16px',
              a: {
                fontSize: '12px',
                lineHeight: '16px',
                fontWeight: 500,
                '&:hover': { textDecoration: 'underline' },
              },
           color:'text.primary'
            }}
          >
            {tooltipContent}
          </Box>
        </ClickAwayListener>
      }
      arrow
    >
      <Box
        sx={{
          display: 'inline-flex',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          '&:hover': { opacity: withoutHover ? 1 : formattedOpen ? 1 : 0.5 },
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleOpen();
        }}
      >
        {children}
      </Box>
    </Tooltip>
  );
};
