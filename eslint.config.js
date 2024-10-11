import { shlroland } from '@shlroland/eslint-config'

export default shlroland({
  type: 'lib',
  react: {
    overrides: {
      'react-refresh/only-export-components': 'off',
    },
  },
})
