import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import { aliases, mdi } from 'vuetify/iconsets/mdi'

export default createVuetify({
  theme: {
    defaultTheme: 'meridianDark',
    themes: {
      meridianDark: {
        dark: true,
        colors: {
          background: '#090f22',
          surface: '#101934',
          primary: '#485696',
          secondary: '#f1c98a',
          success: '#FC7A1E',
          error: '#F24C00',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
})
