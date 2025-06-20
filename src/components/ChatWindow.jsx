import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import { ChatBubbleLeftRightIcon, UserIcon } from "@heroicons/react/24/solid";

const ChatWindow = () => {
  const [inputMessage, setInputMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollToBottomRef = useRef(null);

  useEffect(() => {
    if (scrollToBottomRef.current) {
      scrollToBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSendMessage = async (e) => {
    if (!inputMessage.trim()) return;

    const userMessage = inputMessage;
    setMessages((prev) => [
      ...prev,
      {
        sender: "user",
        text: userMessage,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
    setInputMessage("");
    setIsLoading(true);

    try {
      const backResponse = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/chat`, {
        text: userMessage,
      });

      const backReply = backResponse.data.message;

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: backReply,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } catch (err) {
      console.error("Error sending message: ", err);
      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          text: "Something went wrong.",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    }
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col gap-2 p-4">
      <div className="flex flex-col gap-2 overflow-y-auto p-4 bg-white h-[70vh] rounded-lg">
        {messages.length > 0 ? (
          <>
            {messages.map((msg, index) => {
              const IconComponent =
                msg.sender === "user" ? UserIcon : ChatBubbleLeftRightIcon;

              return (
                <div
                  key={index}
                  className={`p-2 rounded-lg max-w-xs ${
                    msg.sender === "user"
                      ? "bg-purple-100 self-end text-black"
                      : "bg-green-200 self-start text-black"
                  }`}
                >
                  <div className="flex items-start gap-2">
                    <IconComponent className="h-5 w-5 mt-1" />
                    <div>
                      <ReactMarkdown>{msg.text}</ReactMarkdown>
                      <div className="text-xs text-gray-400 italic mt-1">
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
            {isLoading && (
              <div className="p-2 rounded-lg max-w-xs bg-gray-200 self-start text-gray-600 italic">
                Thinking...
              </div>
            )}
          </>
        ) : (
          <h1 className="text-gray-400 italic text-center">No messages yet...</h1>
        )}
        <div ref={scrollToBottomRef} />
      </div>

      <div className="flex gap-2 mt-3">
        <input
          type="text"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSendMessage(e);
            }
          }}
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type your message here..."
          className="flex-1 border rounded-md px-4 py-2"
        />
        <button
          onClick={handleSendMessage}
          className="rounded-md bg-blue-700 px-3 py-2 text-white font-semibold hover:bg-blue-500"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
