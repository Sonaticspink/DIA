// public/sw.js
self.addEventListener('push', function(event) {
  let data = { title: 'อัปเดตจาก ClinicApp', body: 'มีการเปลี่ยนแปลงในนัดหมายของคุณ' };
  
  if (event.data) {
    data = event.data.json();
  }

  const options = {
    body: data.body,
    icon: '/logo.png',  // ใช้ logo.png ที่คุณมีใน public
    badge: '/logo.png',
    vibrate: [100, 50, 100],
    data: {
      url: '/tabs/appointments' // กดแล้วให้ไปที่หน้านัดหมาย
    }
  };

  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// เมื่อผู้ใช้คลิกที่การแจ้งเตือน
self.addEventListener('notificationclick', function(event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  );
});