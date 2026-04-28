'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handle = async () => {
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push('/dashboard');
    } catch (e: unknown) {
      const err = e as { message?: string };
      setError(err?.message || 'Credenciales inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>🌱</div>
        <h2 className={styles.title}>Bienvenido</h2>
        <p className={styles.subtitle}>Accede a tu colección</p>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.fields}>
          <input
            className={styles.input}
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            className={styles.input}
            placeholder="Contraseña"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button className={styles.btn} onClick={handle} disabled={loading}>
          {loading ? 'Entrando...' : 'Iniciar sesión'}
        </button>

        <p className={styles.switch}>
          ¿No tienes cuenta? <Link href="/auth/register">Regístrate gratis</Link>
        </p>
      </div>
    </div>
  );
}
