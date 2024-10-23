import * as React from 'react';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

const styles = {
  default:{
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: '-50px',
    marginLeft: '-50px',
    width: '100px',
    height: '100px',
  },
}

export default props => {
  const color = props.color?props.color:'grey.500'
  const style = props.style?props.style:styles.default
  return (
    <div style={style} >
      <Stack sx={{ color }} spacing={2} direction="row">
        <CircularProgress color="inherit" />
      </Stack>
    </div>
  );
}
