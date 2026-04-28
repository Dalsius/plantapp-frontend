'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import styles from '../auth.module.css';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handle = async () => {
    setError('');
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      router.push('/dashboard');
    } catch (e: unknown) {
      const err = e as { message?: string };
      setError(err?.message || 'Error al registrarse');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <div className={styles.logo}>🌱</div>
        <h2 className={styles.title}>Crear cuenta</h2>
        <p className={styles.subtitle}>Empieza a cuidar tus plantas</p>

        {error && <div className={styles.error}>{error}</div>}

        <div className={styles.fields}>
          <input
            className={styles.input}
            placeholder="Tu nombre"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
          />
          <input
            className={styles.input}
            placeholder="Email"
            type="email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
          />
          <input
            className={styles.input}
            placeholder="Contraseña (mín. 6 caracteres)"
            type="password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
          />
        </div>

        <button className={styles.btn} onClick={handle} disabled={loading}>
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>

        <p className={styles.switch}>
          ¿Ya tienes cuenta? <Link href="/auth/login">Inicia sesión</Link>
        </p>
      </div>
    </div>
  );
}
