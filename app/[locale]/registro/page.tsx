"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import styles from "./registro.module.scss";

type Role = "CUIDADOR" | "MAESTRO";

// Regex de validación de contraseña:
// - Entre 8 y 24 caracteres
// - Al menos una mayúscula
// - Al menos un número
// - Solo letras y números
const PASSWORD_REGEX = /^(?=.*[A-Z])(?=.*\d)[A-Za-z0-9]{8,24}$/;

// Regex sencilla para validar email
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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


  //   VALIDACIÓN DEL FORMULARIO
 
  function validarFormulario(): boolean {
    setError(null);

    // Nombre mágico
    if (!nombreMagico || nombreMagico.trim().length === 0) {
      setError("El nombre mágico es obligatorio.");
      return false;
    }

    if (nombreMagico.length > 30) {
      setError("El nombre mágico puede tener como máximo 30 caracteres.");
      return false;
    }

    // Correo mágico
    if (!email || email.trim().length === 0) {
      setError("El correo mágico es obligatorio.");
      return false;
    }

    if (email.length > 40) {
      setError("El correo mágico puede tener como máximo 40 caracteres.");
      return false;
    }

    if (!EMAIL_REGEX.test(email)) {
      setError("Introduce un correo mágico válido.");
      return false;
    }

    // Palabra mágica (contraseña)
    if (!password) {
      setError("La palabra mágica es obligatoria.");
      return false;
    }

    if (!PASSWORD_REGEX.test(password)) {
      setError(
        "La palabra mágica debe tener entre 8 y 24 caracteres, al menos una mayúscula y al menos un número (solo letras y números)."
      );
      return false;
    }

    // Rol
    if (rol !== "CUIDADOR" && rol !== "MAESTRO") {
      setError("Debes seleccionar un rol válido.");
      return false;
    }

    return true;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Primero validamos en el cliente
    if (!validarFormulario()) {
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

      setSuccess(
        "Cuenta creada con éxito. Redirigiendo al inicio de sesión..."
      );
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
                maxLength={30} // límite duro en el input
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
                maxLength={40} // límite duro en el input
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
                maxLength={24} // límite máximo de longitud
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
