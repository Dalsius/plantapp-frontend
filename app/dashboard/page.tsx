'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { getPlants, identifyPlant, waterPlant, deletePlant } from '@/lib/api';
import styles from './dashboard.module.css';

interface Plant {
  id: number;
  name: string;
  species: string;
  imageUrl: string;
  light: string;
  waterEveryDays: number;
  careNotes: string;
  toxic: boolean;
  lastWatered: string | null;
  createdAt: string;
}

export default function Dashboard() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [plants, setPlants] = useState<Plant[]>([]);
  const [uploading, setUploading] = useState(false);
  const [selected, setSelected] = useState<Plant | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
    if (user) load();
  }, [user, loading]);

  const load = async () => {
    try {
      const data = await getPlants();
      setPlants(data);
    } catch {}
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      await identifyPlant(file);
      await load();
    } catch (err) {
      alert('No se pudo identificar la planta. Intenta con otra foto.');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const handleWater = async (id: number) => {
    await waterPlant(id);
    await load();
    if (selected?.id === id) {
      const updated = plants.find(p => p.id === id);
      if (updated) setSelected({ ...updated, lastWatered: new Date().toISOString() });
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar esta planta?')) return;
    await deletePlant(id);
    setSelected(null);
    await load();
  };

  const daysSinceWater = (date: string | null) => {
    if (!date) return null;
    const diff = Date.now() - new Date(date).getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  };

  const needsWater = (plant: Plant) => {
    const days = daysSinceWater(plant.lastWatered);
    if (days === null) return true;
    return days >= plant.waterEveryDays;
  };

  if (loading) return <div className={styles.loading}>🌱 Cargando...</div>;

  return (
    <div className={styles.layout}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarTop}>
          <div className={styles.logoMark}>🌱</div>
          <h1 className={styles.appName}>PlantApp</h1>
        </div>
        <div className={styles.userInfo}>
          <div className={styles.avatar}>{user?.name?.[0]?.toUpperCase()}</div>
          <span className={styles.userName}>{user?.name}</span>
        </div>
        <button className={styles.logoutBtn} onClick={logout}>Cerrar sesión</button>
      </aside>

      {/* Main */}
      <main className={styles.main}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.greeting}>Mi colección</h2>
            <p className={styles.count}>{plants.length} planta{plants.length !== 1 ? 's' : ''}</p>
          </div>
          <div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleUpload}
            />
            <button
              className={styles.addBtn}
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? '🔍 Identificando...' : '+ Añadir planta'}
            </button>
          </div>
        </div>

        {plants.length === 0 && !uploading && (
          <div className={styles.empty}>
            <div className={styles.emptyIcon}>🪴</div>
            <h3>Tu colección está vacía</h3>
            <p>Sube una foto para identificar tu primera planta</p>
          </div>
        )}

        <div className={styles.grid}>
          {plants.map(plant => (
            <div
              key={plant.id}
              className={`${styles.card} ${needsWater(plant) ? styles.needsWater : ''}`}
              onClick={() => setSelected(plant)}
            >
              <div className={styles.cardImg}>
                <img src={plant.imageUrl} alt={plant.name} crossOrigin="anonymous" />
                {plant.toxic && <span className={styles.toxicBadge}>⚠️ Tóxica</span>}
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.plantName}>{plant.name}</h3>
                <p className={styles.plantSpecies}>{plant.species}</p>
                <div className={styles.cardMeta}>
                  <span>💧 Cada {plant.waterEveryDays} días</span>
                  {needsWater(plant) && <span className={styles.alertWater}>¡Necesita agua!</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Detail modal */}
      {selected && (
        <div className={styles.overlay} onClick={() => setSelected(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setSelected(null)}>✕</button>
            <img src={selected.imageUrl} alt={selected.name} className={styles.modalImg} crossOrigin="anonymous" />
            <div className={styles.modalBody}>
              <h2>{selected.name}</h2>
              <p className={styles.modalSpecies}>{selected.species}</p>
              {selected.toxic && <div className={styles.toxicAlert}>⚠️ Tóxica para mascotas</div>}
              <div className={styles.modalInfo}>
                <div className={styles.infoItem}><span>☀️</span>{selected.light}</div>
                <div className={styles.infoItem}><span>💧</span>Regar cada {selected.waterEveryDays} días</div>
                {selected.lastWatered && (
                  <div className={styles.infoItem}>
                    <span>📅</span>Último riego: hace {daysSinceWater(selected.lastWatered)} días
                  </div>
                )}
              </div>
              <p className={styles.careNotes}>{selected.careNotes}</p>
              <div className={styles.modalActions}>
                <button className={styles.waterBtn} onClick={() => handleWater(selected.id)}>
                  💧 Registrar riego
                </button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(selected.id)}>
                  🗑️ Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
