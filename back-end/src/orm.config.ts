import { DataSource } from "typeorm";

export const myDataSource = new DataSource({
  type: "postgres",
  host: "postgres",
  port: 5432,
  username: "postgres",
  password: "postgres_password",
  database: "postgres",
  entities: ["src/entity/*.js"],
  migrations: ["dist/migrations/*.js"],
  logging: true,
  synchronize: true,
});
