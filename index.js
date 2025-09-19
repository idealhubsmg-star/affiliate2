import express from "express";
import cookieParser from "cookie-parser";
import { createClient } from "@supabase/supabase-js";
import serverless from "serverless-http";

const app = express();
app.use(express.json());
app.use(cookieParser());

// 🔑 Ambil ENV dari Vercel
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// ✅ Route test
app.get("/", (req, res) => {
  res.send("✅ Affiliate API is running");
});

// 🎯 Simpan referral
app.get("/ref/:code", (req, res) => {
  const { code } = req.params;
  res.cookie("ref", code, { maxAge: 7 * 24 * 60 * 60 * 1000 });
  res.send(`Referral tersimpan: ${code}`);
});

// 📝 Simpan pendaftar baru
app.post("/register", async (req, res) => {
  const { name, email } = req.body;
  const ref = req.cookies.ref || null;

  const { data, error } = await supabase.from("students").insert([
    { name, email, referred_by: ref },
  ]);

  if (error) return res.status(500).json({ error: error.message });

  res.json({ message: "Pendaftar berhasil disimpan", data });
});

// 📊 Lihat laporan
app.get("/report", async (req, res) => {
  const { data, error } = await supabase.from("students").select("*");

  if (error) return res.status(500).json({ error: error.message });

  res.json(data);
});

// 🚀 Export pakai serverless
export default serverless(app);
