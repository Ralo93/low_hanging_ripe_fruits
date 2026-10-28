import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { calculateDimensionScores } from "@/lib/scoring";

type SubmitBody = {
  nickname: string | null;
  answers: Record<number, number>;
};

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as SubmitBody;

    if (!body.answers) {
      return NextResponse.json(
        { error: "Antworten fehlen." },
        { status: 400 }
      );
    }

    const scores = calculateDimensionScores(body.answers);

    const payload = {
      nickname: body.nickname,
      answer1: body.answers[1],
      answer2: body.answers[2],
      answer3: body.answers[3],
      answer4: body.answers[4],
      answer5: body.answers[5],
      answer6: body.answers[6],
      answer7: body.answers[7],
      answer8: body.answers[8],
      answer9: body.answers[9],
      answer10: body.answers[10],
      dimension1_score: scores.dimension1,
      dimension2_score: scores.dimension2,
      dimension3_score: scores.dimension3,
      dimension4_score: scores.dimension4,
      dimension5_score: scores.dimension5,
    };

    const { data, error } = await supabase
      .from("submissions")
      .insert([payload])
      .select("id")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch {
    return NextResponse.json(
      { error: "Ungültige Anfrage." },
      { status: 400 }
    );
  }
}