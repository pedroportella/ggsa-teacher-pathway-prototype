import './Search.scss';
export function Search({
  label,
  placeholder,
  action,
}: {
  label?: string;
  placeholder?: string;
  action?: string;
}) {
  return (
    <form className="au-form health-search" action={action}>
      <div className="au-form__item">
        <label htmlFor="health-search-input">{label}</label>
        <input
          id="health-search-input"
          className="health-search__form__input au-text-input au-text-input--block"
          type="search"
          placeholder={placeholder}
        />
      </div>
      <button className="au-btn au-btn--primary" type="submit">
        Search
      </button>
    </form>
  );
}
