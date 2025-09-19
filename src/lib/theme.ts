// theme.ts
import { extendTheme, ThemeConfig } from '@chakra-ui/react';

interface GetThemeOptions {
  darkMode: boolean;
}

export const getChakraTheme = ({ darkMode }: GetThemeOptions) => {
  const config: ThemeConfig = {
    initialColorMode: darkMode ? 'dark' : 'light',
    useSystemColorMode: false,
  };

  return extendTheme({
    config,
    colors: {
      brand: {
        background: darkMode ? '#006078' : '#F5F5F5',
        primary: '#FF614B',
        secondary: darkMode ? '#ADEAE2' : '#006078',
        accent: '#FFAB40',
        muted: darkMode ? '#01576E' : '#CCCCCC',
        white: darkMode ? '#FFFFFF' : '#000000',
      },
    },
    components: {
      Modal: {
        baseStyle: {
          dialog: {
            bg: darkMode ? '#006078' : '#F5F5F5',
            color: darkMode ? '#FFFFFF' : '#000000',
            borderRadius: 'md',
            boxShadow: 'lg',
          },
          header: {
            color: darkMode ? '#ADEAE2' : '#006078',
            borderBottom: '1px solid',
            borderColor: darkMode ? '#01576E' : '#CCCCCC',
          },
          closeButton: {
            color: '#FFAB40',
            _hover: {
              bg: darkMode ? '#01576E' : '#CCCCCC',
            },
          },
          body: {
            color: darkMode ? '#ADEAE2' : '#006078',
          },
          footer: {
            borderTop: '1px solid',
            borderColor: darkMode ? '#01576E' : '#CCCCCC',
          },
          button: {
            bg: darkMode ? '#FFAB40' : '',
          },
        },
      },
      Drawer: {
        baseStyle: {
          dialog: {
            bg: darkMode ? '#006078' : '#F5F5F5',
            color: darkMode ? '#FFFFFF' : '#000000',
            borderLeft: '1px solid',
            borderColor: darkMode ? '#01576E' : '#CCCCCC',
            boxShadow: 'lg',
          },
          header: {
            color: darkMode ? '#ADEAE2' : '#006078',
            borderBottom: '1px solid',
            borderColor: darkMode ? '#01576E' : '#CCCCCC',
            fontWeight: 'bold',
          },
          closeButton: {
            color: '#FFAB40',
            _hover: {
              bg: darkMode ? '#01576E' : '#CCCCCC',
            },
          },
          body: {
            color: darkMode ? '#ADEAE2' : '#006078',
          },
        },
      },
    },
  });
};
