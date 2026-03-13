export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ success: false, message: "Enter Number (e.g. 03xx) or CNIC" });
  }

  // 1. Number se characters hatana
  let clean = query.replace(/\D/g, "");

  // 2. Agar number 92 se shuru ho raha hai toh usay 0 mein badalna
  if (clean.startsWith("92") && clean.length > 10) {
    clean = "0" + clean.slice(2);
  } 
  // Agar number 0 ke baghair hai (e.g. 310...) toh 0 lagana
  else if (clean.startsWith("3") && clean.length === 10) {
    clean = "0" + clean;
  }

  const isCNIC = clean.length >= 13;

  try {
    // Search hamesha clean number par hogi
    const response = await fetch(`https://jbk-darkwork.deno.dev/?number=${clean}`);
    const data = await response.json();

    if (data && data.data && data.data.length > 0) {
      let filteredData;

      if (isCNIC) {
        filteredData = data.data;
      } else {
        // Sirf wahi record dikhana jo exact match kare
        filteredData = [data.data[0]];
      }

      return res.status(200).json({
        success: true,
        status: "success",
        developer: "MrSoomro",
        searched_for: clean, // Ab yahan hamesha 03xx wala format nazar aayega
        result: filteredData
      });
    } else {
      return res.status(404).json({
        success: false,
        developer: "MrSoomro",
        message: "Is number ka data nahi mila",
        searched_for: clean
      });
    }
  } catch (error) {
    return res.status(500).json({ success: false, developer: "MrSoomro", message: "Server Busy" });
  }
}
