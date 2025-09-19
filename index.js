import express from "express";
import cookieParser from "cookie-parser";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(express.json());
app.use(cookieParser());

// Supabase connection
const supabaseUrl = "https://xxxxx.supabase.co"; // ganti dengan Project URL kamu
const supabaseKey = "eyJhbGci..."; // ganti dengan anon key
const supabase = createClient(supabaseUrl, supabaseKey);

// 1. Tangkap referral
app.get("/register", (req, res) => {
  const ref = req.query.ref || null;
  if (ref) {
    res.cookie("ref", ref, { maxAge: 7 * 24 * 60 * 60 * 1000 }); // simpan 7 hari
  }
  res.send("Silakan isi form pendaftaran!");
});

// 2. Simpan data siswa baru
app.post("/submit", async (req, res) => {
  const { name, email } = req.body;
  const ref = req.cookies.ref || null;

  const { data, error } = await supabase
    .from("students")
    .insert([{ name, email, referrer: ref }]);

  if (error) return res.status(400).json({ error });
  res.json({ success: true, data });
});

// 3. Laporan
app.get("/report", async (req, res) => {
  const { data, error } = await supabase
    .from("students")
    .select("referrer, count(*)")
    .group("referrer");

  if (error) return res.status(400).json({ error });
  res.json(data);
});

app.listen(3000, () => console.log("Server running on port 3000"));
