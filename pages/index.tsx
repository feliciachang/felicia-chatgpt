import Head from "next/head";
import Image from "next/image";
import EmptyState from "@/components/empty-state";
import Message, { MessageUnit } from "@/components/messages";
import { useState } from "react";
import styles from "@/styles/Home.module.css";
import formStyles from "@/components/input-box/index.module.css";

// to do
// overhaul flex positioning
// loading for ai answer
// today: figure out markdown

export default function Home() {
  const [messageHistory, setMessageHistory] = useState<MessageUnit[]>([]);
  const [loading, setLoading] = useState(false);
  const [chunks, setChunks] = useState<string[]>([]);
  const [input, setInput] = useState("");

  async function handleSendMessage(message: string) {
    setLoading(true);

    setMessageHistory((messageHistory) => [
      ...messageHistory,
      {
        sender: "user",
        chunkedMessage: [message],
      },
    ]);

    // make a POST request to our API route, which will call OpenAI's API
    const res = await fetch("/api/stream-message", {
      method: "POST",
      body: JSON.stringify({
        message: message,
      }),
      headers: {
        "Content-type": "application/json",
      },
    });

    const reader = res.body?.pipeThrough(new TextDecoderStream()).getReader();

    while (true) {
      const res = await reader?.read();
      if (res?.done) {
        // the stream is done
        break;
      }

      // multiple JSON objects can be sent in a single chunk
      // to parse the JSON objects, split the result value by newline characters
      let chatStrings = res?.value.trim().split("\n");
      if (chatStrings) {
        chatStrings.forEach((chatString) => {
          if (chatString.length > 0 && chatString !== "data: [DONE]") {
            // formatting of the result isn't semantically correct so making some manual adjustmets here:
            let chatObj = JSON.parse(
              `{"${chatString.slice(0, 4)}"${chatString.slice(4)}}`
            );

            // content is where the actually readable text lives
            let content = chatObj?.data.choices[0].delta?.content;
            // sometimes no content is returned
            if (content) {
              setLoading(false);
              // push latest chunk to the chunks array
              setChunks((chunks) => [...chunks, content]);
            }
          }
        });
      }
    }
  }

  return (
    <>
      <Head>
        <title>Felchat</title>
        <meta name="description" content="A ChatGPT replica" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        {messageHistory.length > 0 && (
          <div className={styles.history}>
            {messageHistory.map((historyItem, i) => (
              <Message key={i} messageUnit={historyItem} />
            ))}
          </div>
        )}
        {chunks.length > 0 && (
          <Message
            loading={loading}
            messageUnit={{
              sender: "ai",
              chunkedMessage: chunks,
            }}
          />
        )}
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
                  chunkedMessage: chunks,
                },
              ]);
            }
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
