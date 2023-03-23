import styles from "./index.module.css";
import cx from "classnames";

export type Message = {
  sender: "user" | "ai";
  message: string;
};

interface MessageHistoryProps {
  history: Message[];
}

export default function MessageHistory(
  props: MessageHistoryProps
): JSX.Element {
  const { history } = props;
  console.log(history);
  return (
    <div className={styles.container}>
      {history.map((historyItem) => (
        <div className={styles.message} key={historyItem.message}>
          <div
            className={cx(styles.avatar, {
              [styles.ai]: historyItem.sender === "ai",
              [styles.rightAlign]: historyItem.sender === "user",
            })}
          />
          {historyItem.message}
        </div>
      ))}
    </div>
  );
}
