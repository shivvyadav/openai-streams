import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: Request) {
  try {
    const {message} = await req.json();

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: message,
    });

    return Response.json({
      response: response.output_text,
    });
  } catch (err: any) {
    return new Response(JSON.stringify({error: err.message}), {status: 500});
  }
}
