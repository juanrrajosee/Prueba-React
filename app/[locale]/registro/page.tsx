"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import styles from "./registro.module.scss";

type Role = "CUIDADOR" | "MAESTRO";

export default function RegistroPage() {
  const params = useParams<{ locale: string }>();
  const router = useRouter();
  const locale = params.locale;

  const [nombreMagico, setNombreMagico] = useState("");
  const [email, setEmail] = useState("");
  const [rol, setRol] = useState<Role>("CUIDADOR");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!nombreMagico || !email || !password) {
      setError("Rellena todos los campos");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role: rol,
          nombreMagico,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "No se pudo crear la cuenta");
        setLoading(false);
        return;
      }

      setSuccess("Cuenta creada con éxito. Redirigiendo al inicio de sesión...");
      setLoading(false);

      setTimeout(() => {
        router.push(`/${locale}/login`);
      }, 1200);
    } catch (err) {
      console.error(err);
      setError("Error de conexión con el servidor");
      setLoading(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* Panel de la imagen (lado izquierdo) */}
      <div className={styles.imagePanel}></div>

      {/* Panel del formulario */}
      <div className={styles.formPanel}>
        <div className={styles.formContent}>
          <h1 className={styles.title}>Únete al santuario</h1>
          <p className={styles.subtitle}>
            Elige si serás un cuidador o maestro de criaturas.
            <br />
            Completa los detalles para comenzar.
          </p>

          {error && <p className={styles.error}>{error}</p>}
          {success && <p className={styles.success}>{success}</p>}

          <form className={styles.form} onSubmit={handleSubmit}>
            {/* Nombre mágico */}
            <label className={styles.label}>
              Nombre mágico
              <input
                className={styles.input}
                type="text"
                placeholder="Introduce tu nombre mágico"
                value={nombreMagico}
                onChange={(e) => setNombreMagico(e.target.value)}
              />
            </label>

            {/* Correo mágico */}
            <label className={styles.label}>
              Correo mágico
              <input
                className={styles.input}
                type="email"
                placeholder="tunombre@bestiario.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>

            {/* Rol (select) */}
            <label className={styles.label}>
              Rol
              <select
                className={styles.input}
                value={rol}
                onChange={(e) => setRol(e.target.value as Role)}
              >
                <option value="CUIDADOR">Cuidador</option>
                <option value="MAESTRO">Maestro</option>
              </select>
            </label>

            {/* Palabra mágica (contraseña) */}
            <label className={styles.label}>
              Palabra mágica
              <input
                className={styles.input}
                type="password"
                placeholder="Introduce tu palabra mágica"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </label>

            <button type="submit" className={styles.button} disabled={loading}>
              {loading ? "Registrando..." : "Registrarme en el santuario"}
            </button>
          </form>

          <p className={styles.register}>
            ¿Tienes cuenta?{" "}
            <Link href={`/${locale}/login`} className={styles.linkHighlight}>
              Inicia sesión en el refugio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
