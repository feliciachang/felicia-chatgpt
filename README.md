## Running the app

First, run the development server:

```
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Overview

This app is a replica of ChatGPT that uses OpenAI's chat completion API. 

Users can type a message in the input bar, which gets sent as a POST request from the client to the api route `stream-message`. The api route is a serverless way to call the OpenAI API. 

`stream-message` streams the response from OpenAI to the client in its original utf-8 encoding. The client then decodes the message into JSON and is rendered with the `react-markdown` library. 

Messages between the user and OpenAI are stored for a single session in `messageHistory`. 

## Improvements
1. Explore alternatives to the NextJS api route. Some alternatives include using Server Sent Events and Vercel's Edge Functions. The API route implementation was the implementation I was most familiar with, but more research can be done around improving latency, particularly with Edge functions.
2. Explore storage alternatives that can persist messages or allow for other chat rooms. The best implementation would be to set up a database to store messages. For a hobby project, local storage is also suitable.
3. Explore better markdown rendering and formatting. When playing around with ChatGPT, I noticed that codegen was displayed in a custom code editor with copy paste functionality. That would be also be a great next exploration.