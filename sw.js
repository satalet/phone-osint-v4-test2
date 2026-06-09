self.addEventListener('install', (e) => {
    console.log('[Service Worker] Installed');
});

self.addEventListener('fetch', (e) => {
    // هاد السطر بس عشان نرضي شروط جوجل كروم للتنزيل
});
