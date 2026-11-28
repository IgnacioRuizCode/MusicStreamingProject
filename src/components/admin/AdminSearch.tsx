interface AdminSearchProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  ariaLabel?: string;
}

export function AdminSearch({
  value,
  onChange,
  placeholder,
  ariaLabel,
}: AdminSearchProps) {
  return (
    <div className="admin-search">
      <svg
        className="admin-search__icon"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.2-3.2" />
      </svg>
      <input
        type="search"
        className="admin-search__input"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        aria-label={ariaLabel ?? placeholder}
      />
    </div>
  );
}
