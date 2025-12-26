if (typeof window !== "undefined" && "Notification" in window) {
  Notification.requestPermission = function () {
    console.log("Notification permission request blocked");
    return Promise.resolve("denied" as NotificationPermission);
  };
}

export {};
