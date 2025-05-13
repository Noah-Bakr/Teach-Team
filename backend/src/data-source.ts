import 'dotenv/config';
import "reflect-metadata";
import { DataSource } from "typeorm";
// import { Profile } from "./entity/Profile";
// import { Pet } from "./entity/Pet";

export const AppDataSource = new DataSource({
    type: "mysql",
    host: process.env.DB_HOST,
    port: 3306,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  // synchronize: true will automatically create database tables based on entity definitions
  // and update them when entity definitions change. This is useful during development
  // but should be disabled in production to prevent accidental data loss.
    synchronize: true,
    logging: true,
//   entities: [Profile, Pet],
    migrations: [],
    subscribers: [],
});


