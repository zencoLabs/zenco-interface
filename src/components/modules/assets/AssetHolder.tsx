import { Box, Typography } from "@mui/material"  
import { textCenterEllipsis } from "@/src/utils/text-center-ellipsis";
import { Row } from "../../primitives/Row";

export const AssetHolder = ({
    holders
}: {
    holders: any
}) => { 
    return (
        <Box>
            <Row sx={{ padding: '4px 20px' }}>
                <Typography variant={'main16'}>HOLDER</Typography>
                <Typography variant={'main16'}>SHARE</Typography>
            </Row>

            {holders.map((holder: any, index: number) => (
                <Row sx={{ padding: '4px 20px' }} key={index}>
                    <Typography variant={'secondary16'}>{textCenterEllipsis(holder.user.address, 4, 4)}</Typography>
                    <Typography variant={'secondary16'}>{holder.amount}</Typography>
                </Row>
            ))} 
        </Box>
    )
}