import styles from "./index.module.css";
import cx from "classnames";

export type MessageUnit = {
  sender: "user" | "ai";
  text: string;
};

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
      {message}
    </div>
  );
}
