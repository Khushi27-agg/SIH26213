# SIH26231 — Digital Companion for Field Drug Testing

A Computer Vision and Machine Learning based prototype developed for Smart India Hackathon (SIH26231) to assist field personnel in analyzing field drug-test images.

The system takes an image of a field test, checks its quality, processes it using Computer Vision, extracts visual features, applies a Machine Learning model, and displays the presumptive result through a React-based web interface.

> Note: This is an academic/hackathon prototype. The current model is trained on synthetic data and is not validated for real-world drug detection.

---

## Project Flow

Image Capture / Upload
        ↓
Image Quality Check
        ↓
Computer Vision Processing
        ↓
ROI Detection
        ↓
Feature Extraction
        ↓
Machine Learning Model
        ↓
Result + Confidence
        ↓
Web Interface
        ↓
Records & Offline Support (Module 7)

---

## Technologies Used

Frontend:
- React.js
- Vite
- JavaScript
- CSS

Backend:
- Node.js
- Express.js
- Multer
- CORS

Computer Vision:
- Python
- OpenCV
- NumPy

Machine Learning:
- Pandas
- Scikit-learn
- Joblib

Development:
- VS Code
- Google Colab
- Git
- GitHub

---

## Project Structure

SIH26231-CV-PoC/
│
├── datasets/
│   ├── train/
│   │   ├── negative/
│   │   ├── positive/
│   │   └── inconclusive/
│   │
│   ├── validation/
│   │   ├── negative/
│   │   ├── positive/
│   │   └── inconclusive/
│   │
│   └── test/
│       ├── negative/
│       ├── positive/
│       └── inconclusive/
│
├── models/
│   ├── sih26231_model.pkl
│   ├── sih26231_scaler.pkl
│   ├── sih26231_dataset_model.pkl
│   └── sih26231_dataset_scaler.pkl
│
├── notebooks/
│   ├── 01_colour_analysis.ipynb
│   ├── 02_dataset_preparation.ipynb
│   ├── 03_image_quality_control.ipynb
│   └── 04_result_interpretation.ipynb
│
├── outputs/
│   ├── sih26231_cv_features.csv
│   └── image_quality_report.csv
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── routes/
│   │   └── analysis.js
│   ├── services/
│   │   └── ml_service.py
│   └── uploads/
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── App.css
│   │   └── components/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── SIH26231_KIT_SPECIFICATION.md

---

# MODULES

## Module 1 — Computer Vision Pipeline

Status: COMPLETED

File:
notebooks/01_colour_analysis.ipynb

This module performs the basic image processing required before Machine Learning.

### Processing

Input Image
    ↓
Grayscale Conversion
    ↓
Gaussian Blur
    ↓
Canny Edge Detection
    ↓
Contour Detection
    ↓
ROI Detection
    ↓
Feature Extraction

### What was implemented?

- Image preprocessing using OpenCV
- Grayscale conversion
- Gaussian blur
- Edge detection
- Contour detection
- ROI detection
- Geometric feature extraction
- HSV colour analysis
- Brightness analysis
- Sharpness analysis

### Features Extracted

- Area
- Perimeter
- Width
- Height
- Aspect Ratio
- Mean Hue
- Mean Saturation
- Mean Value
- Mean Brightness

These features are passed to the Machine Learning model.

---

## Module 2 — Dataset & Machine Learning

Status: COMPLETED

File:
notebooks/02_dataset_preparation.ipynb

A synthetic dataset was created to test the complete ML pipeline.

### Dataset

Total images: 90

Training: 60
Validation: 15
Testing: 15

Classes:

- Negative
- Positive
- Inconclusive

Each class has an equal number of images.

### Models Tested

The following models were compared:

- Logistic Regression
- KNN
- SVM
- Decision Tree
- Random Forest

Logistic Regression was selected for the current prototype based on validation performance.

### Current Prototype Performance

Logistic Regression:

Validation Accuracy: 100%
Test Accuracy: 100%

Important:

These results are only from the synthetic dataset.

They do NOT represent real-world drug detection accuracy.

### Model Files

The trained model and scaler are stored in:

models/
├── sih26231_dataset_model.pkl
└── sih26231_dataset_scaler.pkl

The scaler is required because the same feature scaling used during training must be applied during prediction.

---

## Module 3 — Image Capture & Quality Control

Status: COMPLETED

File:
notebooks/03_image_quality_control.ipynb

This module checks whether an uploaded image is suitable for analysis.

### Quality Checks

1. Resolution
2. Brightness
3. Sharpness

### Current Thresholds

Minimum resolution:
200 × 150

Brightness:
40 – 220

Sharpness:
Laplacian variance >= 100

### Quality Score

The image receives a quality score based on the number of checks passed.

Example:

Resolution: Accepted
Brightness: Accepted
Sharpness: Accepted

