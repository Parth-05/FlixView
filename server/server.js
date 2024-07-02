import express from 'express';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

// Routes
import authRoute from "./routes/authRoute.js"

// Load env variables
dotenv.config();

const app = express();


app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRoute);

// Serve static files from the React app
if (process.env.NODE_ENV === 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  app.use(express.static(path.join(__dirname, '../client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist', 'index.html'), err => {
      if (err) {
        res.status(500).send(err);
      }
    });
  });
}

const PORT = process.env.PORT || 8800;
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
});