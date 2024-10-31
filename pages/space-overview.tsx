import { Box } from '@mui/material'
import React, { useEffect } from 'react'
import { MainLayout } from '@/src/layouts/MainLayout'
import { useRouter } from 'next/router';
import { useGetSpaceFactoryUserInfo } from '@/src/hooks/bodhi/useGraphData';
import { SpaceOverviewUser } from '@/src/components/modules/spaces/SpaceOverviewUser';
import { SpaceUserAssets } from '@/src/components/modules/spaces/SpaceUserAssets';
import { useRootStore } from '@/src/store/root';

export default function SpaceOverview() { 

  const router = useRouter();
  const address = router.query.address?.toString() 
  const { currentTimestamp } = useRootStore()

  const {
    sapceUser,
    loading,
    error,
    refetch,
  } = useGetSpaceFactoryUserInfo(address ?address.toLocaleLowerCase(): '');

  useEffect(() => {
    refetch()
  }, [currentTimestamp, refetch]);


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
            !loading ?
              <>
                {
                  sapceUser ?
                    <Box>
                      <SpaceOverviewUser spaceUser={sapceUser} />
                      <SpaceUserAssets spaceUserInfo={sapceUser} />
                    </Box>
                    : <>No data</>
                }
              </>
              :
              <>loading...</>
          }

        </Box>
      </MainLayout>

    </>
  )
}
