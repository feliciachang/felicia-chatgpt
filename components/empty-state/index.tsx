import styles from "./index.module.css";

interface EmptyStateProps {
  handleSendMessage: (message: string) => void;
}

export default function EmptyState(props: EmptyStateProps) {
  const { handleSendMessage } = props;

  const examples = [
    "Explain quantum computing in simple terms",
    "Got any creative ideas for a 10 year old's birthday?",
    "How do I make an HTTP request in Javascript?",
  ];

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Ask me anything</h3>
      {examples.map((example) => (
        <button
          key={example}
          className={styles.examples}
          onClick={() => handleSendMessage(example)}
        >
          {example}
        </button>
      ))}
    </div>
  );
}
