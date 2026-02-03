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
    const results = await connectionPool.query("select * from posts");

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

app.post("/posts", async (req, res) => {
  const { title, image, category_id, description, content, status_id } =
    req.body;

  try {
    const query = `insert into posts (title, image, category_id, description, content, status_id)
    values ($1, $2, $3, $4, $5, $6)`;

    const values = [title, image, category_id, description, content, status_id];

    if (
      !title ||
      !image ||
      !category_id ||
      !description ||
      !content ||
      !status_id
    ) {
      return res.status(400).json({
        message:
          "Server could not create post because there are missing data from client",
      });
    }

    await connectionPool.query(query, values);
  } catch (error) {
    console.error("Create post error:", error);
    return res.status(500).json({
      message: `Server could not create post because database connection`,
    });
  }

  return res.status(201).json({ message: "Created post successfully" });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
