import express, { Application } from 'express';
import router from './routes/userRoutes';
import errorHandler from './errorHandlers/baseErrorHandler';
import { Router, Request, Response } from 'express';
const cors = require("cors");
const app: Application = express();
const port: number = 8000;
app.use(cors({
  origin:"http://localhost:3000", 
  methods: ["GET", "PUT", "POST"]
}))
app.use('/', router);

app.use(errorHandler);
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});