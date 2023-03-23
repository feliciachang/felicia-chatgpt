import Image from "next/image";
import { useState } from "react";
import formStyles from "./index.module.css";

interface InputBoxProps {
  handleSendMessage: (message: string) => void;
}

export default function InputBox(props: InputBoxProps) {
  const { handleSendMessage } = props;

  const [input, setInput] = useState("");

  return (
    <form
      className={formStyles.inputBox}
      onSubmit={(e) => {
        e.preventDefault();
        handleSendMessage(input);
        setInput("");
      }}
    >
      <input
        className={formStyles.textArea}
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button className={formStyles.button} type="submit">
        <Image src="/send-button.svg" alt="arrow" width={25} height={25} />
      </button>
    </form>
  );
}
