export const vibrateClick = (duration = 10) => {
  try {
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate(duration);
    }
  } catch {
    // игнорируем ошибки на устройствах без поддержки вибрации
  }
};
