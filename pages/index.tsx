import Chunk from "@/components/chunk";
import EmptyState from "@/components/empty-state";
import Head from "next/head";
import InputBox from "@/components/input-box";
import Markdown from "@/components/markdown";
import Message from "@/components/messages";
import { separateJsonByNewline } from "@/components/utils";
import { useState } from "react";
import styles from "@/styles/Home.module.css";

type MessageUnit = {
  sender: "user" | "ai";
  text: string;
};

export default function Home() {
  const [messageHistory, setMessageHistory] = useState<MessageUnit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [chunks, setChunks] = useState<string[]>([]);
  const [useMarkdown, setUseMarkdown] = useState(false);

  function manageMessageHistory(message: string) {
    // move old generated AI answer to message history
    if (chunks.length > 0) {
      setMessageHistory((messageHistory) => [
        ...messageHistory,
        {
          sender: "ai",
          text: chunks.join(""),
        },
      ]);
    }
    // clear chunks state
    setChunks([]);
    // add latest user input to message history
    setMessageHistory((messageHistory) => [
      ...messageHistory,
      {
        sender: "user",
        text: message,
      },
    ]);
  }

  async function handleReadMessage(res: Response) {
    // use TextDecoderStream to decode utf-8 chunk
    const decoder = new TextDecoderStream();
    // pipe response body through decoder so that it is readable
    const reader = res.body?.pipeThrough(decoder).getReader();

    while (true) {
      const res = await reader?.read();

      if (res?.done) {
        // the stream is done
        setUseMarkdown(true);
        break;
      }

      // multiple JSON objects can be sent in a single chunk
      // to parse the JSON objects, split the result value by newline characters
      if (res?.value) {
        let jsonStrings = separateJsonByNewline(res.value);
        jsonStrings.forEach((jsonString) => {
          if (jsonString.length > 0 && jsonString !== "data: [DONE]") {
            // formatting of the result isn't semantically correct so making some manual adjustmets here:
            try {
              let jsonObj = JSON.parse(
                `{"${jsonString.slice(0, 4)}"${jsonString.slice(4)}}`
              );
              if (jsonObj) {
                // content is where the actually readable text lives
                let content = jsonObj?.data.choices[0].delta?.content;
                // sometimes no content is returned
                if (content) {
                  // push latest chunk to the chunks array
                  setChunks((chunks) => [...chunks, content]);
                }
              }
            } catch (e) {
              console.log(e);
              // show error state
              setError(true);
            }
            // reset loading state
            setLoading(false);
          }
        });
      }
    }
  }

  async function handleSendMessage(message: string) {
    // reset states
    setError(false);
    setUseMarkdown(false);
    // show loading notification
    setLoading(true);

    // manage message history before calling for new chat completion
    manageMessageHistory(message);

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

    // handle streaming logic
    handleReadMessage(res);
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
              <Message
                key={i}
                sender={historyItem.sender}
                message={<Markdown message={historyItem.text} />}
              />
            ))}
          </div>
        )}
        {(chunks.length > 0 || loading || error) && (
          <Message
            sender="ai"
            message={
              <>
                {useMarkdown ? (
                  <Markdown message={chunks.join("")} />
                ) : (
                  <>
                    {chunks.map((chunk, i) => {
                      return <Chunk key={i} data={chunk} />;
                    })}
                  </>
                )}
                {loading && <div className={styles.typingIndicator} />}
                {error && (
                  <span>
                    sorry, we were unable to generate your message. please try
                    again.
                  </span>
                )}
              </>
            }
          />
        )}
        {chunks.length === 0 && messageHistory.length === 0 && (
          <EmptyState handleSendMessage={handleSendMessage} />
        )}
        <InputBox handleSendMessage={handleSendMessage} />
      </main>
    </>
  );
}
