import { Box } from '@mui/material'
import React from 'react'
import { MainLayout } from '@/src/layouts/MainLayout' 

export default function Asset() { 
  
  return (
    <>
     

      <MainLayout>
        <Box sx={{
          display: 'flex',
          flex: 1,
          flexDirection: 'column',
          gap: 4,

        }}>

           asset
        </Box>
      </MainLayout>

    </>
  )
}
