import { Box, Paper } from '@mui/material'
import React from 'react'
import { MainLayout } from '@/src/layouts/MainLayout'
import { useRouter } from 'next/router';  
import { AssetDetailData } from '@/src/components/modules/assets/AssetDetailData';

export default function AssetOverview() {

  const router = useRouter();
  const assetid = router.query.assetid  

  return (
    <>
      <MainLayout>
        <Box sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          gap: 4,

        }}>
          {
           
              <>
                {
                  assetid ?
                    <AssetDetailData assetId={assetid?.toString()} />
                    :
                    <Paper
                      sx={(theme) => ({
                        padding: '12px',
                        background: '#312f5c',
                      })}
                    >No data</Paper>
                }
              </>
          }
        </Box>
      </MainLayout>

    </>
  )
}

