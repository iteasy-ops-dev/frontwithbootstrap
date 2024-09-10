import { useRef } from 'react';

const usePushNotification = () => {
  const notificationRef = useRef(null);

  if (typeof Notification === 'undefined') {
    console.error("This browser does not support desktop notification");
    return;
  }

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.warn("Notification permission not granted");
        return false;
      }
      return true;
    } catch (error) {
      console.error("An error occurred during permission request:", error);
      return false;
    }
  };

  const checkOrRequestPermission = async () => {
    if (Notification.permission !== 'granted') {
      return await requestPermission();
    }
    return true;
  };

  const setNotificationClickEvent = () => {
    if (notificationRef.current) {
      notificationRef.current.onclick = (event) => {
        event.preventDefault();
        window.focus();
        notificationRef.current.close();
      };
    }
  };

  const fireNotification = async (title, options = {}) => {
    const permissionGranted = await checkOrRequestPermission();
    if (!permissionGranted) return;

    const newOption = {
      badge: '/images/badge.webp',
      icon: '/images/icon.webp',
      requireInteraction: true,
      ...options
    };

    // 알림 생성 및 레퍼런스 할당
    notificationRef.current = new Notification(title, newOption);

    // 알림 이벤트 설정
    // notificationRef.current.onshow = () => {
    //   console.log("Notification shown!");
    // };

    // notificationRef.current.onerror = (e) => {
    //   console.error("Notification error occurred: ", e);
    // };

    // notificationRef.current.onclose = () => {
    //   console.log("Notification closed.");
    // };

    // 클릭 이벤트 등록
    setNotificationClickEvent();
  };

  return { fireNotification };
};

export default usePushNotification;
