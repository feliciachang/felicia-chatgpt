import ReactMarkdown from "react-markdown";
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
    <div
      className={cx(styles.container, {
        [styles.sender]: messageString?.sender === "user",
      })}
    >
      <div
        className={cx(styles.avatar, {
          [styles.userAvatar]: messageString?.sender === "user",
        })}
      />
      {chunks && (
        <div className={styles.chunkedMessage}>
          <ReactMarkdown>{chunks.join("")}</ReactMarkdown>
          {/* {chunks.map((chunkItem, i) => (
            <span key={`${chunkItem}-${i}-${Math.random() * 100}`}>
              {chunkItem}
            </span>
          ))} */}
        </div>
      )}
      {messageString && (
        <div className={styles.message}>{messageString.message}</div>
      )}
    </div>
  );
}
