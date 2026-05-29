export default function VacancyToggle({ available, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => onChange(!available)}
        className={`toggle-track ${available ? 'on' : 'off'}`}
        aria-label={available ? 'Mark as Full' : 'Mark as Available'}
      >
        <div className="toggle-thumb" />
      </button>
      <span className="text-xs font-semibold" style={{ color: available ? '#2d8653' : '#767676' }}>
        {available ? 'Available' : 'Full'}
      </span>
    </div>
  );
}
