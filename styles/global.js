import { StyleSheet } from 'react-native';
import palette from './palette';

const GlobalStyles = StyleSheet.create({
  primaryButton: {
    backgroundColor: palette.primaryGreen,  
    width: '100%',
    height: 45,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  input: {
    width: '100%',
    height: 45,
    borderColor: palette.primaryGreen,  
    borderWidth: 2,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  textButton: {
    color: '#FFFFFF',  
    fontWeight: '600',
    fontSize: 18,
  },
});

export default GlobalStyles;
