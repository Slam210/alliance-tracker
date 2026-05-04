import express from "express";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbx8BFmuEVLn0SnAWA2LoNRG_FNSQxKiB6LpsRB_ibb4u8fpflE86jR9_0EQ0wmOmecg/exec";

app.post("/api", async (req, res) => {
  try {
    console.log("Request to Apps Script:", req.body);

    const response = await fetch(SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body),
    });

    const text = await response.text();

    console.log("Apps Script raw response:", text);

    // TRY PARSING SAFELY
    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      console.error("Invalid JSON from Apps Script:", text);

      return res.status(500).json({
        success: false,
        error: "invalid_apps_script_response",
        raw: text,
      });
    }

    return res.json(data);
  } catch (err) {
    console.error("Proxy error:", err);

    return res.status(500).json({
      success: false,
      error: "proxy_error",
      message: err.message,
    });
  }
});

app.listen(3001, () => {
  console.log("Proxy running on http://localhost:3001");
});
