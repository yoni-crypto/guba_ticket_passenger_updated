import type { Metadata } from "next";
import localFont from 'next/font/local'
import "./globals.css";
import StoreProvider from '@/lib/redux/StoreProvider'
import { Toaster } from 'react-hot-toast'

const switzer = localFont({
  src: [
    {
      path: '../public/fonts/Switzer-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Switzer-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Switzer-Semibold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/Switzer-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-switzer',
  display: 'swap',
})

export const metadata: Metadata = {
  title: "GubaBus - Book Your Bus Journey",
  description: "Book bus tickets online with ease. Find the best routes, compare prices, and travel comfortably across Ethiopia.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${switzer.variable} font-switzer antialiased`}>
        <StoreProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#fff',
                color: '#000',
                padding: '16px',
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              },
              success: {
                iconTheme: {
                  primary: '#10b981',
                  secondary: '#fff',
                },
              },
              error: {
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </StoreProvider>
      </body>
    </html>
  );
}
