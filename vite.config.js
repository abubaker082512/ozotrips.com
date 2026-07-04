import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        indexMinimalist: resolve(__dirname, 'index-minimalist.html'),
        indexSplit: resolve(__dirname, 'index-split.html'),
        indexMasonry: resolve(__dirname, 'index-masonry.html'),
        indexExplorer: resolve(__dirname, 'index-explorer.html'),
        indexGridCarousel: resolve(__dirname, 'index-grid-carousel.html'),
        indexSearch: resolve(__dirname, 'index-search.html'),
        tours: resolve(__dirname, 'tours.html'),
        tourDetail: resolve(__dirname, 'tour-detail.html'),
        attractions: resolve(__dirname, 'attractions.html'),
        bookingSuccess: resolve(__dirname, 'booking-success.html'),
        visaServices: resolve(__dirname, 'visa-services.html'),
        customPlanner: resolve(__dirname, 'custom-planner.html'),
        helpCenter: resolve(__dirname, 'help-center.html'),
        about: resolve(__dirname, 'about.html'),
        virtualTours: resolve(__dirname, 'virtual-tours.html'),
        offers: resolve(__dirname, 'offers.html'),
        blog: resolve(__dirname, 'blog.html'),
        flights: resolve(__dirname, 'flights.html'),
        umrah: resolve(__dirname, 'umrah.html'),
      },
    },
  },
});
