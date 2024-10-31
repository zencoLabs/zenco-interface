import { Box, Paper, Typography } from '@mui/material'
import React from 'react'
import { MainLayout } from '@/src/layouts/MainLayout'

export default function Terms() { 

    return (
        <>

            <MainLayout>
                <Box sx={{
                    display: 'flex',
                    flex: 1,
                    flexDirection: 'column',
                    gap: 4,

                }}>
                    <Paper
                        sx={(theme) => ({
                            padding: '12px',
                            background: '#312f5c',
                        })}
                    >
                        <div>
                            <h3>Zenco Terms of Service</h3>
                            <Typography color={'text.secondary'} sx={{mb:4}}><strong>Effective Date: July 30, 2024</strong></Typography>

                            <Typography color={'text.secondary'}>Welcome to Zenco! Please read these Terms of Service ("Terms") carefully before using our services. These Terms govern your access to and use of the Zenco website, applications, and related services (collectively, the "Services").</Typography>
                            <h4>1. Acceptance of Terms</h4>
                            <Typography color={'text.secondary'}>By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, do not use our Services.</Typography>
                            <h4>2. Changes to Services</h4>
                            <Typography color={'text.secondary'}>We reserve the right to modify or discontinue the Services at any time, without notice. We will make an effort to notify you of any significant changes.</Typography>
                            <h4>3. Account Registration</h4>
                            <Typography color={'text.secondary'}>You must register an account to access certain features of Zenco. When registering, you must provide accurate and complete information and update it as necessary. You are responsible for safeguarding your account and for all activities conducted through your account.</Typography>
                            <h4>4. Community Guidelines</h4>
                            <Typography color={'text.secondary'}>While using our Services, you must comply with our community guidelines. Posting subversive comments, offensive language, and other unlawful or inappropriate content is prohibited.</Typography>
                            <h4>5. Content Ownership</h4>
                            {/* <Typography color={'text.secondary'}>You retain ownership of the content you post on Zenco. By submitting content, you grant us a non-exclusive, worldwide license to host, use, distribute, modify, run, copy, publicly display, or publicly perform such content.</Typography> */}
                            <Typography color={'text.secondary'}>You retain ownership of the content you post on Zenco. By submitting content, you grant us the right to host, run, distribute, display, reproduce, or perform such content.</Typography>
                            
                            <h4>6. Feedback</h4>
                            <Typography color={'text.secondary'}>Any feedback or suggestions you provide through Zenco will be considered non-confidential. We are free to use and distribute such feedback or suggestions without restriction.</Typography>
                            <h4>7. Termination</h4>
                            <Typography color={'text.secondary'}>We reserve the right to terminate or suspend your access to the Services at any time, without notice, particularly if you violate these Terms.</Typography>
                            <h4>8. Disclaimer</h4>
                            <Typography color={'text.secondary'}>Our Services are provided "as is" and "as available" without any warranties of any kind, whether express or implied, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</Typography>
                            <h4>9. Limitation of Liability</h4>
                            <Typography color={'text.secondary'}>In no event shall Zenco or its affiliates be liable for any indirect, incidental, special, or consequential damages arising out of or in connection with your use or inability to use the Services.</Typography>
                            <h4>10. Dispute Resolution</h4>
                            <Typography color={'text.secondary'}>Any disputes arising out of or relating to these Terms or the Services will be resolved through arbitration in your jurisdiction.</Typography>
                            <h4>11. Governing Law</h4>
                            <Typography color={'text.secondary'}>These Terms are governed by and construed in accordance with the laws of your country or region, without regard to its conflict of law principles.</Typography>
                            <h4>12. Contact Us</h4>
                            <Typography color={'text.secondary'}>If you have any questions or concerns, please contact us at [support email].</Typography>

                        </div>
                    </Paper>
                </Box>
            </MainLayout>


        </>
    )
}
