import { useState } from "react";
import "./App.css";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setSelectedImage(file);
    setPreview(URL.createObjectURL(file));
    setResult(null);
    setError("");
  };

  const analyzeImage = async () => {
    if (!selectedImage) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await fetch("http://localhost:5000/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Analysis failed.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message || "Unable to connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1>NarcoScope</h1>
          <p>Digital Companion for Field Drug Testing</p>
        </div>

        <div className="status">
          <span></span>
          System Ready
        </div>
      </header>

      <main className="main">
        <section className="upload-section">
          <div className="section-title">
            <h2>Field Test Analysis</h2>
            <p>
              Capture or upload an image of the field test for preliminary
              analysis.
            </p>
          </div>

          <div className="upload-card">
            <div className="preview-area">
              {preview ? (
                <div className="image-wrapper">
                  <img
                    src={preview}
                    alt="Selected test"
                    className="preview-image"
                  />

                  {result?.roi && (
                    <div
                      className="roi-box"
                      style={{
                        left: `${
                          (result.roi.x / result.roi.original_width) * 100
                        }%`,

                        top: `${
                          (result.roi.y / result.roi.original_height) * 100
                        }%`,

                        width: `${
                          (result.roi.width / result.roi.original_width) * 100
                        }%`,

                        height: `${
                          (result.roi.height / result.roi.original_height) * 100
                        }%`,
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="empty-preview">
                  <div className="upload-icon">+</div>

                  <h3>No image selected</h3>

                  <p>Upload an image of the test sample to begin analysis.</p>
                </div>
              )}
            </div>

            <div className="actions">
              <label className="upload-button">
                Select Image
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageChange}
                />
              </label>

              <button
                className="analyze-button"
                onClick={analyzeImage}
                disabled={!selectedImage || loading}
              >
                {loading ? "Analyzing..." : "Analyze Image"}
              </button>
              <button
                className="clear-button"
                onClick={() => {
                  setSelectedImage(null);
                  setPreview(null);
                  setResult(null);
                  setError("");
                }}
                disabled={!selectedImage && !result}
              >
                Clear
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}
        </section>

        {result && (
          <section className="result-section">
            <div className="result-header">
              <div>
                <h2>Analysis Result</h2>
                <p>
                  Preliminary interpretation from the computer vision pipeline.
                </p>
              </div>

              <div className={`result-badge ${result.result.toLowerCase()}`}>
                {result.result}
              </div>
            </div>

            <div className="result-grid">
              <div className="result-card">
                <h3>Model Confidence</h3>

                <div className="confidence">{result.model_confidence}%</div>

                <div className="progress">
                  <div
                    style={{
                      width: `${result.model_confidence}%`,
                    }}
                  ></div>
                </div>
              </div>

              <div className="result-card">
                <h3>Image Quality</h3>

                <p className="large-value">{result.quality_score}%</p>

                <p>Status: {result.quality_status}</p>
              </div>

              <div className="result-card">
                <h3>Detected ROI</h3>

                <p>X: {result.roi.x}</p>

                <p>Y: {result.roi.y}</p>

                <p>Width: {result.roi.width}</p>

                <p>Height: {result.roi.height}</p>
              </div>
            </div>

            <div className="probability-card">
              <h3>Class Probabilities</h3>

              {Object.entries(result.class_probabilities).map(
                ([className, probability]) => (
                  <div className="probability-row" key={className}>
                    <div className="probability-label">
                      <span>{className}</span>
                      <strong>{probability}%</strong>
                    </div>

                    <div className="progress">
                      <div
                        style={{
                          width: `${probability}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                ),
              )}
            </div>

            <div className="interpretation">
              <h3>Interpretation</h3>

              <p>
                {result.result === "Positive"
                  ? "Presumptive positive result. Further assessment is required."
                  : result.result === "Negative"
                    ? "Presumptive negative result. Further assessment may be required according to field protocol."
                    : "The result is inconclusive and requires further assessment."}
              </p>
            </div>

            <div className="disclaimer">
              <strong>Prototype Notice</strong>

              <p>
                This system is a research prototype trained on synthetic data.
                Results are presumptive and must not be treated as definitive
                drug identification. Real-world validation is required before
                field deployment.
              </p>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
