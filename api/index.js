export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ success: false, message: "Enter Number or CNIC" });
  }

  const clean = query.replace(/\D/g, "");
  // Agar query 11 digits se zyada hai toh hum samjhenge ye CNIC hai
  const isCNIC = clean.length >= 13;

  try {
    const response = await fetch(`https://jbk-darkwork.deno.dev/?number=${clean}`);
    const data = await response.json();

    if (data && data.data && data.data.length > 0) {
      let finalResult;

      if (isCNIC) {
        // CNIC search par saara data (All records) dikhayega
        finalResult = data.data;
      } else {
        // Number search par sirf pehla (Single) record dikhayega
        finalResult = [data.data[0]];
      }

      return res.status(200).json({
        success: true,
        status: "success",
        developer: "MrSoomro", // Aapka branding fix kar diya
        query_type: isCNIC ? "CNIC" : "NUMBER",
        result: finalResult
      });
    } else {
      return res.status(404).json({
        success: false,
        developer: "MrSoomro",
        message: "No record found"
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, developer: "MrSoomro", message: "Server Error" });
  }
}
