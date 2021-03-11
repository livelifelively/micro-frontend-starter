import { createMuiTheme } from '@material-ui/core/styles';

export default createMuiTheme({
  palette: {
    type: 'light',
    primary: {
      main: '#bd0707',
    },
    secondary: {
      main: '#ffc510',
    },
    background: {
      default: '#4c69f6',
      paper: '#4c94f6',
    },
  },
  typography: {
    body1: {
      fontFamily: 'Roboto',
    },
    fontFamily: 'Bangers',
    caption: {
      fontFamily: 'Do Hyeon',
    },
    overline: {
      fontFamily: 'Do Hyeon',
    },
    body2: {
      fontFamily: 'Roboto',
    },
  },
});
