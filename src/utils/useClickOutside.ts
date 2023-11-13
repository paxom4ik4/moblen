import { useEffect, MouseEvent, RefObject } from 'react';

export const useClickOutside = (ref: RefObject<unknown>, callback: () => void) => {
  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (ref.current && !ref.current.contains(e.target)) {
      callback();
    }
  };

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    document.addEventListener('mousedown', handleClick);

    return () => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      document.addEventListener('mousedown', handleClick);
    };
  });
};
