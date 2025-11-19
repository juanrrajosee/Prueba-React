"use client";

import styles from "./santuario.module.scss";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function SantuarioPage() {
  const { locale } = useParams() as { locale: string };

  return (
    <main className={styles.page}>
      {/* Panel lateral con el mago */}
      <aside className={styles.imagePanel} />

      {/* Panel principal */}
      <section className={styles.mainPanel}>
        {/* Barra de navegación superior */}
        <header className={styles.header}>
          <nav className={styles.nav}>
            <button className={`${styles.navItem} ${styles.navItemActive}`}>
              Mis criaturas
            </button>
            <button className={styles.navItem}>Mi perfil</button>
            <Link
              href={`/${locale}/login`}
              className={`${styles.navItem} ${styles.navItemLink}`}
            >
              Cerrar sesión
            </Link>
          </nav>
        </header>

        {/* Contenido principal */}
        <div className={styles.content}>
          <div className={styles.titles}>
            <h1 className={styles.mainTitle}>El santuario</h1>
            <h2 className={styles.sectionTitle}>Mis criaturas</h2>
            <p className={styles.sectionText}>
              Explora y gestiona todas las criaturas mágicas que has recolectado.
              Cada una tiene habilidades únicas y características especiales.
            </p>
          </div>

          <div className={styles.emptyState}>
            <p className={styles.emptyText}>
              Aún no has añadido ninguna criatura al santuario.
              <br />
              ¡Empieza tu colección ahora!
            </p>

            <button className={styles.button}>
              Añadir nueva criatura
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
