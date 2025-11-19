"use client";

import styles from "./santuario.module.scss";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, FormEvent } from "react";

type CreatureType = "Dragón" | "Fénix" | "Golem" | "Grifo" | "Vampiro";

type Creature = {
  id: number;
  nombre: string;
  tipo: CreatureType;
  nivel: string;
  entrenada: boolean;
};

const INITIAL_CREATURES: Creature[] = [
  { id: 1, nombre: "Abyssaloth", tipo: "Fénix", nivel: "IV", entrenada: true },
  { id: 2, nombre: "Luminara", tipo: "Dragón", nivel: "I", entrenada: true },
  { id: 3, nombre: "Velokron", tipo: "Golem", nivel: "II", entrenada: false },
  { id: 4, nombre: "Zyphra", tipo: "Vampiro", nivel: "V", entrenada: true },
  { id: 5, nombre: "Thornclaw", tipo: "Grifo", nivel: "III", entrenada: false },
];

export default function MaestroSantuarioPage() {
  const { locale } = useParams() as { locale: string };

  const [creatures, setCreatures] = useState<Creature[]>(INITIAL_CREATURES);
  const [selectedTypes, setSelectedTypes] = useState<CreatureType[]>([]);
  const [searchName, setSearchName] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Campos del formulario
  const [formNombre, setFormNombre] = useState("");
  const [formTipo, setFormTipo] = useState<CreatureType>("Fénix");
  const [formNivel, setFormNivel] = useState("");
  const [formEntrenada, setFormEntrenada] = useState<"si" | "no">("si");

  const tipos: CreatureType[] = ["Dragón", "Fénix", "Golem", "Grifo", "Vampiro"];

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
    setFormTipo("Fénix");
    setFormNivel("");
    setFormEntrenada("si");
    setShowForm(true);
  };

  const openEditForm = (creature: Creature) => {
    setEditingId(creature.id);
    setFormNombre(creature.nombre);
    setFormTipo(creature.tipo);
    setFormNivel(creature.nivel);
    setFormEntrenada(creature.entrenada ? "si" : "no");
    setShowForm(true);
  };

  const handleFilterTypeChange = (tipo: CreatureType) => {
    setSelectedTypes((prev) =>
      prev.includes(tipo) ? prev.filter((t) => t !== tipo) : [...prev, tipo]
    );
  };

  const handleDelete = (id: number) => {
    if (!confirm("¿Eliminar esta criatura del santuario?")) return;
    setCreatures((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    const entrenadaBool = formEntrenada === "si";

    if (editingId === null) {
      // Crear
      const newCreature: Creature = {
        id: Date.now(),
        nombre: formNombre,
        tipo: formTipo,
        nivel: formNivel || "I",
        entrenada: entrenadaBool,
      };
      setCreatures((prev) => [...prev, newCreature]);
    } else {
      // Editar
      setCreatures((prev) =>
        prev.map((c) =>
          c.id === editingId
            ? {
                ...c,
                nombre: formNombre,
                tipo: formTipo,
                nivel: formNivel || c.nivel,
                entrenada: entrenadaBool,
              }
            : c
        )
      );
    }

    setShowForm(false);
  };

  return (
    <main className={styles.page}>
      {/* Panel lateral con imagen del maestro */}
      <aside className={styles.imagePanel} />

      {/* Panel principal */}
      <section className={styles.mainPanel}>
        {/* Navegación superior */}
        <header className={styles.header}>
          <nav className={styles.nav}>
            <button
              type="button"
              className={`${styles.navItem} ${styles.navItemActive}`}
            >
              Mis criaturas
            </button>
            <Link
              href={`/${locale}/maestro/perfil`}
              className={styles.navItem}
            >
              Mi perfil
            </Link>
            <Link href={`/${locale}/login`} className={styles.navItem}>
              Cerrar sesión
            </Link>
          </nav>
        </header>

        {/* Contenido */}
        <div className={styles.content}>
          <div className={styles.titles}>
            <h1 className={styles.mainTitle}>El santuario</h1>
            <h2 className={styles.sectionTitle}>Mis criaturas</h2>
            <p className={styles.sectionText}>
              Explora y gestiona todas las criaturas mágicas que has recolectado.
              Cada una tiene habilidades únicas y características especiales.
            </p>
          </div>

          {/* Botón principal + filtro + tabla */}
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
            {/* Panel de filtros */}
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
                    <span>{tipo}</span>
                  </label>
                ))}
              </div>

              <button type="button" className={styles.confirmButton}>
                Confirmar
              </button>
            </aside>

            {/* Listado de criaturas */}
            <section className={styles.tableSection}>
              {/* Buscador por nombre */}
              <div className={styles.searchBlock}>
                <span className={styles.searchLabel}>Palabra mágica</span>
                <input
                  className={styles.searchInput}
                  placeholder="Nombre"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                />
              </div>

              {/* Tabla */}
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
                      <td>{c.tipo}</td>
                      <td>{c.nivel}</td>
                      <td>{c.entrenada ? "Sí" : "No"}</td>
                      <td className={styles.actionCell}>
                        <button
                          type="button"
                          className={styles.iconButton}
                          onClick={() => openEditForm(c)}
                          aria-label="Editar"
                        >
                          ✏️
                        </button>
                        <button
                          type="button"
                          className={styles.iconButton}
                          onClick={() => handleDelete(c.id)}
                          aria-label="Eliminar"
                        >
                          🗑️
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

          {/* Formulario crear/editar criatura */}
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
                    <span className={styles.creatorLabel}>Tipo de criatura</span>
                    <div className={styles.selectWrapper}>
                      <select
                        className={styles.creatorInput}
                        value={formTipo}
                        onChange={(e) =>
                          setFormTipo(e.target.value as CreatureType)
                        }
                      >
                        {tipos.map((tipo) => (
                          <option key={tipo} value={tipo}>
                            {tipo}
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
                    className={`${styles.buttonSecondary}`}
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
        </div>
      </section>
    </main>
  );
}