Quality Score: 100%
Status: Accepted

If the image quality is insufficient, the image is rejected before ML processing.

---

## Module 4 — Result Interpretation & Explainability

Status: COMPLETED

File:
notebooks/04_result_interpretation.ipynb

This module connects the extracted image features with the trained ML model.

The system provides:

- Predicted result
- Model confidence
- Class probabilities
- ROI information
- Extracted features
- Presumptive interpretation

Example:

Predicted Result: Negative
Model Confidence: 97%

Class Probabilities:

Negative: 97.00%
Inconclusive: 2.81%
Positive: 0.18%

The detected ROI and model information are also displayed in the application.

---

## Module 5 — Backend & API

Status: COMPLETED

Backend folder:

backend/

Main files:

backend/server.js
backend/services/ml_service.py

### Backend Flow

React Frontend
    ↓
POST /api/analyze
    ↓
Multer receives image
    ↓
Node.js starts Python service
    ↓
ml_service.py
    ↓
OpenCV + ML Model
    ↓
JSON Response
    ↓
React Frontend

### API Endpoints

Health Check:

GET /api/health

Used to check whether the backend is running.

Image Analysis:

POST /api/analyze

The image is sent using multipart/form-data with the field name:

image

The API returns:

- Quality status
- Quality score
- Result
- Model confidence
- Class probabilities
- ROI coordinates
- Extracted features

---

## Module 6 — User Interface / Field App

Status: COMPLETED

Frontend folder:

frontend/

Main files:

frontend/src/App.jsx
frontend/src/App.css

### Current UI Features

- Image upload
- Camera capture on supported mobile devices
- Image preview
- Analyze Image button
- Loading state
- Result display
- Model confidence
- Class probabilities
- Quality score
- ROI visualization
- Extracted feature information
- Interpretation
- Clear/reset button

### UI Flow

Select / Capture Image
        ↓
Preview Image
        ↓
Analyze Image
        ↓
Backend API
        ↓
ML Processing
        ↓
Display Result

The detected ROI is displayed as a bounding box over the uploaded image.

---

# HOW THE CURRENT SYSTEM WORKS

When the user uploads or captures an image:

1. The React frontend sends the image to the backend.
2. Express receives the image using Multer.
3. The backend temporarily stores the image.
4. Node.js calls the Python ML service.
5. Python reads the image using OpenCV.
6. Image quality is checked.
7. The ROI is detected.
8. Nine visual features are extracted.
9. The features are scaled using the saved scaler.
10. The Logistic Regression model predicts the result.
11. Class probabilities and confidence are calculated.
12. The result is returned to the backend.
13. The backend sends the result to React.
14. React displays the result and ROI.
15. The temporary uploaded image is deleted after processing.

---

# IMPORTANT FILES

File:
notebooks/01_colour_analysis.ipynb

Purpose:
Computer Vision pipeline and feature extraction.

File:
notebooks/02_dataset_preparation.ipynb

Purpose:
Synthetic dataset generation, feature extraction and ML model training.

File:
notebooks/03_image_quality_control.ipynb

Purpose:
Image quality checking.

File:
notebooks/04_result_interpretation.ipynb

Purpose:
Prediction, confidence and result interpretation.

File:
models/sih26231_dataset_model.pkl

Purpose:
Trained Logistic Regression model.

File:
models/sih26231_dataset_scaler.pkl

Purpose:
Feature scaler used before prediction.

File:
backend/server.js

Purpose:
Express server and API handling.

File:
backend/services/ml_service.py

Purpose:
Computer Vision + ML inference.

File:
frontend/src/App.jsx

Purpose:
Main React application and UI logic.

File:
frontend/src/App.css

Purpose:
Frontend styling.

---

# RUNNING THE PROJECT

## Requirements

Install:

- Node.js
- npm
- Python 3.x
- Git

Check installation:

node --version
npm --version
python --version

---

## Start Backend

Open a terminal:

cd backend

Install Node dependencies:

npm install

Install Python dependencies:

pip install numpy pandas opencv-python scikit-learn joblib

Start backend:

node server.js

Backend URL:

http://localhost:5000

Health check:

http://localhost:5000/api/health

---

## Start Frontend

Open another terminal:

cd frontend

Install dependencies:

npm install

Start frontend:

npm run dev

Frontend URL:

http://localhost:5173

Both frontend and backend must be running for image analysis to work.

---

# MODULE 7 — NEXT DEVELOPMENT TASK

Status: PENDING

Module 7 is:

Records, Evidence & Offline Support

The existing Modules 1–6 are already implemented.

Module 7 should build on top of the existing system instead of changing the existing ML pipeline.

---

## Module 7 Goals

### 1. Analysis History

After every successful analysis, save a record containing:

