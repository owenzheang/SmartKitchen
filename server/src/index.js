import express from "express";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`SMARTKITCHEN server is running on port ${PORT}`);
});
