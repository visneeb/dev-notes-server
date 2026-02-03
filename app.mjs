import "dotenv/config";
import express from "express";
import cors from "cors";
import { domainName } from "./configs/config.mjs";
import connectionPool from "./utils/db.mjs";

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors({ origin: domainName }));
app.use(express.json());


app.get("/health", (req, res) => {
  res.status(200).json({ message: "OK" });
});

app.get("/health/db", async (req, res) => {
  try {
    await connectionPool.query("select 1");
    res.json({ db: "ok" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ db: "down" });
  }
});

app.get("/posts", async (req, res) => {
  try {
    const results = await connectionPool.query(
      "select * from posts"
    );

    return res.status(200).json({
      data: results.rows,
    });
  } catch (err) {
    console.error("DB error:", err);
    return res.status(500).json({
      message: "server cannot read post",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
