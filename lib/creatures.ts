// lib/creatures.ts

export type RolUsuario = "CUIDADOR" | "MAESTRO";

export type TipoCriatura = "dragon" | "fenix" | "golem" | "vampiro" | "unicornio";

export interface Criatura {
  id: string;
  usuarioId: string; // propietario
  nombre: string;
  tipo: TipoCriatura;
  nivelPoder: string; // "I", "II", "Maestro arcano", etc.
}

// "Base de datos" en memoria (se pierde al reiniciar)
let criaturas: Criatura[] = [];

export function getCriaturasDeUsuario(usuarioId: string): Criatura[] {
  return criaturas.filter((c) => c.usuarioId === usuarioId);
}

export function getCriaturaDeUsuario(
  id: string,
  usuarioId: string
): Criatura | undefined {
  return criaturas.find((c) => c.id === id && c.usuarioId === usuarioId);
}

export function crearCriatura(datos: Omit<Criatura, "id">): Criatura {
  const nueva: Criatura = {
    id: crypto.randomUUID(),
    ...datos,
  };
  criaturas.push(nueva);
  return nueva;
}

export function actualizarCriatura(
  id: string,
  usuarioId: string,
  datos: Partial<Omit<Criatura, "id" | "usuarioId">>
): Criatura | null {
  const index = criaturas.findIndex((c) => c.id === id && c.usuarioId === usuarioId);
  if (index === -1) return null;

  criaturas[index] = {
    ...criaturas[index],
    ...datos,
  };

  return criaturas[index];
}

export function eliminarCriatura(id: string, usuarioId: string): boolean {
  const before = criaturas.length;
  criaturas = criaturas.filter((c) => !(c.id === id && c.usuarioId === usuarioId));
  return criaturas.length < before;
}
