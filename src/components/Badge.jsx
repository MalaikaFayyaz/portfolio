export default function Badge({ href, children, title }) {
  return (
    <a href={href} title={title} target="_blank" rel="noreferrer" className="badge">
      {children}
    </a>
  );
}
