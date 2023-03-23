// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let body = req.body
  let {message} = body;

  const data = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: message }],
      stream: true,
    }),
    headers: {
      "Content-type": "application/json",
      Authorization:
        "Bearer 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",
    },
  });

  console.log(data)
  const reader = data.body?.pipeThrough(new TextDecoderStream()).getReader();

  while (true) {
    const result = await reader?.read();
    if (result?.done) {
      console.log("The stream is done.");
      res.end()
      break;
    }
    let chatStrings = result?.value.trim().split("\n");
    if (chatStrings) {
      chatStrings.forEach((chatString) => {
        if (chatString.length > 0) {
          if (chatString !== "data: [DONE]") {
            console.log("chat string", chatString)
            res.json(`{"${chatString.slice(0, 4)}"${chatString.slice(4)}}`)
            // let chatObj = JSON.parse(
            //   `{"${chatString.slice(0, 4)}"${chatString.slice(4)}}`
            // );
            // let content = chatObj?.data.choices[0].delta?.content;
            // if (content) {
            //   setChunk((chunk) => [...chunk, content]);
            // }
          }
        }
      });
    }
  }
}
