export default async function handler(req, res) {
  // CORS Headers taake har jagah chale
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");

  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ 
      success: false, 
      message: "Please enter a Number",
      developer: "MrSoomro" 
    });
  }

  // Number se extra characters hatana
  const cleanNumber = query.replace(/\D/g, "");

  try {
    // Aapki di hui working API
    const response = await fetch(`https://jbk-darkwork.deno.dev/?number=${cleanNumber}`);
    const data = await response.json();

    // Direct data display karna
    return res.status(200).json({
      success: true,
      status: "success",
      developer: "MrSoomro",
      result: data // Ye direct aapki API ka result dikhayega
    });

  } catch (error) {
    return res.status(500).json({ 
      success: false, 
      message: "Database Server Connection Error",
      developer: "MrSoomro"
    });
  }
}
