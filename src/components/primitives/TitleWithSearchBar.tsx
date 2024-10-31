import SearchIcon from '@mui/icons-material/Search';
import {
  Box, 
  IconButton,
  SvgIcon, 
  TypographyProps, 
} from '@mui/material';
import { ReactNode, useState } from 'react';
import { SearchInput } from './SearchInput';


interface TitleWithSearchBarProps<C extends React.ElementType> { 
  onSearchTermChange: (value: string) => void; 
  searchPlaceholder: string;
  titleProps?: TypographyProps<C, { component?: C }>;
  title: ReactNode;
}

export const TitleWithSearchBar = <T extends React.ElementType>({ 
  onSearchTermChange, 
  searchPlaceholder, 
}: TitleWithSearchBarProps<T>) => {
  const [showSearchBar, setShowSearchBar] = useState(false); 

  const handleCancelClick = () => {
    setShowSearchBar(false);
    onSearchTermChange('');
  };
 

  return (
    <Box 
  >
    {!showSearchBar && (
      <IconButton onClick={() => setShowSearchBar(true)} sx={{ padding: 0 }}>
        <SvgIcon>
          <SearchIcon />
        </SvgIcon> 
      </IconButton>

    )}
    {(showSearchBar) && (
      <Box
        sx={{ width: '100%', display: 'flex', justifyContent: 'space-between' }}
      >
        <SearchInput
          wrapperSx={{
            width: {
              xs: '100%',
              sm: '280px',
            },
          }}
          placeholder={searchPlaceholder}
          onSearchTermChange={onSearchTermChange}
          showCancle={true}
          CancleChange={handleCancelClick}
        /> 
      </Box>
    )}
  </Box>
  );
};
