import { useEffect } from 'react';

/**
 * Global Scroll Lock Manager for Overlays, Modals, Sheets, and Drawers.
 * 
 * Features:
 * - Reference counted (supports nested modals/sheets)
 * - Freezes background scroll on iOS Safari, Android, and Desktop
 * - Stores exact scroll position upon opening and restores it on close
 * - Prevents layout shift via scrollbar width compensation
 * - Respects overscroll-behavior: contain for internal modal scrolling
 */

let lockCount = 0;
let savedScrollY = 0;

let previousBodyStyles = {
  position: '',
  top: '',
  left: '',
  right: '',
  width: '',
  overflow: '',
  paddingRight: '',
};

let previousHtmlStyles = {
  overflow: '',
  overscrollBehavior: '',
};

export const lockScroll = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  lockCount++;

  if (lockCount === 1) {
    // Capture exact current scroll position before locking
    savedScrollY =
      window.scrollY ||
      window.pageYOffset ||
      document.documentElement.scrollTop ||
      document.body.scrollTop ||
      0;

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    // Snapshot existing styles
    previousBodyStyles = {
      position: document.body.style.position || '',
      top: document.body.style.top || '',
      left: document.body.style.left || '',
      right: document.body.style.right || '',
      width: document.body.style.width || '',
      overflow: document.body.style.overflow || '',
      paddingRight: document.body.style.paddingRight || '',
    };

    previousHtmlStyles = {
      overflow: document.documentElement.style.overflow || '',
      overscrollBehavior: document.documentElement.style.overscrollBehavior || '',
    };

    // Apply robust fixed lock to prevent iOS rubber-banding and Android/Desktop background scrolling
    document.body.style.position = 'fixed';
    document.body.style.top = `-${savedScrollY}px`;
    document.body.style.left = '0';
    document.body.style.right = '0';
    document.body.style.width = '100%';
    document.body.style.overflow = 'hidden';

    if (scrollbarWidth > 0) {
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    }

    document.documentElement.style.overflow = 'hidden';
    document.documentElement.style.overscrollBehavior = 'none';
  }
};

export const unlockScroll = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;

  if (lockCount > 0) {
    lockCount--;
  }

  if (lockCount === 0) {
    const restoreY = savedScrollY;

    // Restore original document & body styles
    document.body.style.position = previousBodyStyles.position;
    document.body.style.top = previousBodyStyles.top;
    document.body.style.left = previousBodyStyles.left;
    document.body.style.right = previousBodyStyles.right;
    document.body.style.width = previousBodyStyles.width;
    document.body.style.overflow = previousBodyStyles.overflow;
    document.body.style.paddingRight = previousBodyStyles.paddingRight;

    document.documentElement.style.overflow = previousHtmlStyles.overflow;
    document.documentElement.style.overscrollBehavior = previousHtmlStyles.overscrollBehavior;

    // Restore exact scroll position without smooth animation
    window.scrollTo({
      top: restoreY,
      left: 0,
      behavior: 'auto',
    });

    if (document.documentElement) {
      document.documentElement.scrollTop = restoreY;
    }
    if (document.body) {
      document.body.scrollTop = restoreY;
    }
  }
};

/**
 * Force reset scroll lock in case navigation abruptly changes active view.
 */
export const resetScrollLock = () => {
  if (typeof window === 'undefined' || typeof document === 'undefined') return;
  lockCount = 0;
  document.body.style.position = previousBodyStyles.position;
  document.body.style.top = previousBodyStyles.top;
  document.body.style.left = previousBodyStyles.left;
  document.body.style.right = previousBodyStyles.right;
  document.body.style.width = previousBodyStyles.width;
  document.body.style.overflow = previousBodyStyles.overflow;
  document.body.style.paddingRight = previousBodyStyles.paddingRight;

  document.documentElement.style.overflow = previousHtmlStyles.overflow;
  document.documentElement.style.overscrollBehavior = previousHtmlStyles.overscrollBehavior;
};

/**
 * React hook to lock body scrolling when a modal / sheet / overlay is open.
 * @param isLocked boolean indicating if the overlay is currently active/visible.
 */
export const useScrollLock = (isLocked: boolean = true) => {
  useEffect(() => {
    if (!isLocked) return;

    lockScroll();

    return () => {
      unlockScroll();
    };
  }, [isLocked]);
};
