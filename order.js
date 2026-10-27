exports.handler = async (event) => {
  const headers = { "Content-Type": "application/json" };
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, headers, body: JSON.stringify({ ok: false, error: "method" }) };
  }
  const token = process.env.BOT_TOKEN;
  const chatId = process.env.CHAT_ID;
  if (!token || !chatId) {
    return { statusCode: 500, headers, body: JSON.stringify({ ok: false, error: "config" }) };
  }
  let text = "";
  try {
    text = JSON.parse(event.body || "{}").text || "";
  } catch (e) {
    text = "";
  }
  if (!text || text.length > 3500) {
    return { statusCode: 400, headers, body: JSON.stringify({ ok: false, error: "bad order" }) };
  }
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  });
  const data = await res.json();
  if (!data.ok) {
    return { statusCode: 502, headers, body: JSON.stringify({ ok: false, error: "telegram" }) };
  }
  return { statusCode: 200, headers, body: JSON.stringify({ ok: true }) };
};
