import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

export const pool = new Pool({
  user: String(process.env.DB_USER),
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD),
  port: Number(process.env.DB_PORT),
});

export const _init = async () => {
  try {
    // // todo remove before push
    // await pool.query("DROP TABLE IF EXISTS shorturl;");
    await pool.query(`CREATE TABLE IF NOT EXISTS shorturl (
              id SERIAL PRIMARY KEY,
              hash TEXT UNIQUE,
              url TEXT UNIQUE,
              clicks INTEGER
          );`);

    console.log("db initialized successfully.");
  } catch (err) {
    const result = (err as Error).message;
    return console.log(`Err initializing DB: ${result}`);
  }
};

export const getCount = async () => {
  try {
    const result = await pool.query(`SELECT COUNT(*) FROM shorturl;`);

    return Number(result.rows[0].count);
  } catch (err) {
    const result = (err as Error).message;
    console.log(`Err getting count: ${result}`);
    return 0;
  }
};

export const insertOne = async (hash: string, url: string) => {
  try {
    const result = await pool.query(
      `INSERT INTO shorturl(hash, url, clicks) VALUES($1, $2, $3);`,
      [hash, url, 0]
    );
  } catch (err) {
    const result = (err as Error).message;
    console.log(`Err inserting One: ${result}`);
  }
};

export const getByUrl = async (url: string) => {
  try {
    const result = await pool.query(
      `SELECT * FROM shorturl WHERE url='${url}';`
    );

    return result.rows || [];
  } catch (err) {
    const result = (err as Error).message;
    console.log(`Err getting rows by url: ${result}`);
  }
};

export const getByHash = async (hash: string) => {
  try {
    const result = await pool.query(
      `SELECT * FROM shorturl WHERE hash='${hash}';`
    );

    // increment clicks by 1
    if (result.rows && result.rows.length > 0) {
      const newClicks = result.rows[0].clicks + 1;
      await pool.query(
        `UPDATE shorturl SET clicks=${newClicks} WHERE hash='${hash}';`
      );
    }

    return result.rows || [];
  } catch (err) {
    const result = (err as Error).message;
    console.log(`Err getting rows by hash: ${result}`);
  }
};

export const getAll = async () => {
  try {
    const result = await pool.query(`SELECT * FROM shorturl;`);

    return result.rows || [];
  } catch (err) {
    const result = (err as Error).message;
    console.log(`Err getting all: ${result}`);
  }
};

export const updateUrl = async (newUrl: string, oldUrl: string) => {
  try {
    await pool.query(
      `UPDATE shorturl SET url='${newUrl}' WHERE url='${oldUrl}';`
    );
  } catch (err) {
    const result = (err as Error).message;
    console.log(`Err updating url: ${result}`);
  }
};
