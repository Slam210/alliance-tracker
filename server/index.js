import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT;
const SCRIPT_URL = process.env.APPS_SCRIPT_URL;

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

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});

// serve React build
app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (_, res) => {
  res.sendFile(path.join(__dirname, "dist/index.html"));
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
