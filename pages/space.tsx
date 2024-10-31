import { Box } from '@mui/material'
import React from 'react'
import { MainLayout } from '@/src/layouts/MainLayout'
import { TopDashbord } from '@/src/components/modules/TopDashbord'
import { SpaceList } from '@/src/components/modules/spaces/SpaceList'
import { isMobile } from 'react-device-detect';

export default function Space() { 

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
          <SpaceList />

        </Box>
      </MainLayout>


    </>
  )
}
