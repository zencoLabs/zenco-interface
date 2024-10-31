import { Box } from '@mui/material'
import React from 'react'
import { MainLayout } from '@/src/layouts/MainLayout'
import { TopDashbord } from '@/src/components/modules/TopDashbord'
import { TrendList } from '@/src/components/modules/trends/TrendList'
import { isMobile } from 'react-device-detect';
 
export default function Home() { 

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
            !isMobile ? <TopDashbord /> : <></>
          }
          <TrendList />

        </Box>
      </MainLayout>

    </>
  )
}
