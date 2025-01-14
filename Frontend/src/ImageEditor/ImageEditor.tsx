import { useRef, useState } from "react";

export default function ImageEditor() {
  const imageRef = useRef<HTMLImageElement>(null);
  const [coords1, setCoords1] = useState<{ x: number; y: number } | null>(null);
  const [coords2, setCoords2] = useState<{ x: number; y: number } | null>(null);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });

  const handleClickOnImage = (
    event: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    const img = imageRef.current;
    if (img == null) return;
    const rect = img.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    if (coords1 === null) {
      setCoords1({ x, y });
    } else {
      setCoords2({ x, y });
    }
  };

  const handleClear = () => {
    setCoords1(null);
    setCoords2(null);
  };

  const handleSave = () => {
    console.log("Selection saved:", { coords1, coords2 });
  };

  return (
    <div
      style={{ position: "relative", display: "inline-block" }}
      onMouseMove={(event) => {
        setMousePos({ x: event.pageX, y: event.pageY });
      }}
    >
      <img
        src="/screeny.png"
        alt="Logo"
        ref={imageRef}
        style={{ cursor: "crosshair", display: "block" }}
        onClick={handleClickOnImage}
      ></img>
      <div
        style={{
          position: "absolute",
          top: coords1 ? coords1.y : 0,
          left: coords1 ? coords1.x : 0,
          width: coords2
            ? coords2.x - coords1!.x
            : coords1
            ? mousePos.x - coords1.x
            : 0,
          height: coords2
            ? coords2.y - coords1!.y
            : coords1
            ? mousePos.y - coords1.y
            : 0,
          backgroundColor: "rgba(255, 0, 0, 0.5)",
          padding: "5px",
          color: "white",
          borderRadius: "5px",
        }}
      ></div>

      {coords2 && (
        <div
          style={{
            position: "fixed",
            bottom: 0,
            left: 0,
            width: "100%",
            backgroundColor: "#333",
            color: "white",
            padding: "10px",
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            boxShadow: "0 -2px 5px rgba(0, 0, 0, 0.2)",
          }}
        >
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              border: "none",
              borderRadius: "5px",
              backgroundColor: "#4caf50",
              color: "white",
              cursor: "pointer",
            }}
            onClick={handleSave}
          >
            Save
          </button>
          <button
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              border: "none",
              borderRadius: "5px",
              backgroundColor: "#f44336",
              color: "white",
              cursor: "pointer",
            }}
            onClick={handleClear}
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}
