import { useMediaQuery } from "@mui/material";
export default function getUseWeb() {
  const isMobile = useMediaQuery('(max-width:1024px)'); 
  
  return {
    isMobile,
  };
} 