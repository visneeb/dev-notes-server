import connectionPool from "../utils/db.mjs";

const PostRepository = {
  findAll: async ({ categoryId, keyword }) => {
    let query = `
      SELECT
        posts.*,
        categories.name AS category_name
      FROM posts
      JOIN categories
        ON posts.category_id = categories.id
    `;

    const conditions = [];
    const values = [];

    if (categoryId) {
      values.push(Number(categoryId));
      conditions.push(`posts.category_id = $${values.length}`);
    }

    if (keyword) {
      values.push(`%${keyword}%`);
      conditions.push(`posts.title ILIKE $${values.length}`);
    }

    if (conditions.length > 0) {
      query += " WHERE " + conditions.join(" AND ");
    }

    const result = await connectionPool.query(query, values);
    return result.rows;
  },

  findById: async (postId) => {
    const query = `SELECT posts.*,
                  categories.name AS category_name
                  FROM posts
                  JOIN categories
                    ON posts.category_id = categories.id 
                  where posts.id = $1`;

    const values = [postId];

    const { rows } = await connectionPool.query(query, values);

    return rows[0] || null;
  },

  create: async (postData) => {
    const { title, image, category_id, description, content, status_id } =
      postData;
    const query = `insert into posts (title, image, category_id, description, content, status_id)
    values ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [title, image, parseInt(category_id), description, content, parseInt(status_id)];

    const result = await connectionPool.query(query, values);

    return result.rows[0];
  },

  update: async (postId, postData) => {
    const allowedFields = [
      "title",
      "image",
      "category_id",
      "description",
      "content",
      "status_id",
    ];

    const fields = [];
    const values = [];
    let index = 1;

    for (const key of allowedFields) {
      if (postData[key] !== undefined) {
        fields.push(`${key} = $${index}`);
        values.push(postData[key]);
        index++;
      }
    }

    if (fields.length === 0) {
      return null;
    }

    const query = `
    UPDATE posts
    SET ${fields.join(", ")}
    WHERE id = $${index}
    RETURNING *;
  `;

    values.push(postId);

    const result = await connectionPool.query(query, values);

    if (result.rowCount === 0) {
      return null;
    }
    return result.rows[0];
  },

  delete: async (postId) => {
    const query = `delete from posts where id = $1 returning*`;
    const values = [postId];

    const result = await connectionPool.query(query, values);

    return result.rows[0] || null;
  },
};

export default PostRepository;
