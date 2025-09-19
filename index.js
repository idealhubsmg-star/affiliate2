import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { createClient } from "@supabase/supabase-js";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔑 Ambil dari Environment Variables (Vercel → Settings → Environment Variables)
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

// Route dasar
app.get("/", (req, res) => {
  res.send("Affiliate API is running ✅");
});

// Simpan referral dari link
app.get("/ref", async (req, res) => {
  const teacherCode = req.query.ref;
  if (!teacherCode) {
    return res.status(400).send("Kode guru (ref) diperlukan");
  }
  res.send(`Referral dari guru: ${teacherCode}`);
});

// Endpoint pendaftaran siswa baru
app.post("/register", async (req, res) => {
  const { name, teacher_code } = req.body;

  if (!name || !teacher_code) {
    return res.status(400).send("Nama dan teacher_code harus diisi");
  }

  const { data, error } = await supabase.from("students").insert([
    {
      name: name,
      teacher_code: teacher_code
    }
  ]);

  if (error) {
    return res.status(500).send(error.message);
  }

  res.json({ message: "Pendaftaran berhasil", data });
});

// Laporan semua siswa + kode guru
app.get("/report", async (req, res) => {
  const { data, error } = await supabase.from("students").select("*");

  if (error) {
    return res.status(500).send(error.message);
  }

  res.json(data);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
