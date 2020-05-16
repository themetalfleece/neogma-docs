import { funcTransport } from '@connectv/sdh/transport';

// open the ToC bar by default on desktop
export function openToCOnDesktopByDefault() {
    if (window.matchMedia('(min-width: 800px)').matches) {
        if (!localStorage.getItem('-codedoc-toc-active')) {
            localStorage.setItem('-codedoc-toc-active', "true");
        }
    }
}
export const openToCOnDesktopByDefault$ = /*#__PURE__*/funcTransport(openToCOnDesktopByDefault);
