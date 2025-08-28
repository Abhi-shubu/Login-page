const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const path = require("path");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const app = express();
const PORT = process.env.PORT || 5001;
app.set("trust proxy", true);

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(morgan("tiny"));

// ✅ CORS setup
const allowedOrigins = [
  "http://localhost:5173",
  "https://loginredious.onrender.com",
  process.env.CLIENT_URL
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));

const api = process.env.API_URL || "/api/v1";  
app.use(`${api}/`, require("./routes/login"));


mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => console.log("✅ Database connected"))
  .catch((err) => console.error("❌ DB connection error:", err));



  const buildPath = path.join(__dirname, '../client/dist');

    app.use(express.static(buildPath));

    
    app.get(/^(?!\/api).*/, (req, res) => {
      res.sendFile(path.join(buildPath, 'index.html'));
    });


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running at http://localhost:${PORT}`);
});
