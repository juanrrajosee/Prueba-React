"use client";

import { useEffect, useState, FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation"; // 👈 NUEVO
import styles from "./santuario.module.scss";
import type { Criatura, TipoCriatura } from "@/lib/creatures";

type FormState = {
  nombre: string;
  tipo: TipoCriatura | "";
  nivelPoder: string;
  entrenada: "si" | "no";
};

export default function MaestroSantuarioPage() {
  // ================================
  //   OBTENER LOCALE DESDE LA URL
  // ================================
  const params = useParams<{ locale: string }>();
  const locale = params.locale;

  const [criaturas, setCriaturas] = useState<Criatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [form, setForm] = useState<FormState>({
    nombre: "",
    tipo: "",
    nivelPoder: "",
    entrenada: "si",
  });

  // ================================
  //   CARGAR CRIATURAS DEL BACKEND
  // ================================
  useEffect(() => {
    async function cargar() {
      try {
        setLoading(true);
        const res = await fetch("/api/creatures", { cache: "no-store" });
        if (!res.ok) throw new Error("Error al cargar criaturas");
        const data: Criatura[] = await res.json();
        setCriaturas(data);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("No se pudieron cargar las criaturas");
      } finally {
        setLoading(false);
      }
    }

    cargar();
  }, []);

  // ================================
  //   MANEJO DE FORMULARIO
  // ================================

  function abrirCrear() {
    setEditingId(null);
    setForm({
      nombre: "",
      tipo: "",
      nivelPoder: "",
      entrenada: "si",
    });
    setIsFormOpen(true);
  }

  function manejarCambio(campo: keyof FormState, valor: string) {
    setForm((prev) => ({
      ...prev,
      [campo]: valor,
    }));
  }

  async function manejarSubmit(e: FormEvent) {
    e.preventDefault();

    if (!form.nombre || !form.tipo) {
      alert("El nombre y el tipo son obligatorios");
      return;
    }

    const payload = {
      nombre: form.nombre,
      tipo: form.tipo,
      nivelPoder: form.nivelPoder || "I",
      entrenada: form.entrenada === "si",
    };

    try {
      let res: Response;

      if (editingId) {
        // EDITAR
        res = await fetch(`/api/creatures/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        // CREAR
        res = await fetch("/api/creatures", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      if (!res.ok) {
        console.error(await res.text());
        alert("Error al guardar la criatura");
        return;
      }

      const criaturaGuardada: Criatura = await res.json();

      if (editingId) {
        setCriaturas((prev) =>
          prev.map((c) => (c.id === criaturaGuardada.id ? criaturaGuardada : c))
        );
      } else {
        setCriaturas((prev) => [...prev, criaturaGuardada]);
      }

      setIsFormOpen(false);
      setEditingId(null);
    } catch (e) {
      console.error(e);
      alert("Error de conexión con el servidor");
    }
  }

  function manejarEditar(c: Criatura) {
    setEditingId(c.id);
    setForm({
      nombre: c.nombre,
      tipo: c.tipo,
      nivelPoder: c.nivelPoder,
      entrenada: c.entrenada ? "si" : "no",
    });
    setIsFormOpen(true);
  }

  // Solo Maestro puede eliminar
  async function manejarEliminar(id: string) {
    if (!confirm("¿Seguro que quieres eliminar esta criatura?")) return;

    try {
      const res = await fetch(`/api/creatures/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        console.error(await res.text());
        alert("Error al eliminar la criatura");
        return;
      }

      setCriaturas((prev) => prev.filter((c) => c.id !== id));
    } catch (e) {
      console.error(e);
      alert("Error de conexión con el servidor");
    }
  }

  // ================================
  //   VISTA
  // ================================

  return (
    <div className={styles.page}>
      {/* Panel de imagen igual que en cuidador */}
      <div className={styles.imagePanel}></div>

      {/* Panel principal */}
      <div className={styles.mainPanel}>
        <header className={styles.header}>
          <h1 className={styles.title}>El santuario</h1>

          <nav className={styles.nav}>
            <Link
              href={`/${locale}/maestro/santuario`}
              className={styles.navItemActive}
            >
              Mis criaturas
            </Link>
            <Link
              href={`/${locale}/maestro/perfil`}
              className={styles.navItem}
            >
              Mi perfil
            </Link>
            <span className={styles.navItem}>Cerrar sesión</span>
          </nav>
        </header>

        <main className={styles.content}>
          <section className={styles.intro}>
            <h2 className={styles.sectionTitle}>Mis criaturas</h2>
            <p className={styles.sectionText}>
              Explora y gestiona todas las criaturas mágicas que has
              recolectado. Como maestro, puedes invocarlas, entrenarlas y
              perfeccionar su poder.
            </p>
          </section>

          <section className={styles.actionsRow}>
            <button
              type="button"
              className={styles.primaryButton}
              onClick={abrirCrear}
            >
              Añadir nueva criatura
            </button>
          </section>

          {isFormOpen && (
            <section className={styles.formSection}>
              <h3 className={styles.formTitle}>
                {editingId
                  ? "Editar criatura mágica"
                  : "Creador de criaturas mágicas"}
              </h3>

              <form className={styles.form} onSubmit={manejarSubmit}>
                <div className={styles.formRow}>
                  <label className={styles.label}>
                    Nombre mágico de la criatura
                    <input
                      className={styles.input}
                      type="text"
                      value={form.nombre}
                      onChange={(e) =>
                        manejarCambio("nombre", e.target.value)
                      }
                      placeholder="Introduce el nombre de la criatura"
                    />
                  </label>

                  <label className={styles.label}>
                    Tipo de criatura
                    <select
                      className={styles.input}
                      value={form.tipo}
                      onChange={(e) =>
                        manejarCambio(
                          "tipo",
                          e.target.value as TipoCriatura | ""
                        )
                      }
                    >
                      <option value="">Selecciona un tipo</option>
                      <option value="dragon">Dragón</option>
                      <option value="fenix">Fénix</option>
                      <option value="golem">Golem</option>
                      <option value="vampiro">Vampiro</option>
                      <option value="unicornio">Unicornio</option>
                    </select>
                  </label>
                </div>

                <div className={styles.formRow}>
                  <label className={styles.label}>
                    Nivel de poder
                    <input
                      className={styles.input}
                      type="text"
                      value={form.nivelPoder}
                      onChange={(e) =>
                        manejarCambio("nivelPoder", e.target.value)
                      }
                      placeholder="I, II, III, 3º, etc."
                    />
                  </label>

                  <div className={styles.label}>
                    ¿Entrenada?
                    <div className={styles.radioGroup}>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="entrenada"
                          checked={form.entrenada === "si"}
                          onChange={() => manejarCambio("entrenada", "si")}
                        />
                        Sí
                      </label>
                      <label className={styles.radioLabel}>
                        <input
                          type="radio"
                          name="entrenada"
                          checked={form.entrenada === "no"}
                          onChange={() => manejarCambio("entrenada", "no")}
                        />
                        No
                      </label>
                    </div>
                  </div>
                </div>

                <div className={styles.formActions}>
                  <button
                    type="button"
                    className={styles.secondaryButton}
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingId(null);
                    }}
                  >
                    Cancelar
                  </button>
                  <button type="submit" className={styles.primaryButton}>
                    {editingId ? "Guardar cambios" : "Registrar criatura"}
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className={styles.tableSection}>
            {loading && <p>Cargando criaturas...</p>}
            {error && <p className={styles.error}>{error}</p>}

            {!loading && !error && (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Nivel</th>
                    <th>Entrenada</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {criaturas.length === 0 ? (
                    <tr>
                      <td colSpan={5} className={styles.emptyRow}>
                        Aún no has registrado ninguna criatura como maestro.
                      </td>
                    </tr>
                  ) : (
                    criaturas.map((c) => (
                      <tr key={c.id}>
                        <td>{c.nombre}</td>
                        <td>{c.tipo}</td>
                        <td>{c.nivelPoder}</td>
                        <td>{c.entrenada ? "Sí" : "No"}</td>
                        <td className={styles.actionsCell}>
                          <button
                            type="button"
                            className={styles.iconButton}
                            onClick={() => manejarEditar(c)}
                          >
                            ✏️
                          </button>
                          <button
                            type="button"
                            className={styles.iconButtonDelete}
                            onClick={() => manejarEliminar(c.id)}
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </section>
        </main>
      </div>
    </div>
  );
}
