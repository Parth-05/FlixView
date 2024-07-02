import express from 'express';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from 'cors';

// Routes
import authRoute from "./routes/authRoute.js"

// Load env variables
dotenv.config();

const app = express();


app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRoute);

const PORT = process.env.PORT || 8800
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)
});