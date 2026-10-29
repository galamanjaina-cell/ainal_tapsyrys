export async function onRequestPost(context) {
  const { BOT_TOKEN, CHAT_ID } = context.env;
  if (!BOT_TOKEN || !CHAT_ID) {
    return Response.json({ ok: false, error: "config" }, { status: 500 });
  }
  let text = "";
  try {
    const body = await context.request.json();
    text = (body && body.text) || "";
  } catch (e) {
    text = "";
  }
  if (!text || text.length > 3500) {
    return Response.json({ ok: false, error: "bad order" }, { status: 400 });
  }
  const res = await fetch("https://api.telegram.org/bot" + BOT_TOKEN + "/sendMessage", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: CHAT_ID, text: text })
  });
  const data = await res.json();
  if (!data.ok) {
    return Response.json({ ok: false, error: "telegram" }, { status: 502 });
  }
  return Response.json({ ok: true });
}
