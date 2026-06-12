import cors from "cors";
import express from "express";
import authRoutes from "./routes/authRoutes.js";
import ingredientRoutes from "./routes/ingredientRoutes.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/ingredients", ingredientRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`SMARTKITCHEN server is running on port ${PORT}`);
});
