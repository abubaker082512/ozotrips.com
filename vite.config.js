import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        tours: resolve(__dirname, 'tours.html'),
        tourDetail: resolve(__dirname, 'tour-detail.html'),
        attractions: resolve(__dirname, 'attractions.html'),
        bookingSuccess: resolve(__dirname, 'booking-success.html'),
        admin: resolve(__dirname, 'admin.html'),
      },
    },
  },
});
