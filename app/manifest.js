export default function manifest() {
    return {
      name: 'TLS Note',
      short_name: 'TLSNote',
      description: 'A Progressive Web App built with Next.js',
      start_url: '/',
      display: 'standalone',
      background_color: '#000000',
      theme_color: '#000000',
      icons: [
        {
          src: '/icon-192x192.png',
          sizes: '192x192',
          type: 'image/png',
        },
        {
          src: '/icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
        },
      ],
    }
  }