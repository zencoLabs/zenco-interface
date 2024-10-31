import * as React from 'react';
import { Input as BaseInput, InputProps } from '@mui/base/Input';
import { styled } from '@mui/system';

export const InputMultline = React.forwardRef(function CustomInput(
  props: InputProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  return (
    <BaseInput
      slots={{
        root: RootDiv,
        input: 'input',
        textarea: TextareaElement,
      }}
      {...props}
      ref={ref}
    />
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

const RootDiv = styled('div')`
  display: flex;
  max-width: 100%;
`;

const TextareaElement = styled('textarea', {
  shouldForwardProp: (prop) =>
    !['ownerState', 'minRows', 'maxRows'].includes(prop.toString()),
})(
  ({ theme }) => `
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 1.5rem;
  padding: 8px 12px;
  border-radius: 4px 4px 0 4px;
  color: ${theme.palette.mode === 'dark' ? grey[900] : grey[900]};
  background: ${theme.palette.mode === 'dark' ? '#f2f2f2' : '#f2f2f2'};
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
