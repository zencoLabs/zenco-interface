import { Box, Tab, Tabs } from "@mui/material"
import { useEffect, useState } from "react"; 
import { gql, useQuery } from "@apollo/client";
import { AssetRecentTrade } from "./AssetRecentTrade";
import { AssetHolder } from "./AssetHolder";
import { AssetOverview } from "./AssetOverview";
import { useRootStore } from "@/src/store/root";

const GET_TRADES = gql`
  query GetTrades($id: Int!) {
      trades(orderDirection: desc, orderBy: blockNumber, where: {assetId: $id}) {
        assetId
        blockTimestamp 
        ethAmount 
        price
        tokenAmount
        tradeType
        transactionHash
        user {
        address
        }
    }
  }
`;

const GET_HOLDERS = gql`
  query GetHolders($id: Int!) {
     assets(where: {assetId: $id}) { 
        holders(orderBy: amount, orderDirection: desc, where: {amount_gt: "0"}) {
            amount
            user {
                address
            }
        }
    }
  }
`;

const GET_OVERVIEW = gql`
  query GetOverview($id: Int!) {
     assets(where: {assetId: $id}) {
      assetId
      isDelete
      totalFees
      totalHolders
      totalSupply
      totalTradValue
      totalTradVolume
      totalTrades
      creator {
        address
      }
    }
  }
`;

export const AssetDetailOverview = ({
    assetId, 
}: {
    assetId: number, 
}) => {

    const { currentTimestamp } = useRootStore() //refetch
    
    const [value, setValue] = useState(0);
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    const { loading: tradeLoading, error: tradeError, data: tradeData , refetch: tradeDataRefetc} = useQuery(GET_TRADES, {
        variables: { id: parseInt(assetId.toString()) },
    });

    const { loading: holderLoading, error: holderError, data: holderData, refetch: holderDataRefetc } = useQuery(GET_HOLDERS, {
        variables: { id: parseInt(assetId.toString()) },
    });


    const { loading: overviewLoading, error: overviewError, data: overviewData , refetch: overviewDataRefetc} = useQuery(GET_OVERVIEW, {
        variables: { id: parseInt(assetId.toString()) },
    });

    useEffect(() => {
        tradeDataRefetc();
        holderDataRefetc();
        overviewDataRefetc()
    }, [currentTimestamp, overviewDataRefetc]);
 

    return (
        <Box sx={{
            mt: 3,
            mb:3
        }}>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} 
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
                    <Tab label="Recent Trades" className="bodhi-tabs" sx={{
                        minHeight: '36px',
                        fontSize: '0.975rem',
                        '&.Mui-selected': {
                            color: '#75cedb'
                        }
                    }} />
                    <Tab label="Holders" className="bodhi-tabs" sx={{
                        minHeight: '36px',
                        fontSize: '0.975rem',
                        '&.Mui-selected': {
                            color: '#75cedb'
                        }
                    }} />
                    <Tab label="Overview" className="bodhi-tabs" sx={{
                        minHeight: '36px',
                        fontSize: '0.975rem',
                        '&.Mui-selected': {
                            color: '#75cedb'
                        }
                    }} />
                </Tabs>
            </Box>

            <Box sx={{
                mt: 3
            }}>
                {
                    value == 0 && (
                        <Box sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4
                        }}>
                            {
                                !tradeLoading && !tradeError && tradeData ?
                                    <>
                                        {tradeData.trades.map((trade: any, index: number) => (
                                            <AssetRecentTrade trade={trade} key={index} />
                                        ))}
                                    </>
                                    : <></>
                            }
                        </Box>
                    )
                }

                {
                    value == 1 && (
                        <Box>
                            {
                                !holderLoading && !holderError && holderData ?
                                    <> 
                                        <AssetHolder holders={holderData.assets[0].holders} key={0} />
                                    </>
                                    : <></>
                            }
                        </Box>
                    )
                }

                {
                    value == 2 && (
                        <Box>
                            {
                                !overviewLoading && !overviewError && overviewData ?
                                    <>

                                        <AssetOverview asset={overviewData.assets[0]} />
                                    </>
                                    : <></>
                            }
                        </Box>
                    )
                }

            </Box>

        </Box>
    )
}