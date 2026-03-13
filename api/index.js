export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { query } = req.query;
  if (!query) return res.status(400).json({ success: false, message: "Enter Number" });

  const clean = query.replace(/\D/g, "");

  // List of different data sources
  const sources = [
    `https://jbk-darkwork.deno.dev/?number=${clean}`,
    `https://fam-official.serv00.net/api/database.php?number=${clean}`
  ];

  for (let url of sources) {
    try {
      const response = await fetch(url);
      const data = await response.json();

      // Agar kisi bhi source se data mil jaye
      if ((data.success || data.status === "success") && (data.data || data.result)) {
        return res.status(200).json({
          success: true,
          developer: "MrSoomro",
          source: url.includes("darkwork") ? "Node 1" : "Node 2",
          result: data.data || data.result || data
        });
      }
    } catch (e) { continue; }
  }

  // Agar kahin se bhi na mile
  return res.status(404).json({
    success: false,
    developer: "MrSoomro",
    message: "Record not found in any database node"
  });
}
