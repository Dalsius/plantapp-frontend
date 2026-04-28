'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import styles from './page.module.css';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) router.push('/dashboard');
  }, [user, loading, router]);

  return (
    <main className={styles.hero}>
      <div className={styles.badge}>🌿 Powered by IA</div>
      <h1 className={styles.title}>
        Tu jardín,<br />
        <em>inteligente</em>
      </h1>
      <p className={styles.subtitle}>
        Sube una foto y descubre tu planta al instante.<br />
        Cuidados personalizados, recordatorios de riego y más.
      </p>
      <div className={styles.actions}>
        <Link href="/auth/register" className={styles.btnPrimary}>
          Comenzar gratis
        </Link>
        <Link href="/auth/login" className={styles.btnSecondary}>
          Iniciar sesión
        </Link>
      </div>
      <div className={styles.features}>
        <div className={styles.feature}><span>📸</span> Identifica con foto</div>
        <div className={styles.feature}><span>💧</span> Recordatorios de riego</div>
        <div className={styles.feature}><span>🌱</span> Colección personal</div>
      </div>
    </main>
  );
}
