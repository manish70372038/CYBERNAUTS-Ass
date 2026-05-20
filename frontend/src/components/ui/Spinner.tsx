const Spinner = () => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
    <div style={{
      width: 40, height: 40, border: "4px solid #2d2d44",
      borderTop: "4px solid #7c3aed", borderRadius: "50%",
      animation: "spin 0.8s linear infinite",
    }} />
  </div>
);

export default Spinner;