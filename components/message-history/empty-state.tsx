import styles from "./empty-state.module.css";

export default function EmptyState() {
  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Ask me anything</h3>
      <button className={styles.examples}>
        {"Explain quantum computing in simple terms"}
      </button>
      <button className={styles.examples}>
        {"Got any creative ideas for a 10 year old's birthday?"}
      </button>
      <button className={styles.examples}>
        {"How do I make an HTTP request in Javascript?"}
      </button>
    </div>
  );
}
