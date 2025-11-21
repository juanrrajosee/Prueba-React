"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { signIn } from "next-auth/react";
import styles from "./login.module.scss";

export default function LoginPage() {
  const router = useRouter();
  const params = useParams<{ locale: string }>();
  const locale = params.locale;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Debes introducir correo y contraseña");
      return;
    }

    setLoading(true);

    try {
      // 1) Intentamos iniciar sesión con NextAuth
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false, // manejamos la redirección a mano
      });

      if (!res || res.error) {
        setError("Correo o contraseña incorrectos");
        setLoading(false);
        return;
      }

      // 2) Obtenemos la sesión para saber el rol
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();

      const role = session?.user?.role;

      if (role === "MAESTRO") {
        router.push(`/${locale}/maestro/santuario`);
      } else {
        // Por defecto, cuidador
        router.push(`/${locale}/cuidador/santuario`);
      }
    } catch (err) {
      console.error(err);
      setError("Ha ocurrido un error al iniciar sesión");
      setLoading(false);
    }
  }

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
            y los cuidadores reconocidos pueden entrar.
          </p>

          {error && <p className={styles.error}>{error}</p>}

          <form className={styles.form} onSubmit={handleSubmit}>
            <label className={styles.label}>
              Correo mágico
              <input
                className={styles.input}
                type="email"
                placeholder="tunombre@santuario.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            <label className={styles.label}>
              Palabra mágica
              <input
                className={styles.input}
                type="password"
                placeholder="Introduce tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Accediendo..." : "Acceder al santuario"}
            </button>
          </form>

          <p className={styles.register}>
            ¿No tienes cuenta?{" "}
            <Link href={`/${locale}/registro`} className={styles.linkHighlight}>
              Regístrate en el refugio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
