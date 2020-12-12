import React, { useRef, useEffect } from "react";
import * as faceapi from "face-api.js";
import Webcam from "react-webcam";
import { MODEL_URL } from "./helper";
import "./styles/main.scss";

function App() {
  const width = 640;
  const height = 320;
  const webcamRef = useRef(null);
  const canvasRef = useRef(null);

  const loadModels = async () => {
    console.log("try loadTinyFaceDetectorModel...");
    await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
    console.log("try loadFaceLandmarkModel...");
    await faceapi.loadFaceLandmarkModel(MODEL_URL);
    trackingLoop();
  };

  useEffect(() => {
    loadModels();
  });

  /**
   * LOOP RENDER
   */
  const trackingLoop = async () => {
    const faceFound = await faceapi
      .detectSingleFace(
        webcamRef.current.video,
        new faceapi.TinyFaceDetectorOptions()
      )
      .withFaceLandmarks();

    const dims = faceapi.matchDimensions(
      canvasRef.current,
      webcamRef.current.video,
      true
    );

    if (faceFound) {
      const resizedResults = faceapi.resizeResults(faceFound, dims);
      faceapi.draw.drawFaceLandmarks(canvasRef.current, resizedResults);
    }
    setTimeout(() => trackingLoop(), 0);
  };

  return (
    <div id="camera" className="position-relative" style={{ width, height }}>
      <Webcam
        audio={false}
        mirrored={true}
        ref={webcamRef}
        className="position-absolute"
        style={{
          top: 0,
          left: 0,
          maxWidth: "100%",
          maxHeight: "100%"
        }}
      />
      <canvas
        className="position-absolute"
        ref={canvasRef}
        width="640px"
        height="480px"
        style={{ top: 0, left: 0, transform: "scaleX(-1)" }}
      ></canvas>
    </div>
  );
}

export default App;
