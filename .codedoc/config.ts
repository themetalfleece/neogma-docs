import { DefaultConfig, configuration } from '@codedoc/core';
import { openToCOnDesktopByDefault$ } from './desktop-toc-open';

import { theme } from './theme';

export const config = /*#__PURE__*/configuration({
  theme, // --> add the theme. modify `./theme.ts` for chaning the theme.
  page: {
    title: {
      base: 'Neogma Docs' // --> the base title of your doc pages
    },
  },
  src: {
    base: './md'
  },
  dest: {
    html: '.',
    namespace: '/neogma-docs',
  },
  misc: {
    github: {
      repo: 'neogma',
      user: 'themetalfleece',
      action: 'Star',
    }
  },
  bundle: {
    init: [
      ...DefaultConfig.bundle.init,
      openToCOnDesktopByDefault$,
    ]
  }
});
