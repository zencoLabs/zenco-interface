import { Box } from '@mui/material'
import React from 'react'
import { MainLayout } from '@/src/layouts/MainLayout'
import { ethers, utils } from 'ethers';

export default function Demo() {

    const address = "0x81aa767e7977665ac124fa6306fb76fc7a628a8e";
    const checksumAddress = utils.getAddress(address);

    console.log(checksumAddress);

    console.log('0xb6bcf559e36e2f9ffd0f795b8eeb2d5f90c9c594'.toLocaleLowerCase())
    console.log(ethers.utils.formatUnits('7397234198801529241', 18))
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
