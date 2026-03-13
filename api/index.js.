export default async function handler(req, res) {

  /* ───── CORS ───── */
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "*");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  // Hum 'query' parameter use karenge taake flexibility rahe
  const { query } = req.query;

  /* ───── VALIDATION ───── */
  if (!query) {
    return res.status(400).json({
      success: false,
      message: "query parameter required (Number or CNIC)",
      developer: "MrSoomro"
    });
  }

  const clean = query.replace(/\D/g, "");

  if (clean.length < 7) {
    return res.status(400).json({
      success: false,
      message: "invalid input length",
      developer: "MrSoomro"
    });
  }

  try {
    const isCNIC = clean.length >= 13;
    const searchParam = isCNIC ? "cnic" : "number";

    /* ───── FETCH FROM SOURCE ───── */
    const upstream = await fetch(
      `https://fam-official.serv00.net/api/database.php?${searchParam}=${encodeURIComponent(clean)}`,
      {
        headers: {
          "User-Agent": "MrSoomro-Cyber-Engine/2026",
          "Accept": "application/json"
        }
      }
    );

    if (!upstream.ok) {
      return res.status(502).json({
        success: false,
        message: "upstream api error",
        developer: "MrSoomro"
      });
    }

    const data = await upstream.json();

    // Data check: Hum data.data.records check kar rahe hain
    if (!data || data.success !== true || !data.data || !Array.isArray(data.data.records)) {
      return res.status(404).json({
        success: false,
        message: "no records found on MrSoomro nodes",
        developer: "MrSoomro"
      });
    }

    let records = data.data.records;

    /* ───── SMART FILTER ───── */
    // Agar number search hai (not CNIC), toh sirf pehla record dikhao
    if (!isCNIC && records.length > 0) {
        records = [records[0]]; 
    }

    /* ───── NORMALIZE DATA ───── */
    const finalResults = records.map(r => ({
      full_name: r.full_name || "N/A",
      phone: r.phone || "N/A",
      cnic: r.cnic || "N/A",
      address: r.address || "N/A"
    }));

    /* ───── FINAL JSON RESPONSE ───── */
    return res.status(200).json({
      success: true,
      status: "success",
      query_type: isCNIC ? "CNIC" : "NUMBER",
      count: finalResults.length,
      result: finalResults,
      developer: "MrSoomro",
      admin: "+447455680379"
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: "server error",
      developer: "MrSoomro"
    });
  }
}
