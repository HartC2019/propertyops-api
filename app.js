import express from "express";
const app = express();
export default app;

import usersRouter from "#api/users";
import getUserFromToken from "#middleware/getUserFromToken";
import handlePostgresErrors from "#middleware/handlePostgresErrors";
import cors from "cors";
import morgan from "morgan";
import propertiesRouter from "#api/properties";
import incomeRouter from "#api/income";
import expensesRouter from "#api/expenses";
import dashboardRouter from "#api/dashboard";

app.use(cors({ origin: process.env.CORS_ORIGIN ?? /localhost/ }));

app.use(morgan("dev"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(getUserFromToken);

app.get("/", (req, res) => res.send("Hello, World!"));

app.use("/users", usersRouter);

app.use("/properties", propertiesRouter);

app.use("/income", incomeRouter);

app.use("/expenses", expensesRouter);

app.use("/dashboard", dashboardRouter);

app.use(handlePostgresErrors);
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send("Sorry! Something went wrong.");
});
