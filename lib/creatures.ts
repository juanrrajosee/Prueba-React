// lib/creatures.ts
export type TipoCriatura = "dragon" | "fenix" | "golem" | "vampiro" | "unicornio";

export type Criatura = {
  id: string;
  usuarioId: string;   // viene de Prisma userId
  nombre: string;
  tipo: TipoCriatura;
  nivelPoder: string;
  entrenada: boolean;
};

// Esta función solo adapta el objeto de Prisma al que usa el front
export function mapCreatureToApi(c: any): Criatura {
  return {
    id: c.id,
    usuarioId: c.userId,   // <- OJO, aquí viene de Prisma
    nombre: c.nombre,
    tipo: c.tipo,
    nivelPoder: c.nivelPoder,
    entrenada: c.entrenada,
  };
}
