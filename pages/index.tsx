import Head from "next/head";
import Image from "next/image";
import MessageHistory from "@/components/messages/history";
import EmptyState from "@/components/messages/empty-state";
import Message, { MessageString } from "@/components/messages";
import { useState } from "react";
import styles from "@/styles/Home.module.css";
import formStyles from "@/components/input-box/index.module.css";

// to do
// overhaul flex positioning
// loading for ai answer
// today: figure out markdown

export default function Home() {
  const [messageHistory, setMessageHistory] = useState<MessageString[]>([]);
  const [chunks, setChunks] = useState<string[]>([]);
  const [input, setInput] = useState("");

  async function handleSendMessage(message: string) {
    // const res = await fetch("https://api.openai.com/v1/chat/completions", {
    //   method: "POST",
    //   body: JSON.stringify({
    //     model: "gpt-3.5-turbo",
    //     messages: [{ role: "user", content: message }],
    //     stream: true,
    //   }),
    //   headers: {
    //     "Content-type": "application/json",
    //     Authorization:
    //       "Bearer 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",
    //   },
    // });
    const res = await fetch("/api/stream-message", {
      method: "POST",
      body: JSON.stringify({
        message: message,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });
    console.log(res);

    const reader = res.body?.pipeThrough(new TextDecoderStream()).getReader();

    while (true) {
      const res = await reader?.read();
      if (res?.done) {
        console.log("The stream is done.");
        break;
      }
      //console.log(res?.value);
      console.log("RESULT VALUE", res?.value);
      let chatStrings = res?.value.trim().split("\n");
      // console.log(chatStrings);
      if (chatStrings) {
        chatStrings.forEach((chatString) => {
          if (chatString.length > 0) {
            if (chatString !== "data: [DONE]") {
              let chatObj = JSON.parse(
                `{"${chatString.slice(0, 4)}"${chatString.slice(4)}}`
              );
              let content = chatObj?.data.choices[0].delta?.content;
              if (content) {
                console.log(content);
                setChunks((chunks) => [...chunks, content]);
              }
            }
          }
        });
      }
    }
  }

  return (
    <>
      <Head>
        <title>FelChat</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {messageHistory.length > 0 && (
          <MessageHistory history={messageHistory} />
        )}
        {chunks.length > 0 && <Message chunks={chunks} />}
        {chunks.length === 0 && messageHistory.length === 0 && (
          <EmptyState handleSendMessage={handleSendMessage} />
        )}
        <form
          className={formStyles.inputBox}
          onSubmit={(e) => {
            e.preventDefault();
            if (chunks.length > 0) {
              setMessageHistory((messageHistory) => [
                ...messageHistory,
                {
                  sender: "ai",
                  message: chunks.join(),
                },
              ]);
            }
            setMessageHistory((messageHistory) => [
              ...messageHistory,
              {
                sender: "user",
                message: input,
              },
            ]);
            setChunks([]);
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
      </main>
    </>
  );
}

{
  /* <a
href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
className={styles.card}
target="_blank"
rel="noopener noreferrer"
>
<h2 className={inter.className}>
  Deploy <span>-&gt;</span>
</h2>
<p className={inter.className}>
  Instantly deploy your Next.js site to a shareable URL
  with&nbsp;Vercel.
</p>
</a> */
}
