import React, { useRef } from "react";

const ImageSearchButton = ({ onImageSelected, icon }) => {
  const inputRef = useRef(null);

  const handleClick = (e) => {
    e.preventDefault();
    inputRef.current?.click();
  };

  const handleChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file) onImageSelected?.(file);
    e.target.value = "";
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        onChange={handleChange}
      />
      <button
        type="button"
        onClick={handleClick}
        title="Search by image"
        style={{
          borderRadius: "999px",
          border: "none",
          backgroundColor: "rgba(15,23,42,0.9)",
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
    </>
  );
};

export default ImageSearchButton;

