// // New: Handle push events to display notifications
// self.addEventListener('push', (event) => {
//   if (!event.data) return;

//   const data = event.data.json();
//   const options = {
//     body: data.body,
//     icon: './vite.svg', // Replace with your app logo path
//     data: { url: data.url },
//   };

//   event.waitUntil(
//     self.registration.showNotification(data.title, options)
//   );
// });

// // New: Handle notification clicks to navigate to chat
// self.addEventListener('notificationclick', (event) => {
//   event.notification.close();
//   event.waitUntil(
//     clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
//       const url = event.notification.data.url;
//       for (const client of clientList) {
//         if (client.url === url && 'focus' in client) {
//           return client.focus();
//         }
//       }
//       if (clients.openWindow) {
//         return clients.openWindow(url);
//       }
//     })
//   );
// });






self.addEventListener('push', (event) => {
  if (!event.data) return;
  const data = event.data.json();
  const options = {
    body: data.body,
    icon: './logovct1.png', 
    data: { url: data.url }, 
  };
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      const url = event.notification.data.url; 
      for (const client of clientList) {
        const clientUrl = new URL(client.url);
        if (clientUrl.pathname === '/friends' && 'focus' in client) {
          client.postMessage({ type: 'NAVIGATE', friendId: new URL(url).searchParams.get('friendId') });
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(url);
      }
    })
  );
});