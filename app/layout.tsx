import type { Metadata } from 'next';
import { AuthProvider } from '@/lib/auth-context';
import './globals.css';

export const metadata: Metadata = {
    title: 'PlantApp 🌱',
    description: 'Tu colección de plantas con IA',
    manifest: '/manifest.json',
    themeColor: '#1a3a2a',
    appleWebApp: {
        capable: true,
        statusBarStyle: 'default',
        title: 'PlantApp',
    },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="es">
        <body>
        <AuthProvider>{children}</AuthProvider>
        <script dangerouslySetInnerHTML={{
            __html: `
            if ('serviceWorker' in navigator) {
              window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js');
              });
            }
          `
        }} />
        </body>
        </html>
    );
}