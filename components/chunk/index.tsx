import { useEffect, useState } from "react";
import styles from "./index.module.css";

interface ChunkProps {
  data: string;
}
export default function Chunk(props: ChunkProps) {
  const { data } = props;
  const [addLineBreak, setAddLineBreak] = useState(false);

  useEffect(() => {
    if (data.includes("\n")) {
      setAddLineBreak(true);
    }
  }, [data]);

  return (
    <div>
      <span className={styles.chunkRenderer}>{data}</span>
      {addLineBreak && <br />}
    </div>
  );
}
