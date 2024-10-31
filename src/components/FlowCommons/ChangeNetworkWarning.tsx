import { ConnectChainID } from "@/src/libs/chains"; 
import { Button, Typography } from "@mui/material";
import { Warning } from "./Warning"; 
import { useWeb3React } from "@web3-react/core"; 
import { useRootStore } from "@/src/store/root";

export type ChangeNetworkWarningProps = {
  networkName: string;
};

export const ChangeNetworkWarning = ({
  networkName,
}: ChangeNetworkWarningProps) => {

  const { connector } = useWeb3React()
  const {switchNetwork} = useRootStore()
  
  return (
    <Warning severity="error" icon={false}>
      <Typography variant="description">
        <>{'Please switch to'} {networkName}.</>{" "}
        <Button
          variant="text"
          sx={{ ml: "2px", 
          verticalAlign: "top", 
         }}
          onClick={() => switchNetwork(connector,ConnectChainID)}
          disableRipple
        >
          <Typography variant="description" sx={{
              color:'#ff0000'
          }}>
            <>{'Switch Network'}</>
          </Typography>
        </Button>
      </Typography>
    </Warning>
  );
};
