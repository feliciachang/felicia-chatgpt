// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // get message from request body, sent from handleSendMessage
  let body = req.body
  let {message} = body;

  // call openAI's chat completion api with the message received from the request body
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
      `Bearer ${process.env.OPEN_AI_KEY}`,
    },
  });


  const reader = data.body?.pipeThrough(new TextDecoderStream()).getReader();

  // create a result that can stream the chunked as we receive it from OpenAI
  // credit for header settings: https://stackoverflow.com/questions/75256892/eventsource-gets-all-chunks-at-once-when-streaming-via-nextjs-api-routes
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.setHeader("Transfer-Encoding", "chunked");
  res.setHeader("Content-Encoding", "none");

  while (true) {
    const result = await reader?.read();

    if (result?.done) {
      // the stream is done
      res.end()
      break;
    }

    if(result?.value) {
      // write the result
      res.write(result?.value)
    }
  }
}
