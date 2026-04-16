/** @type {import("drizzle-kit").Config } */
module.exports = {
  schema: "./utils/schema.js",  // <-- Path to your schema file
  // out: "./drizzle/migrations", // Optional: migrations folder
  dialect: "postgresql",
  dbCredentials: {
    url: 'postgresql://neondb_owner:npg_hSL5UEo2DdGn@ep-falling-meadow-a4dazfo2-pooler.us-east-1.aws.neon.tech/ai%20mock%20interview?sslmode=require',
  },
};


// /** @type {import("drizzle-kit").Config } */
// module.exports = {
//   schema: "./utils/schema.js",
//   dialect: "postgresql",
//   dbCredentials: {
//     url: process.env.NEXT_PUBLIC_DRIZZLE_DB_URL,
//   },
// };
