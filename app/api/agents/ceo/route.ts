import { NextRequest, NextResponse } from "next/server";
import { isDemoMode } from "@/lib/demo/is-demo";
import { mockAnalyseStrategique } from "@/lib/demo/mock-agents";
import { MOCK_PROFILE } from "@/lib/demo/mock-data";

export const maxDuration = 120;

export async function POST(req: NextRequest) {
  const { objectifs, problemes } = await req.json();

  if (isDemoMode()) {
    const analyse = await mockAnalyseStrategique({
      nomEntreprise: MOCK_PROFILE.nom_entreprise,
      secteur: "services",
      nbMoisActivite: 24,
      caTotal: 80000,
      nbClients: 12,
      objectifs: objectifs || "",
      problemes: problemes || "",
    });
    return NextResponse.json({ analyse });
  }

  return NextResponse.json({ erreur: "Mode production non configuré" }, { status: 501 });
}
