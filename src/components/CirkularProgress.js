import * as React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

export default ({color, style}) => {
  return (
    <div style={style} >
      <Stack sx={{ color:color?color:'grey.500' }} spacing={2} direction="row">
        <CircularProgress color="inherit" />
      </Stack>
    </div>
  );
}
