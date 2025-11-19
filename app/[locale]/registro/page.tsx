"use client";

import styles from "./registro.module.scss";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function RegistroPage() {
  const { locale } = useParams() as { locale: string };

  return (
    <main className={styles.page}>
      {/* Panel de imagen */}
      <section className={styles.imagePanel} />

      {/* Panel del formulario */}
      <section className={styles.formPanel}>
        <div className={styles.formContent}>
          <h1 className={styles.title}>Únete al santuario</h1>

          <p className={styles.subtitle}>
            Elige si serás un cuidador o maestro de criaturas.
            <br />
            Completa los detalles para comenzar.
          </p>

          <form className={styles.form}>
            {/* Nombre mágico */}
            <label className={styles.label}>
              <span>Nombre mágico</span>
              <input
                className={styles.input}
                type="text"
                name="nombreMagico"
                placeholder="Introduce tu nombre mágico"
                required
              />
            </label>

            {/* Correo mágico */}
            <label className={styles.label}>
              <span>Correo mágico</span>
              <input
                className={styles.input}
                type="email"
                name="correoMagico"
                placeholder="tunombre@bestirario.com"
                required
              />
            </label>

            {/* Rol */}
            <label className={styles.label}>
              <span>Rol</span>
              <div className={styles.selectWrapper}>
                <select
                  className={styles.input}
                  name="rol"
                  defaultValue="cuidador"
                  required
                >
                  <option value="cuidador">Cuidador</option>
                  <option value="maestro">Maestro de criaturas</option>
                  <option value="explorador">Explorador</option>
                </select>
                <span className={styles.selectIcon}>⌄</span>
              </div>
            </label>

            {/* Palabra mágica */}
            <label className={styles.label}>
              <span>Palabra mágica</span>
              <input
                className={styles.input}
                type="password"
                name="password"
                placeholder="Introduce tu palabra mágica"
                required
              />
            </label>

            <button className={styles.button} type="submit">
              Registrarme en el santuario
            </button>
          </form>

          <p className={styles.register}>
            ¿Tienes cuenta?{" "}
            <Link href={`/${locale}/login`}>Inicia sesión en el refugio</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
