export default async function handler(req, res) {

  /* ───── CORS (Frontend Friendly) ───── */
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { number } = req.query;

  if (!number) {
    return res.status(400).json({
      success: false,
      message: "number parameter required",
      developer: "MR-SOOMRO"
    });
  }

  const clean = number.replace(/\D/g, "");

  try {

    /* ───── FETCH FROM MR-SOOMRO API ───── */
    const upstream = await fetch(
      https://jbk-darkwork.deno.dev/?number=${encodeURIComponent(clean)}
    );

    if (!upstream.ok) {
      return res.status(502).json({
        success: false,
        message: "upstream api error",
        developer: "MR-SOOMRO"
      });
    }

    const data = await upstream.json();

    if (!data  !Array.isArray(data.data)  data.data.length === 0) {
      return res.status(404).json({
        success: false,
        message: "no records found",
        developer: "MR-SOOMRO"
      });
    }

    /* ───── NORMALIZE RESPONSE ───── */
    const records = data.data.map(r => ({
      mobile: r.number || "N/A",
      name: r.name || "N/A",
      cnic: r.cnic || "N/A",
      address: r.address || "N/A"
    }));

    return res.status(200).json({
      success: true,
      query: clean,
      total: records.length,
      result: records,
      developer: "MR-SOOMRO"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "server error",
      developer: "MR-SOOMRO"
    });
  }
}
