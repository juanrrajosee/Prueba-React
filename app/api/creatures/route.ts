import { NextResponse } from "next/server";
import {
  getCriaturasDeUsuario,
  crearCriatura,
  TipoCriatura,
} from "@/lib/creatures";

const currentUserId = "demo-user-1"; // TODO: usuario real con next-auth

export async function GET() {
  const lista = getCriaturasDeUsuario(currentUserId);
  return NextResponse.json(lista);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { nombre, tipo, nivelPoder, entrenada } = body as {
      nombre?: string;
      tipo?: TipoCriatura;
      nivelPoder?: string;
      entrenada?: boolean;
    };

    if (!nombre || !tipo) {
      return NextResponse.json(
        { error: "Faltan campos obligatorios: nombre, tipo" },
        { status: 400 }
      );
    }

    const nueva = crearCriatura({
      usuarioId: currentUserId,
      nombre,
      tipo,
      nivelPoder: nivelPoder || "I",
      entrenada: !!entrenada,
    });

    return NextResponse.json(nueva, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Error al crear la criatura" },
      { status: 500 }
    );
  }
}
