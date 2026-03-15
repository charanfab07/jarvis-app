'use client';
import { useState, useRef, useEffect } from "react";

export default function Home() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([
    { role: "jarvis", text: "I'm online. How can I help you?" }
  ]);
  const [loading, setLoading] = useState(false);
  const [personality, setPersonality] = useState("witty and sarcastic");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const askJarvis = async (text) => {
    const msg = text || message;
    if (!msg.trim()) return;

    setMessages((prev) => [...prev, { role: "user", text: msg }]);
    setMessage("");
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg, personality }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { role: "jarvis", text: data.reply }]);
    setLoading(false);

    const utterance = new SpeechSynthesisUtterance(data.reply);
    utterance.rate = 1;
    utterance.pitch = 0.9;
    window.speechSynthesis.speak(utterance);
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Use Chrome for voice input.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;
    recognitionRef.current = recognition;
    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      askJarvis(transcript);
    };
    recognition.start();
  };

  return (
    <main className="min-h-screen bg-black flex flex-col items-center p-8 gap-6">

      <div className="text-center mt-6">
        <h1 className="text-5xl font-bold text-blue-400 tracking-widest">JARVIS</h1>
        <p className="text-gray-500 text-xs mt-1 tracking-widest uppercase">Just A Rather Very Intelligent System</p>
      </div>

      {/* Personality Selector */}
      <div className="flex gap-3">
        {["witty and sarcastic", "calm and smart", "friendly and energetic"].map((p) => (
          <button
            key={p}
            onClick={() => setPersonality(p)}
            className={`px-4 py-2 rounded-full text-sm capitalize border ${personality === p
                ? "bg-blue-600 border-blue-600 text-white"
                : "border-blue-900 text-gray-400 hover:border-blue-500"
              }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Chat History */}
      <div className="w-full max-w-2xl flex-1 bg-gray-900 border border-blue-900 rounded-2xl p-6 overflow-y-auto flex flex-col gap-4" style={{ minHeight: "400px", maxHeight: "500px" }}>
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl text-sm ${msg.role === "user"
                ? "bg-blue-600 text-white rounded-br-none"
                : "bg-gray-800 text-blue-300 rounded-bl-none"
              }`}>
              {msg.role === "jarvis" && <span className="text-xs text-blue-500 block mb-1 font-bold">JARVIS</span>}
              {msg.text}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-blue-300 px-4 py-3 rounded-2xl rounded-bl-none text-sm">
              <span className="text-xs text-blue-500 block mb-1 font-bold">JARVIS</span>
              Thinking...
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input + Mic */}
      <div className="w-full max-w-2xl flex gap-3">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && askJarvis()}
          placeholder="Ask JARVIS anything..."
          className="flex-1 bg-gray-900 border border-blue-900 text-white rounded-xl px-5 py-3 outline-none focus:border-blue-500"
        />
        <button
          onClick={startListening}
          className={`px-4 py-3 rounded-xl border text-xl ${listening
              ? "bg-red-600 border-red-600 animate-pulse"
              : "bg-gray-900 border-blue-900 hover:border-blue-500"
            }`}
        >
          🎤
        </button>
        <button
          onClick={() => askJarvis()}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-6 py-3 rounded-xl font-semibold"
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse"></div>
        <span className="text-green-400 text-sm">
          {listening ? "Listening..." : "JARVIS Online"}
        </span>
      </div>

    </main>
  );
}