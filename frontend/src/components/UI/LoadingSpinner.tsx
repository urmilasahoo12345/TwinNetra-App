export default function LoadingSpinner({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-4">
      <div
        style={{
          width: 48,
          height: 48,
          border: "3px solid rgba(0,201,200,0.15)",
          borderTop: "3px solid #00C9C8",
          borderRadius: "50%",
          animation: "spin 0.9s linear infinite",
        }}
      />
      <p style={{ color: "var(--muted)", fontFamily: "'Space Mono', monospace", fontSize: "0.72rem", letterSpacing: "0.1em" }}>
        {text}
      </p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

