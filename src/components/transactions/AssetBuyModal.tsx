import { ModalType, useModalStore } from "@/src/store/modalSlice"
import { BasicModal } from "../primitives/BasicModal"
import { Box,Tab, Tabs, Typography } from "@mui/material";
import { useState } from "react";
import { AssetBuyContent } from "./AssetBuyContent";
import { AssetSellContent } from "./AssetSellContent";
import { useTempAssetStore } from "@/src/store/tempAssetSlice";

export const AssetBuyModal = () => {
    const { type, close } = useModalStore();
    const { tempAssetModal } = useTempAssetStore();

    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };


    async function closeDailog() {
        close()
    }
    return <>
        <BasicModal open={type === ModalType.AssetBuy} setOpen={closeDailog} contentMaxWidth={420}>

            <Typography variant="h2" sx={{ mb: 4 }}>
                {value == 0 ? 'Buy' : 'Sell'} shares #{tempAssetModal?.assetId}
            </Typography>
            <Box>
                <Tabs value={value} onChange={handleChange} centered 
                    sx={{
                        minHeight: '36px',
                        '& .MuiTabs-indicator': {
                            backgroundColor: '#75cedb'
                        },
                        '& .Mui-selected': {
                            color: '#75cedb'
                        }
                    }}
                >
                    <Tab label="Buy" className="bodhi-tabs" sx={{
                        minHeight: '36px',
                        fontSize: '0.975rem',
                        '&.Mui-selected': {
                            color: '#75cedb'
                        }
                    }} />
                    <Tab label="Sell" className="bodhi-tabs" sx={{
                        minHeight: '36px',
                        fontSize: '0.975rem',
                        '&.Mui-selected': {
                            color: '#75cedb'
                        }
                    }} />
                </Tabs>
            </Box>

            {
                value == 0 && (
                    <AssetBuyContent assetId={tempAssetModal?.assetId!} totalSupply={tempAssetModal?.assetSupply??0} />
                )
            }
            {
                value == 1 && (
                    <AssetSellContent assetId={tempAssetModal?.assetId!} totalSupply={tempAssetModal?.assetSupply??0}/>
                )
            }


        </BasicModal>
    </>
}