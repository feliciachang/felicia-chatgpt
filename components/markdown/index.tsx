import ReactMarkdown from "react-markdown";
import styles from "./index.module.css";

interface MarkdownProps {
  message: string;
}

export default function Markdown(props: MarkdownProps) {
  const { message } = props;
  return (
    <div className={styles.chunkedMessage}>
      <ReactMarkdown className={styles.markdownRenderer}>
        {message}
      </ReactMarkdown>
    </div>
  );
}