- Record ID
- Date
- Time
- Result
- Model confidence
- Quality score

Example:

Test ID: TEST-001
Date: 16-09-2026
Result: Negative
Confidence: 97%
Quality Score: 100%

---

### 2. Evidence Reference

The system should maintain a reference to the image/evidence associated with an analysis.

Important:

backend/uploads/ is currently used for temporary image processing.

Uploaded images are deleted after processing.

If permanent evidence storage is required, create a separate storage mechanism instead of simply keeping all files inside uploads/.

---

### 3. Analysis History UI

A separate React component can be created:

frontend/src/components/History.jsx

The History section should allow the user to:

- View previous analyses
- View date and time
- View result
- View confidence
- View quality score
- View evidence when available
- Delete records if required
- Clear history if required

---

### 4. Local Storage

For the current prototype, browser localStorage can be used to store analysis records.

Example record:

{
    id: "TEST-001",
    timestamp: "2026-09-16T12:30:00",
    result: "Negative",
    confidence: 97,
    qualityScore: 100
}

The records should be saved after a successful analysis.

When the application is opened again, the saved records should be loaded and displayed.

---

### 5. Basic Offline Support

The first version does not need a complicated offline architecture.

A simple approach is:

Online
    ↓
Analyze Image
    ↓
Receive Result
    ↓
Save Result Locally
    ↓
View History Offline

The user should still be able to view previously saved analysis records even when the backend is unavailable.

Possible technologies:

- localStorage
- IndexedDB
- Service Worker
- PWA

Start with localStorage and improve it only if required.

---

# SUGGESTED MODULE 7 STRUCTURE

A possible frontend structure:

frontend/
└── src/
    ├── App.jsx
    ├── App.css
    └── components/
        └── History.jsx

The exact structure can be changed if a better implementation is required.

---

# MODULE 7 IMPLEMENTATION ORDER

Recommended order:

1. Create analysis record object.
2. Save successful results to localStorage.
3. Load records when the application starts.
4. Create History component.
5. Display previous analysis records.
6. Add evidence reference if required.
7. Add delete/clear functionality.
8. Add online/offline status.
9. Test history without backend connection.
10. Test the complete application again.

---

# WHAT SHOULD NOT BE CHANGED

The following parts are already working and should not be unnecessarily rebuilt:

- Computer Vision pipeline
- ROI detection
- Feature extraction
- Dataset preparation
- Trained ML model
- Feature scaler
- Image quality checking
- Prediction logic
- Confidence calculation
- Python ML service
- Express API
- React image upload
- Camera capture
- ROI visualization
- Existing result display

Module 7 should be added on top of these components.

---

# CURRENT LIMITATIONS

The current prototype has the following limitations:

- Dataset is synthetic.
- Real-world accuracy has not been established.
- Real field-test images have not been used for model validation.
- Lighting conditions can affect image features.
- Camera differences can affect predictions.
- Different test kits may have different visual characteristics.
- ROI detection is currently based on contour selection.
- Offline support is not implemented yet.
- Persistent evidence storage is not implemented.
- Authentication is not implemented.
- No database is currently used for analysis history.

---

# FUTURE IMPROVEMENTS

After completing Module 7, the project can be improved with:

## Dataset

- Real field-test images
- Laboratory-confirmed labels
- Larger dataset
- Different lighting conditions
- Different cameras
- Different test-kit formats

## Computer Vision

- Better ROI detection
- Perspective correction
- Lighting normalization
- Colour calibration
- Support for multiple test-strip layouts

## Machine Learning

- Training on real-world data
- Cross-validation
- Hyperparameter tuning
- Error analysis
- Model calibration
- Testing on unseen real-world images

## Application

- User authentication
- Role-based access
- Secure evidence storage
- Database integration
- PWA support
- Better offline synchronization
- Cloud backup
- Field-device optimization

---

# IMPORTANT DISCLAIMER

This project is an academic and Smart India Hackathon prototype.

The system provides presumptive image-based results and is not a replacement for laboratory testing, certified forensic analysis, or validated drug-testing procedures.

The current ML model has been trained and tested using synthetic data. Therefore, its current accuracy should not be interpreted as real-world drug detection accuracy.

Real field data, laboratory validation, security measures, and appropriate regulatory validation are required before practical deployment.

---

# FINAL STATUS

Module 1 — Computer Vision Pipeline
COMPLETED

Module 2 — Dataset & Machine Learning
COMPLETED

Module 3 — Image Capture & Quality Control
COMPLETED

Module 4 — Result Interpretation & Explainability
COMPLETED

Module 5 — Backend & API
COMPLETED

Module 6 — User Interface / Field App
COMPLETED

Module 7 — Records, Evidence & Offline Support
PENDING

The next task is to implement Module 7 without breaking the existing Modules 1–6.
