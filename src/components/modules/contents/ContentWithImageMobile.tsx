import React from 'react';
import { Box } from '@mui/material';

function truncateText(htmlString: string | undefined): string {
    if (!htmlString) return '';

    // Strip HTML tags
    const plainText = htmlString.replace(/<[^>]*>?/gm, '');

    const truncatedText = plainText.slice(0, 110);
    return truncatedText.length < plainText.length ? truncatedText + '...' : truncatedText;
}

function extractImage(htmlString: string | undefined): JSX.Element | null {
    if (!htmlString) return null;

    const imgRegex = /<img[^>]+src=['"]([^'"]+)['"][^>]*>/g;
    const match = imgRegex.exec(htmlString);

    if (match) {
        const imageUrl = match[1];
        return <img src={imageUrl} alt="Arweave Image" style={{width:"80px",height:'80px'}} />;
    }

    return null;
}

interface ContentWithImageProps {
    content: string | undefined;
}

const ContentWithImageMobile: React.FC<ContentWithImageProps> = ({ content }) => {
    const truncatedContent = truncateText(content);
    const imageUrl = extractImage(content);

    return (
        <>
            {content && (
                <Box sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    gap: 3,
                    alignItems: 'center'
                }}>
                    <Box sx={{ flex: '1 1 auto' }}>
                        <div dangerouslySetInnerHTML={{ __html: truncatedContent }}  style={{
                            lineHeight:'24px',
                            letterSpacing: '0.05em',
                           cursor:'pointer'
                        }}/>
                    </Box>
                    {imageUrl && (
                        <Box sx={{
                            width: '80px',
                            height:'80px',
                            flex: '0 0 auto'  // Ensure the image box doesn't grow
                        }} 
                        component={'div'}
                        className='content-view-img'
                        > 
                            {imageUrl}
                        </Box>
                    )}
                </Box>
            )}
        </>
    );
}

export default ContentWithImageMobile;
