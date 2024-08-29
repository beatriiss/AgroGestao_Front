import { showMessage } from 'react-native-flash-message';
import palette from '../styles/palette';

export const showFlashMessage = (message, type = 'info') => {
  let backgroundColor;
  let title;

  switch (type) {
    case 'success':
      backgroundColor = palette.primaryGreen;
      title = 'Sucesso';
      break;
    case 'danger':
      backgroundColor = palette.danger;
      title = 'Erro';
      break;
    case 'warning':
      backgroundColor = 'orange';
      title = 'Atenção';
      break;
    default:
      backgroundColor = 'blue';
      title = 'Info';
  }

  showMessage({
    message: message,
    type: type,
    backgroundColor: backgroundColor,
    title: title,
    floating: true,
    style: { marginTop: 30 }
  });
};
