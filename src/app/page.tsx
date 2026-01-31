"use client";

import {useState} from "react";
import {Loader2} from "lucide-react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [streamResponse, setStreamResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [streaming, setStreaming] = useState(false);

  const handleChat = async () => {
    if (!message.trim()) return;

    setLoading(true);
    setResponse("");
    setStreamResponse("");

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message}),
    });

    const data = await res.json();
    setResponse(data.response);
    setLoading(false);
  };

  const handleStreamChat = async () => {
    if (!message.trim()) return;

    setStreaming(true);
    setResponse("");
    setStreamResponse("");

    const res = await fetch("/api/chat-stream", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify({message}),
    });

    const reader = res.body!.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const {value, done} = await reader.read();
      if (done) break;

      const chunk = decoder.decode(value);
      const lines = chunk.split("\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          setStreamResponse((prev) => prev + line.replace("data: ", ""));
        }
      }
    }

    setStreaming(false);
  };

  return (
    <div className='w-4xl mx-auto border-l border-r border-neutral-200 min-h-screen bg-white'>
      <h1 className='text-2xl font-bold text-neutral-700 py-4 w-full text-center border-b border-neutral-200'>
        NEXTJS OPENAI WITH STREAM
      </h1>

      <div className='w-full py-4 px-8'>
        <textarea
          onChange={(e) => setMessage(e.target.value)}
          value={message}
          placeholder='Ask me anything...'
          className='w-full h-24 bg-neutral-50/80 border border-neutral-300 rounded-lg p-3 outline-none text-neutral-800'
        />

        <div className='flex gap-2 mt-2'>
          <button
            className='bg-neutral-800 text-white py-1.5 px-4 rounded-lg cursor-pointer'
            onClick={handleChat}>
            {loading ? <Loader2 className='animate-spin' /> : "Chat"}
          </button>

          <button
            className='bg-neutral-800 text-white py-1.5 px-4 rounded-lg cursor-pointer'
            onClick={handleStreamChat}>
            {streaming ? <Loader2 className='animate-spin' /> : "Stream"}
          </button>
        </div>

        <div className='mt-8'>
          <span className='text-neutral-700 font-medium px-1'>Response</span>
          <div className='max-w-full border border-neutral-200 rounded-lg mt-2 p-3 min-h-104 whitespace-normal text-md text-neutral-700 bg-neutral-50/80 text-justify tracking-wide'>
            {response}
          </div>
        </div>
      </div>
    </div>
  );
}
