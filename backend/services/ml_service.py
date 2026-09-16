import sys
import json
import os
import cv2
import joblib
import numpy as np
import pandas as pd


BASE_DIR = os.path.dirname(
    os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "models",
    "sih26231_dataset_model.pkl"
)

SCALER_PATH = os.path.join(
    BASE_DIR,
    "models",
    "sih26231_dataset_scaler.pkl"
)


model = joblib.load(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)


def analyze_image(image_path):

    image = cv2.imread(image_path)

    if image is None:
        return {
            "success": False,
            "error": "Unable to read image."
        }

    height, width = image.shape[:2]

    # Quality checks
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

    brightness = float(np.mean(gray))

    laplacian = cv2.Laplacian(
        gray,
        cv2.CV_64F
    )

    sharpness = float(laplacian.var())

    resolution_valid = (
        width >= 200 and
        height >= 150
    )

    brightness_valid = (
        40 <= brightness <= 220
    )

    sharpness_valid = (
        sharpness >= 100
    )

    quality_score = (
        (
            int(resolution_valid)
            + int(brightness_valid)
            + int(sharpness_valid)
        ) / 3
    ) * 100

    if quality_score < 66.67:
        return {
            "success": True,
            "quality_status": "Rejected",
            "quality_score": round(quality_score, 2),
            "message": "Image quality is insufficient."
        }

    # CV preprocessing
    blurred = cv2.GaussianBlur(
        gray,
        (5, 5),
        0
    )

    edges = cv2.Canny(
        blurred,
        50,
        150
    )

    contours, _ = cv2.findContours(
        edges,
        cv2.RETR_EXTERNAL,
        cv2.CHAIN_APPROX_SIMPLE
    )

    valid_contours = [
        contour
        for contour in contours
        if cv2.contourArea(contour) >= 500
    ]

    if not valid_contours:
        return {
            "success": True,
            "quality_status": "Accepted",
            "quality_score": round(quality_score, 2),
            "result": "Inconclusive",
            "message": "No valid ROI detected."
        }

    # Main ROI
    contour = max(
        valid_contours,
        key=cv2.contourArea
    )

    area = cv2.contourArea(contour)
    perimeter = cv2.arcLength(
        contour,
        True
    )

    x, y, roi_width, roi_height = cv2.boundingRect(
        contour
    )

    aspect_ratio = (
        roi_width / roi_height
        if roi_height != 0
        else 0
    )

    # Colour features
    hsv = cv2.cvtColor(
        image,
        cv2.COLOR_BGR2HSV
    )

    mean_hue = float(
        np.mean(hsv[:, :, 0])
    )

    mean_saturation = float(
        np.mean(hsv[:, :, 1])
    )

    mean_value = float(
        np.mean(hsv[:, :, 2])
    )

    mean_brightness = float(
        np.mean(gray)
    )

    features = pd.DataFrame([{
        "Area": area,
        "Perimeter": perimeter,
        "Width": roi_width,
        "Height": roi_height,
        "Aspect_Ratio": aspect_ratio,
        "Mean_Hue": mean_hue,
        "Mean_Saturation": mean_saturation,
        "Mean_Value": mean_value,
        "Mean_Brightness": mean_brightness
    }])

    # Scale features
    X_scaled = scaler.transform(features)

    # Prediction
    prediction = model.predict(X_scaled)[0]

    predicted_label = str(prediction).capitalize()

    # Probabilities
    probabilities = model.predict_proba(
        X_scaled
    )[0]

    class_probabilities = {}

    for class_name, probability in zip(
        model.classes_,
        probabilities
    ):
        class_probabilities[
            str(class_name).capitalize()
        ] = round(
            float(probability * 100),
            2
        )

    model_confidence = float(
        np.max(probabilities) * 100
    )

    return {
        "success": True,
        "quality_status": "Accepted",
        "quality_score": round(
            quality_score,
            2
        ),
        "result": predicted_label,
        "model_confidence": round(
            model_confidence,
            2
        ),
        "class_probabilities": class_probabilities,
        "roi": {
            "x": int(x),
            "y": int(y),
            "width": int(roi_width),
            "height": int(roi_height),
            "original_width": int(width),
            "original_height": int(height)
        },
        "features": {
            "area": round(float(area), 2),
            "perimeter": round(float(perimeter), 2),
            "aspect_ratio": round(
                float(aspect_ratio),
                2
            ),
            "mean_hue": round(
                mean_hue,
                2
            ),
            "mean_saturation": round(
                mean_saturation,
                2
            ),
            "mean_value": round(
                mean_value,
                2
            ),
            "mean_brightness": round(
                mean_brightness,
                2
            )
        }
    }


if __name__ == "__main__":

    if len(sys.argv) < 2:
        print(
            json.dumps({
                "success": False,
                "error": "Image path is required."
            })
        )
        sys.exit(1)

    image_path = sys.argv[1]

    result = analyze_image(
        image_path
    )

    print(
        json.dumps(result)
    )