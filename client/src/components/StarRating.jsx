import React from "react";

export default function StarRating({
  value = 0,
  onChange,
  size = 22,
  readOnly = false,
}) {
  const stars = [1, 2, 3, 4, 5];
  return (
    <div
      style={{ display: "inline-flex", gap: ".25rem" }}
      aria-label={`Rating ${value} of 5`}
    >
      {stars.map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => !readOnly && onChange?.(s)}
          className="star-btn"
          aria-pressed={value >= s}
          aria-label={`${s} star`}
          style={{
            width: size,
            height: size,
            lineHeight: 0,
            borderRadius: 6,
            border: "1px solid var(--border)",
            background:
              value >= s
                ? "color-mix(in oklab, #f6b300 65%, var(--surface))"
                : "color-mix(in oklab, var(--surface) 85%, var(--bg))",
            boxShadow: "inset 0 0 0 1px rgba(255,255,255,.04)",
          }}
        >
          <svg
            width={size - 4}
            height={size - 4}
            viewBox="0 0 24 24"
            fill={value >= s ? "#8a6400" : "var(--muted)"}
            aria-hidden="true"
          >
            <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.787 1.401 8.168L12 18.896l-7.335 3.869 1.401-8.168L.132 9.21l8.2-1.192L12 .587z" />
          </svg>
        </button>
      ))}
    </div>
  );
}
