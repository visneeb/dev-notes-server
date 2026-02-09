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
    const genres = req.query.genres;
    const keywords = req.query.keywords;
    const PAGE_SIZE = 5;

    let query = "select * from movies";
    let values = [];

    if (keywords && genres) {
      query += " where genres ilike $1 and title ilike $2 limit $3";
      values = [`%${genres}%`, `%${keywords}%`, PAGE_SIZE];
    } else if (keywords) {
      query += " where title ilike $1 limit $2";
      values = [`%${keywords}%`, PAGE_SIZE];
    } else if (genres) {
      query += " where genres ilike $1 limit $2";
      values = [`%${genres}%`, PAGE_SIZE];
    } else {
      query += " limit $1";
      values = [PAGE_SIZE];
    }
    const results = await connectionPool.query(query, values);
  } catch (err) {
    console.error("DB error:", err);
    return res.status(500).json({
      message: "server cannot read post",
    });
  }

  return res.status(200).json({
    data: results.rows,
  });
});

app.get("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  let results;

  try {
    results = await connectionPool.query("select * from posts where id = $1", [
      postId,
    ]);

    if (results.rows.length === 0) {
      return res.status(404).json({
        message: "Server could not find a requested post",
      });
    }
  } catch (err) {
    console.error("DB error:", err);
    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
  return res.status(200).json({
    data: results.rows,
  });
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

app.put("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  const { title, image, category_id, description, content, status_id } =
    req.body;
  let result;

  try {
    const query = `update posts set title = $1,image =$2, category_id =$3, description =$4, content =$5, status_id =$6 where id = $7 returning*`;
    const values = [
      title,
      image,
      category_id,
      description,
      content,
      status_id,
      postId,
    ];

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Server could not find a requested post to update" });
    }
    result = await connectionPool.query(query, values);
  } catch (error) {
    console.error("Create post error:", error);
    return res.status(500).json({
      message: `Server could not update post because database connection`,
    });
  }

  return res.status(200).json({ message: "Updated post sucessfully" });
});

app.delete("/posts/:postId", async (req, res) => {
  const { postId } = req.params;
  let result;

  try {
    result = await connectionPool.query(
      "delete from posts where id = $1 returning*",
      [postId],
    );

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ message: "Server could not find a requested post to update" });
    }
  } catch (error) {
    console.error("Delete post error:", error);
    return res.status(500).json({
      message: `Server could not delete post because database connection`,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
