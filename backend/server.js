import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import shortid from "shortid";
import Url from "./models/Url.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Connect DB
const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("Please set MONGO_URI in .env");
  process.exit(1);
}
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => { console.error(err); process.exit(1); });

const BASE_URL = process.env.BASE_URL || "http://localhost:5000";

// shorten URL endpoin
app.post("/api/shorten", async (req, res) => {
  try {
    const { longUrl } = req.body;
    if (!longUrl) return res.status(400).json({ error: "longUrl is required" });

    //  protocol
    let formatted = longUrl;
    if (!/^https?:\/\//i.test(formatted)) {
      formatted = "http://" + formatted;
    }

    // check URL already exists and return code
    const existing = await Url.findOne({ original_url: formatted });
    if (existing) {
      return res.json({ shortUrl: `${BASE_URL}/${existing.short_code}` });
    }

    // create
    const code = shortid.generate();
    const newUrl = new Url({ original_url: formatted, short_code: code });
    await newUrl.save();

    return res.json({ shortUrl: `${BASE_URL}/${code}` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

// redirect 
app.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;
    const urlDoc = await Url.findOne({ short_code: code });
    if (!urlDoc) {
      return res.status(404).send("Short URL not found");
    }
    urlDoc.clicks = (urlDoc.clicks || 0) + 1;
    await urlDoc.save();
    return res.redirect(urlDoc.original_url);
  } catch (err) {
    console.error(err);
    return res.status(500).send("Server error");
  }
});


// Admin all URLs
app.get("/api/admin/urls", async (req, res) => {
  try {
    const all = await Url.find().sort({ createdAt: -1 });
    return res.json(all);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));
