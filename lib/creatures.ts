// lib/creatures.ts
// Tipos reutilizables en el frontend

export type TipoCriatura =
  | "dragon"
  | "fenix"
  | "golem"
  | "vampiro"
  | "unicornio";

export interface Criatura {
  id: string;
  usuarioId: string;
  nombre: string;
  tipo: TipoCriatura;
  nivelPoder: string;
  entrenada: boolean;
}
