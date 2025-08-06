export async function onRequest(context) {
  const { request } = context;
  const url = new URL(request.url);
  const target = url.searchParams.get("url");

  if (!target) {
    return new Response("Missing ?url= parameter", { status: 400 });
  }

  try {
    const proxied = await fetch(target, {
      headers: {
        "Referer": target,
        "User-Agent": "Mozilla/5.0",
      },
    });

    const contentType = proxied.headers.get("content-type") || "application/octet-stream";
    const body = await proxied.arrayBuffer();

    return new Response(body, {
      status: proxied.status,
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (err) {
    return new Response("Error fetching image: " + err.message, { status: 500 });
  }
}
