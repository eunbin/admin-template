import { useEffect } from 'react';

const visibilityChangeEvent = 'visibilitychange';

interface Props {
  onHide?: () => void;
  onShow?: () => void;
}

const useVisibilityChange = ({
  onHide = () => {},
  onShow = () => {},
}: Props = {}) => {
  const handleVisibilityChange = () => {
    const isHidden = document.visibilityState === 'hidden';
    if (isHidden) {
      onHide();
    } else {
      onShow();
    }
  };

  useEffect(() => {
    document.addEventListener(visibilityChangeEvent, handleVisibilityChange);
    return () =>
      document.removeEventListener(
        visibilityChangeEvent,
        handleVisibilityChange
      );
  }, []);

  return;
};

export default useVisibilityChange;
