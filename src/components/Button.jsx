import styles from './Button.module.css';
function Button({ children, onClick, type }) {
  const btn =
    'text‑inherit cursor-pointer rounded border-none px-4 py-2 text-2xl uppercase tracking-wide';
  return (
    <button className={`${btn} ${styles[type]}`} onClick={onClick}>
      {children}
    </button>
  );
}

export default Button;
