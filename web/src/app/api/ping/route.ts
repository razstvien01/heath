export async function GET(): Promise<Response> {
  return new Response("Server is reachable", {
    status: 200,
  });
}
