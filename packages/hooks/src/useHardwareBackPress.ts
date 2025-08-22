import { BackHandler } from 'react-native';
import { useEffect } from 'react';

export const useHardwareBackPress = (
  enabled: boolean,
  callback: () => boolean,
) => {
  useEffect(() => {
    if (!enabled) return;

    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      callback
    );

    return () => {
      subscription.remove(); // 使用 subscription.remove() 而不是 removeEventListener
    };
  }, [enabled, callback]);
};

export default useHardwareBackPress;