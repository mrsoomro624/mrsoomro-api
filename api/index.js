export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ 
      success: false, 
      message: "Please provide Number or CNIC",
      developer: "MrSoomro" 
    });
  }

  // Number se extra characters hatane ke liye
  const clean = query.replace(/\D/g, "");

  try {
    // Timeout set karna zaroori hai taake Vercel freeze na ho
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), 8000); // 8 seconds timeout

    const upstream = await fetch(`https://jbk-darkwork.deno.dev/?number=${clean}`, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
      }
    });
    
    clearTimeout(id);

    const data = await upstream.json();

    // Data check logic
    if (data && data.success === true && Array.isArray(data.data) && data.data.length > 0) {
      
      const results = data.data.map(r => ({
        full_name: r.name || "N/A",
        phone: r.number || clean,
        cnic: r.cnic || "N/A",
        address: r.address || "N/A"
      }));

      return res.status(200).json({
        success: true,
        status: "success",
        developer: "MrSoomro",
        query: clean,
        count: results.length,
        result: results
      });
    } else {
      return res.status(404).json({
        success: false,
        status: "error",
        message: "No record found for this query",
        developer: "MrSoomro"
      });
    }
  } catch (err) {
    return res.status(500).json({ 
      success: false,
      status: "error", 
      message: "Database Node Busy or Offline",
      developer: "MrSoomro"
    });
  }
}
