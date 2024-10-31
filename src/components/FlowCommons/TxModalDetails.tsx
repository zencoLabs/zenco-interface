import { Box, Typography } from "@mui/material"; 

export interface TxModalDetailsProps {
  title?: string;
  gasLimit?: string;
  percentage?: boolean;
  children: React.ReactNode;
}

export const TxModalDetails: React.FC<TxModalDetailsProps> = ({ title,children }) => {
  return (
    <Box sx={{ pt: 5 }}>
      <Typography sx={{ mb: 1 }} color="text.secondary">
        <>{title ?? 'Transaction overview'}</>
      </Typography>
      <Box
        sx={(theme) => ({
          p: 3,
          border: `1px solid ${theme.palette.divider}`,
          borderRadius: '4px',
          '.MuiBox-root:last-of-type': {
            mb: 0,
          },
        })}
      >
        {children}
      </Box>

    </Box>
  );
};
