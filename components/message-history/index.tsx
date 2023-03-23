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
  return (
    <div>
      {history.map((historyItem) => (
        <div
          className={cx({
            [styles.leftAlign]: historyItem.sender === "ai",
            [styles.rightAlign]: historyItem.sender === "user",
          })}
          key={historyItem.message}
        >
          {historyItem.message}
        </div>
      ))}
    </div>
  );
}
