"use client";

import styles from "./santuario.module.scss";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState, FormEvent } from "react";
import type { Criatura, TipoCriatura } from "@/lib/creatures";

type FormEntrenada = "si" | "no";

export default function CuidadorSantuarioPage() {
  const { locale } = useParams() as { locale: string };

  const [creatures, setCreatures] = useState<Criatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedTypes, setSelectedTypes] = useState<TipoCriatura[]>([]);
  const [searchName, setSearchName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formNombre, setFormNombre] = useState("");
  const [formTipo, setFormTipo] = useState<TipoCriatura>("fenix");
  const [formNivel, setFormNivel] = useState("");
  const [formEntrenada, setFormEntrenada] = useState<FormEntrenada>("si");

  const tipos: TipoCriatura[] = ["dragon", "fenix", "golem", "vampiro", "unicornio"];

 
  // Cargar criaturas del backend
  
  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/creatures");
        if (!res.ok) throw new Error("No se pudieron cargar las criaturas");
        const data: Criatura[] = await res.json();
        setCreatures(data);
        setError(null);
      } catch (e: any) {
        setError(e.message ?? "Error cargando criaturas");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const filteredCreatures = creatures.filter((c) => {
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(c.tipo);
    const matchesName =
      searchName.trim() === "" ||
      c.nombre.toLowerCase().includes(searchName.toLowerCase());
    return matchesType && matchesName;
  });

  const openCreateForm = () => {
    setEditingId(null);
    setFormNombre("");
    setFormTipo("fenix");
    setFormNivel("");
    setFormEntrenada("si");
    setShowForm(true);
  };

  const openEditForm = (creature: Criatura) => {
    setEditingId(creature.id);
    setFormNombre(creature.nombre);
    setFormTipo(creature.tipo);
    setFormNivel(creature.nivelPoder);
    setFormEntrenada(creature.entrenada ? "si" : "no");
    setShowForm(true);
  };

  const handleFilterTypeChange = (tipo: TipoCriatura) => {
    setSelectedTypes((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  };


  // Crear / actualizar criatura
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const payload = {
      nombre: formNombre,
      tipo: formTipo,
      nivelPoder: formNivel || "I",
      entrenada: formEntrenada === "si",
    };

    try {
      if (editingId === null) {
        // Crear
        const res = await fetch("/api/creatures", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Error al crear la criatura");
        const nueva: Criatura = await res.json();
        setCreatures((prev) => [...prev, nueva]);
      } else {
        // Actualizar
        const res = await fetch(`/api/creatures/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error("Error al actualizar la criatura");
        const actualizada: Criatura = await res.json();
        setCreatures((prev) =>
          prev.map((c) => (c.id === actualizada.id ? actualizada : c))
        );
      }

      setShowForm(false);
      setError(null);
    } catch (e: any) {
      setError(e.message ?? "Error guardando la criatura");
    }
  };

  return (
    <main className={styles.page}>
      <aside className={styles.imagePanel} />

      <section className={styles.mainPanel}>
        <header className={styles.header}>
          <nav className={styles.nav}>
            <button
              type="button"
              className={`${styles.navItem} ${styles.navItemActive}`}
            >
              Mis criaturas
            </button>
            <Link
              href={`/${locale}/cuidador/perfil`}
              className={styles.navItem}
            >
              Mi perfil
            </Link>
            <Link href={`/${locale}/login`} className={styles.navItem}>
              Cerrar sesión
            </Link>
          </nav>
        </header>

        <div className={styles.content}>
          <div className={styles.titles}>
            <h1 className={styles.mainTitle}>El santuario</h1>
            <h2 className={styles.sectionTitle}>Mis criaturas</h2>
            <p className={styles.sectionText}>
              Explora y gestiona todas las criaturas mágicas que has recolectado.
              Cada una tiene habilidades únicas y características especiales.
            </p>
          </div>

          {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
          {loading && <p>Cargando criaturas...</p>}

          {!loading && (
            <>
              <div className={styles.topRow}>
                <button
                  type="button"
                  className={styles.mainButton}
                  onClick={openCreateForm}
                >
                  Añadir nueva criatura
                </button>
              </div>

              <div className={styles.layout}>
                <aside className={styles.filterPanel}>
                  <h3 className={styles.filterTitle}>Filtrar</h3>
                  <p className={styles.filterSubtitle}>Buscar por tipo</p>

                  <div className={styles.filterChecks}>
                    {tipos.map((tipo) => (
                      <label key={tipo} className={styles.checkboxLabel}>
                        <input
                          type="checkbox"
                          className={styles.checkboxInput}
                          checked={selectedTypes.includes(tipo)}
                          onChange={() => handleFilterTypeChange(tipo)}
                        />
                        <span className={styles.checkboxCustom} />
                        <span>
                          {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                        </span>
                      </label>
                    ))}
                  </div>

                  <button type="button" className={styles.confirmButton}>
                    Confirmar
                  </button>
                </aside>

                <section className={styles.tableSection}>
                  <div className={styles.searchBlock}>
                    <span className={styles.searchLabel}>Palabra mágica</span>
                    <input
                      className={styles.searchInput}
                      placeholder="Nombre"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                    />
                  </div>

                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>Nombre</th>
                        <th>Tipo</th>
                        <th>Nivel</th>
                        <th>Entrenado</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCreatures.map((c) => (
                        <tr key={c.id}>
                          <td>{c.nombre}</td>
                          <td>
                            {c.tipo.charAt(0).toUpperCase() + c.tipo.slice(1)}
                          </td>
                          <td>{c.nivelPoder}</td>
                          <td>{c.entrenada ? "Sí" : "No"}</td>
                          <td className={styles.actionCell}>
                            {}
                            <button
                              type="button"
                              className={styles.iconButton}
                              onClick={() => openEditForm(c)}
                              aria-label="Editar"
                            >
                              ✏️
                            </button>
                          </td>
                        </tr>
                      ))}

                      {filteredCreatures.length === 0 && (
                        <tr>
                          <td colSpan={5} className={styles.emptyRow}>
                            No se han encontrado criaturas con esos filtros.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </section>
              </div>

              {showForm && (
                <section className={styles.creator}>
                  <h3 className={styles.creatorTitle}>
                    {editingId ? "Editar criatura mágica" : "Creador de criaturas mágicas"}
                  </h3>

                  <form className={styles.creatorForm} onSubmit={handleSubmit}>
                    <div className={styles.creatorRow}>
                      <label className={styles.creatorField}>
                        <span className={styles.creatorLabel}>
                          Nombre mágico de la criatura
                        </span>
                        <input
                          className={styles.creatorInput}
                          type="text"
                          value={formNombre}
                          onChange={(e) => setFormNombre(e.target.value)}
                          placeholder="Introduce el nombre de la criatura"
                          required
                        />
                      </label>

                      <label className={styles.creatorField}>
                        <span className={styles.creatorLabel}>
                          Tipo de criatura
                        </span>
                        <div className={styles.selectWrapper}>
                          <select
                            className={styles.creatorInput}
                            value={formTipo}
                            onChange={(e) =>
                              setFormTipo(e.target.value as TipoCriatura)
                            }
                          >
                            {tipos.map((tipo) => (
                              <option key={tipo} value={tipo}>
                                {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                              </option>
                            ))}
                          </select>
                          <span className={styles.selectIcon}>⌄</span>
                        </div>
                      </label>
                    </div>

                    <div className={styles.creatorRow}>
                      <label className={styles.creatorFieldWide}>
                        <span className={styles.creatorLabel}>Nivel de poder</span>
                        <input
                          className={styles.creatorInput}
                          type="text"
                          value={formNivel}
                          onChange={(e) => setFormNivel(e.target.value)}
                          placeholder="I, II, III, maestro arcano..."
                        />
                      </label>

                      <div className={styles.creatorFieldSmall}>
                        <span className={styles.creatorLabel}>¿Entrenada?</span>
                        <div className={styles.checkboxGroup}>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="radio"
                              className={styles.checkboxInput}
                              checked={formEntrenada === "si"}
                              onChange={() => setFormEntrenada("si")}
                            />
                            <span className={styles.checkboxCustom} />
                            <span>Sí</span>
                          </label>
                          <label className={styles.checkboxLabel}>
                            <input
                              type="radio"
                              className={styles.checkboxInput}
                              checked={formEntrenada === "no"}
                              onChange={() => setFormEntrenada("no")}
                            />
                            <span className={styles.checkboxCustom} />
                            <span>No</span>
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className={styles.creatorButtons}>
                      <button
                        type="button"
                        className={styles.buttonSecondary}
                        onClick={() => setShowForm(false)}
                      >
                        Cancelar
                      </button>
                      <button type="submit" className={styles.button}>
                        {editingId ? "Guardar cambios" : "Registrar criatura"}
                      </button>
                    </div>
                  </form>
                </section>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
