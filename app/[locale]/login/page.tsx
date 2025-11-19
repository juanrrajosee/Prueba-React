"use client";

import styles from "./login.module.scss";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function LoginPage() {
  const { locale } = useParams() as { locale: string };

  return (
    <div className={styles.page}>
      {/* Panel de la imagen */}
      <div className={styles.imagePanel}></div>

      {/* Panel del formulario */}
      <div className={styles.formPanel}>
        <div className={styles.formContent}>
          <h1 className={styles.title}>Inicia sesión</h1>

          <p className={styles.subtitle}>
            Para acceder a la colección de criaturas mágicas. Sólo los maestros
            y los cuidadores reconocidos pueden entrar
          </p>

          <form className={styles.form}>
            <label className={styles.label}>
              Correo mágico
              <input
                className={styles.input}
                type="email"
                placeholder="tunombre@santuario.com"
              />
            </label>

            <label className={styles.label}>
              Palabra mágica
              <input
                className={styles.input}
                type="password"
                placeholder="Introduce tu contraseña"
              />
            </label>

            <button type="submit" className={styles.button}>
              Acceder al santuario
            </button>
          </form>

          <p className={styles.register}>
            ¿No tienes cuenta?{" "}
            <Link href={`/${locale}/registro`}>Regístrate en el refugio</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
