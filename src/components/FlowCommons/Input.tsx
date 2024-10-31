import * as React from 'react';
import { useInput } from '@mui/base/useInput';
import { styled } from '@mui/system';
import { unstable_useForkRef as useForkRef } from '@mui/utils';

export const CustomInput = React.forwardRef(function CustomInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
  ref: React.ForwardedRef<HTMLInputElement>,
) {
  const { getRootProps, getInputProps } = useInput(props);

  const inputProps = getInputProps();

  // Make sure that both the forwarded ref and the ref returned from the getInputProps are applied on the input element
  inputProps.ref = useForkRef(inputProps.ref, ref);

  return (
    <div {...getRootProps()}>
      <StyledInputElement {...props} {...inputProps} />
    </div>
  );
});

 

 

const grey = {
  50: '#F3F6F9',
  100: '#E5EAF2',
  200: '#DAE2ED',
  300: '#C7D0DD',
  400: '#B0B8C4',
  500: '#9DA8B7',
  600: '#6B7A90',
  700: '#434D5B',
  800: '#303740',
  900: '#1C2025',
};

const StyledInputElement = styled('input')(
  ({ theme }) => ` 
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 4px;
  color: ${theme.palette.mode === 'dark' ? grey[900] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? '#fff': '#fff'};
  border: 1px solid ${theme.palette.mode === 'dark' ? grey[200] : grey[200]};
 
  &:hover {
    border-color: ${grey[400]};
  }

  &:focus {
    border-color: ${grey[400]}; 
  }

  // firefox
  &:focus-visible {
    outline: 0;
  }
`,
);
