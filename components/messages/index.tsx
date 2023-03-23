import ReactMarkdown from "react-markdown";
import styles from "./index.module.css";
import cx from "classnames";

export type MessageUnit = {
  sender: "user" | "ai";
  chunkedMessage: string[];
};

interface MessageProps {
  loading?: boolean;
  messageUnit: MessageUnit;
}
export default function Message(props: MessageProps) {
  const { messageUnit, loading } = props;

  return (
    <div
      className={cx(styles.container, {
        [styles.sender]: messageUnit?.sender === "user",
      })}
    >
      <div
        className={cx(styles.avatar, {
          [styles.userAvatar]: messageUnit?.sender === "user",
        })}
      />
      {messageUnit.chunkedMessage && (
        <div className={styles.chunkedMessage}>
          <ReactMarkdown>{messageUnit.chunkedMessage.join("")}</ReactMarkdown>
        </div>
      )}
      {loading && <div className={styles.chunkedMessage}>...</div>}
    </div>
  );
}
