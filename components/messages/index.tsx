import styles from "./index.module.css";
import cx from "classnames";

export type MessageString = {
  sender: "user" | "ai";
  message: string;
};

interface MessageProps {
  chunks?: string[];
  messageString?: MessageString;
}
export default function Message(props: MessageProps) {
  const { chunks, messageString } = props;

  return (
    <div className={styles.container}>
      <div
        className={cx(styles.avatar, {
          [styles.userAvatar]: messageString?.sender === "user",
        })}
      />
      {chunks && (
        <div className={styles.chunkedMessage}>
          {chunks.map((chunkItem) => (
            <span key={chunkItem} className={styles.chunk}>
              {chunkItem}
            </span>
          ))}
        </div>
      )}
      {messageString && (
        <div className={styles.message}>{messageString.message}</div>
      )}
    </div>
  );
}
