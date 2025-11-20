"use client";

import styles from "./perfil.module.scss";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function MaestroPerfilPage() {
  const { locale } = useParams() as { locale: string };

  // De momento el total es fijo (puedes sincronizarlo luego con el santuario)
  const totalCriaturas = 5;

  return (
    <main className={styles.page}>
      {/* Panel lateral con la imagen del maestro */}
      <aside className={styles.imagePanel} />

      {/* Panel principal */}
      <section className={styles.mainPanel}>
        {/* Barra de navegación superior */}
        <header className={styles.header}>
          <nav className={styles.nav}>
            <Link
              href={`/${locale}/maestro/santuario`}
              className={styles.navItem}
            >
              Mis criaturas
            </Link>

            <button
              type="button"
              className={`${styles.navItem} ${styles.navItemActive}`}
            >
              Mi perfil
            </button>

            <Link href={`/${locale}/login`} className={styles.navItem}>
              Cerrar sesión
            </Link>
          </nav>
        </header>

        {/* Contenido principal */}
        <div className={styles.content}>
          {/* Títulos y descripción */}
          <div className={styles.titles}>
            <h1 className={styles.mainTitle}>El santuario</h1>
            <h2 className={styles.sectionTitle}>Mi perfil</h2>
            <p className={styles.sectionText}>
              Este es el lugar donde podrás gestionar, actualizar y personalizar
              la información de tu perfil.
            </p>
          </div>

          {/* Formulario de perfil */}
          <form className={styles.profileForm}>
            <label className={styles.profileField}>
              <span className={styles.profileLabel}>Nombre mágico</span>
              <input
                className={styles.profileInput}
                type="text"
                name="nombreMagico"
                defaultValue="Jaime el valiente"
              />
            </label>

            <label className={styles.profileField}>
              <span className={styles.profileLabel}>Correo mágico</span>
              <input
                className={styles.profileInput}
                type="email"
                name="correoMagico"
                defaultValue="jaime_valiente@bestiriario.com"
              />
            </label>

            <label className={styles.profileField}>
              <span className={styles.profileLabel}>Rol</span>
              <input
                className={styles.profileInput}
                type="text"
                name="rol"
                defaultValue="Maestro"
              />
            </label>

            <label className={styles.profileField}>
              <span className={styles.profileLabel}>Descripción</span>
              <textarea
                className={styles.profileTextarea}
                name="descripcion"
                rows={5}
                defaultValue={
                  "Soy Jaime el Valiente, maestro en el arte de invocar y dominar criaturas. " +
                  "En mis partidas, cada criatura tiene una historia, un propósito y un papel crucial " +
                  "en las épicas aventuras. Desde dragones imponentes hasta criaturas misteriosas de los bosques."
                }
              />
            </label>
          </form>

          {/* Sección especial del Maestro */}
          <section className={styles.masterStats}>
            <h3 className={styles.masterStatsTitle}>Resumen del maestro</h3>
            <p>
              Total de criaturas creadas:{" "}
              <span className={styles.masterStatsNumber}>
                {totalCriaturas}
              </span>
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
