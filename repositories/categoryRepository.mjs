import connectionPool from "../utils/db.mjs";

const CategoryRepository = {
  findAll: async () => {
    const query = `select id, name from categories order by id`;
    const result = await connectionPool.query(query);
    return result.rows;
  },
};

export default CategoryRepository;
