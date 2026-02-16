import "dotenv/config";
import express from "express";
import cors from "cors";
import { domainName } from "./configs/config.mjs";
import connectionPool from "./utils/db.mjs";

import PostRouter from "./routes/post.route.mjs";
import CategoryRouter from "./routes/category.route.mjs";
import authRouter from "./routes/auth.route.mjs";

import globalErrorHandler from "./middlewares/globalErrorHandler.mjs";

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

app.use("/posts", PostRouter.createRouter());

app.use("/categories", CategoryRouter.createRouter());

app.use("/auth", authRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);

  app.use(globalErrorHandler);
});
