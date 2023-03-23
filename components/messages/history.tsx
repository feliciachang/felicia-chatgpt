import Message, { MessageUnit } from "./index";
import styles from "./history.module.css";
import cx from "classnames";

interface MessageHistoryProps {
  history: MessageUnit[];
}

export default function MessageHistory(
  props: MessageHistoryProps
): JSX.Element {
  const { history } = props;

  return (
    <div className={styles.container}>
      {history.map((historyItem, i) => (
        <Message key={i} messageUnit={historyItem} />
      ))}
    </div>
  );
}
