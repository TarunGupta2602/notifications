import { ImageResponse } from "next/og";

export function renderMark(size: number) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#9c3b28",
          color: "#fff8f3",
          fontSize: Math.round(size * 0.48),
          fontWeight: 700,
        }}
      >
        S
      </div>
    ),
    { width: size, height: size },
  );
}
