import express, { Application } from 'express';
import router from './routes/userRoutes';
import { Router, Request, Response } from 'express';
import errorHandler from './errorHandlers/baseErrorHandler';
const cors = require("cors");
const app: Application = express();
const port: number = 8000;
app.use(cors({
  origin:"http://localhost:3000", 
  methods: ["GET", "PUT", "POST"],
  credentials: true
}))
app.use('/', router);

app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});