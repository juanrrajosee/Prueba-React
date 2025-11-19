"use client";

import styles from "./santuario.module.scss";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, FormEvent } from "react";

export default function SantuarioPage() {
  const { locale } = useParams() as { locale: string };
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Aquí más adelante podrás manejar el envío del formulario
    // de momento sólo prevenimos el refresh
  };

  return (
    <main className={styles.page}>
      {/* Panel lateral con la imagen */}
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

          {/* Si todavía no ha hecho click en "Añadir nueva criatura" */}
          {!isCreating && (
            <div className={styles.emptyState}>
              <p className={styles.emptyText}>
                Aún no has añadido ninguna criatura al santuario.
                <br />
                ¡Empieza tu colección ahora!
              </p>

              <button
                type="button"
                className={styles.button}
                onClick={() => setIsCreating(true)}
              >
                Añadir nueva criatura
              </button>
            </div>
          )}

          {/* Cuando hace click en "Añadir nueva criatura" aparece el creador */}
          {isCreating && (
            <section className={styles.creator}>
              <h3 className={styles.creatorTitle}>
                Creador de criaturas mágicas
              </h3>

              <form className={styles.creatorForm} onSubmit={handleSubmit}>
                {/* Fila 1: nombre + tipo */}
                <div className={styles.creatorRow}>
                  <label className={styles.creatorField}>
                    <span className={styles.creatorLabel}>
                      Nombre mágico de la criatura
                    </span>
                    <input
                      className={styles.creatorInput}
                      type="text"
                      name="nombre"
                      placeholder="Introduce el nombre de la criatura"
                      required
                    />
                  </label>

                  <label className={styles.creatorField}>
                    <span className={styles.creatorLabel}>Tipo de criatura</span>
                    <div className={styles.selectWrapper}>
                      <select
                        className={styles.creatorInput}
                        name="tipo"
                        defaultValue="fenix"
                        required
                      >
                        <option value="fenix">Fénix</option>
                        <option value="dragon">Dragón</option>
                        <option value="quimera">Quimera</option>
                        <option value="espiritu">Espíritu del bosque</option>
                      </select>
                      <span className={styles.selectIcon}></span>
                    </div>
                  </label>
                </div>

                {/* Fila 2: nivel de poder + entrenada */}
                <div className={styles.creatorRow}>
                  <label className={styles.creatorFieldWide}>
                    <span className={styles.creatorLabel}>Nivel de poder</span>
                    <input
                      className={styles.creatorInput}
                      type="text"
                      name="nivelPoder"
                      placeholder="I, II, III, maestro arcano..."
                    />
                  </label>
                    <div className={styles.creatorFieldSmall}>
                    <span className={styles.creatorLabel}>¿Entrenada?</span>

                    <div className={styles.checkboxGroup}>
                        <label className={styles.checkboxLabel}>
                        <input
                            type="radio"
                            name="entrenada"
                            value="si"
                            className={styles.checkboxInput}
                            defaultChecked
                        />
                        <span className={styles.checkboxCustom} />
                        <span>Sí</span>
                        </label>

                        <label className={styles.checkboxLabel}>
                        <input
                            type="radio"
                            name="entrenada"
                            value="no"
                            className={styles.checkboxInput}
                        />
                        <span className={styles.checkboxCustom} />
                        <span>No</span>
                        </label>
                    </div>
                    </div>
                </div>

                <div className={styles.creatorButtonWrapper}>
                  <button type="submit" className={styles.button}>
                    Registrar criatura
                  </button>
                </div>
              </form>
            </section>
          )}
        </div>
      </section>
    </main>
  );
}
