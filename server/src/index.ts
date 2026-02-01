import express from "express";
import cors from "cors";
import analyzeRouter from "./routes/analyze";
import historyRouter from "./routes/history";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use("/api/analyze", analyzeRouter);
app.use("/api/history", historyRouter);

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
