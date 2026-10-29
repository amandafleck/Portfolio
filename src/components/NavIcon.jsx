const PATHS = {
  amanda: (
    <path d="M3 11.5 12 4l9 7.5M5.5 10v9.5h4.5V14h4v5.5h4.5V10" />
  ),
  about: (
    <>
      <circle cx="12" cy="8" r="3.6" />
      <path d="M4.5 20c0-4.1 3.6-6.2 7.5-6.2s7.5 2.1 7.5 6.2" />
    </>
  ),
  softskills: (
    <path d="M12 3v4.5M12 16.5V21M3 12h4.5M16.5 12H21M5.8 5.8l3.2 3.2M15 15l3.2 3.2M18.2 5.8 15 9M9 15l-3.2 3.2" />
  ),
  projects: (
    <>
      <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" />
      <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" />
      <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" />
    </>
  ),
  work: (
    <>
      <rect x="3" y="7.5" width="18" height="12" rx="1.8" />
      <path d="M8.5 7.5v-2a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2" />
      <path d="M3 12.5h18" />
    </>
  ),
  contact: (
    <>
      <rect x="3" y="5.5" width="18" height="13" rx="1.8" />
      <path d="M3.5 6.5 12 13l8.5-6.5" />
    </>
  ),
}

export default function NavIcon({ id, className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {PATHS[id]}
    </svg>
  )
}
