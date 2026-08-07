export default function EyeTracker({ eyeRef, px, py }) {
  return (
    <div className="eyes-wrap" ref={eyeRef}>
      <div className="eye"><div className="pupil" style={{ transform: `translate(${px}px, ${py}px)` }} /></div>
      <div className="eye"><div className="pupil" style={{ transform: `translate(${px}px, ${py}px)` }} /></div>
    </div>
  );
}
