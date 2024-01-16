import express from "express";
import dotenv from "dotenv";
import noteRoutes from "./routers/noteRoutes";
import userRoutes from "./routers/userRoutes";
import logger from "./middlewares/logger";
import errorHandler from "./middlewares/errorHandler";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use((req, res, next) => {
  logger.info(`${req.method} ${req.path}`);
  next();
});

//use CORS
app.use(cors());

//body parser middleware
app.use(express.json());

//routes
app.use(noteRoutes);
app.use(userRoutes);

//error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on PORT ${PORT}`);
});
