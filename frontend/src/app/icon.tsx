import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#16a34a",
          borderRadius: "6px",
        }}
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M12 22v-6" />
          <path d="M12 16c-2.5 0-4.5-2-5-4.5L2 10l2.5-.5C6 9 7 7 7 4.5 7 2 9 1 12 1s5 1 5 3.5c0 2.5-1 4.5-2.5 5L12 10l-2 1.5c0 2.5 2.5 4.5 5 4.5z" />
        </svg>
      </div>
    ),
    { ...size }
  );
}
