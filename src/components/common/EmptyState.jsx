import { Link } from 'react-router-dom';

export default function EmptyState({ title, text, link, label, icon = '✦' }) {
  return (
    <main className="page empty">
      <div className="empty-icon" aria-hidden="true">{icon}</div>
      <p className="eyebrow">NOTHING HERE</p>
      <h1>{title}</h1>
      <p>{text}</p>
      {link && <Link className="button" to={link}>{label}</Link>}
    </main>
  );
}
