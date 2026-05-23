import React, { useEffect, useRef, useState } from "react";

const VoiceSearchButton = ({ onResult, icon }) => {
  const [supported, setSupported] = useState(false);
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setSupported(false);
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = "en-IN";
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    recognitionRef.current = rec;
    setSupported(true);

    rec.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript || "";
      setListening(false);
      onResult?.(transcript);
    };
    rec.onerror = () => {
      setListening(false);
    };
    rec.onend = () => {
      setListening(false);
    };
  }, [onResult]);

  const handleClick = (e) => {
    e.preventDefault();
    if (!supported) {
      alert(
        "Voice search is not supported in this browser. Please use the latest Chrome or Edge."
      );
      return;
    }
    const rec = recognitionRef.current;
    if (!rec) return;

    if (listening) {
      rec.stop();
      setListening(false);
      return;
    }

    try {
      rec.start();
      setListening(true);
    } catch {
      setListening(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      title={
        supported ? (listening ? "Listening..." : "Voice search") : "Not supported"
      }
      style={{
        borderRadius: "999px",
        border: "none",
        backgroundColor: listening ? "#991b1b" : "rgba(15,23,42,0.9)",
        color: "#e5e7eb",
        padding: "4px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </button>
  );
};

export default VoiceSearchButton;

