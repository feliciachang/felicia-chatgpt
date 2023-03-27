import styles from "./index.module.css";
import cx from "classnames";

interface MessageProps {
  sender: "user" | "ai";
  message: JSX.Element;
}

export default function Message(props: MessageProps) {
  const { sender, message } = props;

  return (
    <div
      className={cx(styles.container, {
        [styles.sender]: sender === "user",
      })}
    >
      <div
        className={cx(styles.avatar, {
          [styles.userAvatar]: sender === "user",
        })}
      />
      <div className={styles.message}>{message}</div>
    </div>
  );
}
