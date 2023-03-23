import ReactMarkdown from "react-markdown";
import styles from "./index.module.css";
import cx from "classnames";

export type MessageUnit = {
  sender: "user" | "ai";
  chunkedMessage: string[];
};

interface MessageProps {
  loading?: boolean;
  error?: boolean;
  messageUnit: MessageUnit;
}
export default function Message(props: MessageProps) {
  const { messageUnit, loading, error } = props;

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
      {loading && <div>...</div>}
      {error && (
        <div>We were unable to generate a message, please try again.</div>
      )}
    </div>
  );
}
