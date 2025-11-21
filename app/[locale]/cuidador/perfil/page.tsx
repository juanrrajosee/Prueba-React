"use client";

import styles from "./perfil.module.scss";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function PerfilPage() {
  const { locale } = useParams() as { locale: string };

  return (
    <main className={styles.page}>
      {/* Panel lateral con la imagen */}
      <aside className={styles.imagePanel} />

      {/* Panel principal */}
      <section className={styles.mainPanel}>
        {/* Barra de navegación superior */}
        <header className={styles.header}>
          <nav className={styles.nav}>
            <Link
              href={`/${locale}/cuidador/santuario`}
              className={styles.navItem}
            >
              Mis criaturas
            </Link>

            <button
              className={`${styles.navItem} ${styles.navItemActive}`}
              type="button"
            >
              Mi perfil
            </button>

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
                defaultValue="Radagast el Jardinero"
              />
            </label>

            <label className={styles.profileField}>
              <span className={styles.profileLabel}>Correo mágico</span>
              <input
                className={styles.profileInput}
                type="email"
                name="correoMagico"
                defaultValue="radijar@santuario.com"
              />
            </label>

            <label className={styles.profileField}>
              <span className={styles.profileLabel}>Rol</span>
              <input
                className={styles.profileInput}
                type="text"
                name="rol"
                defaultValue="Cuidador"
              />
            </label>

            <label className={styles.profileField}>
              <span className={styles.profileLabel}>Descripción</span>
              <textarea
                className={styles.profileTextarea}
                name="descripcion"
                rows={5}
                defaultValue={
                  "Soy un guardián del bosque y protector de criaturas mágicas. " +
                  "Soy un tanto excéntrico, dedico mi vida a cuidar de una vasta " +
                  "variedad de seres fantásticos, desde majestuosos dragones hasta " +
                  "diminutas hadas. Poseo un vasto conocimiento de las artes curativas " +
                  "y la magia antigua, lo que me permite sanar y proteger a las criaturas " +
                  "que encuentro en sus viajes."
                }
              />
            </label>
          </form>
        </div>
      </section>
    </main>
  );
}
