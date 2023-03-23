import Message, { MessageString } from "./index";
import styles from "./history.module.css";
import cx from "classnames";

interface MessageHistoryProps {
  history: MessageString[];
}

export default function MessageHistory(
  props: MessageHistoryProps
): JSX.Element {
  const { history } = props;

  return (
    <div className={styles.container}>
      {history.map((historyItem) => (
        <Message key={historyItem.message} messageString={historyItem} />
      ))}
    </div>
  );
}
