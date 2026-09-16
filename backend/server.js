const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { spawn } = require("child_process");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
});

app.get("/", (req, res) => {
  res.json({
    message: "SIH26231 Backend API is running.",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    service: "SIH26231 Backend",
    status: "healthy",
  });
});

app.post("/api/analyze", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      error: "No image uploaded.",
    });
  }

  const imagePath = req.file.path;

  const pythonProcess = spawn("python", [
    path.join(__dirname, "services", "ml_service.py"),
    imagePath,
  ]);

  let output = "";
  let errorOutput = "";

  pythonProcess.stdout.on("data", (data) => {
    output += data.toString();
  });

  pythonProcess.stderr.on("data", (data) => {
    errorOutput += data.toString();
  });

  pythonProcess.on("close", (code) => {
    if (code !== 0) {
      console.error("Python Error:", errorOutput);

      fs.unlink(imagePath, () => {});

      return res.status(500).json({
        success: false,
        error: "ML processing failed.",
        details: errorOutput,
      });
    }

    try {
      const result = JSON.parse(output);

      fs.unlink(imagePath, (error) => {
        if (error) {
          console.error("Unable to delete uploaded image:", error.message);
        }
      });

      res.json(result);
    } catch (error) {
      console.error("JSON Parse Error:", error);

      fs.unlink(imagePath, () => {});

      res.status(500).json({
        success: false,
        error: "Invalid response from ML service.",
      });
    }
  });
});

app.listen(PORT, () => {
  console.log(`SIH26231 backend running on http://localhost:${PORT}`);
});
