import { useState } from "react";

function Designer({ image, style, budget }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: `Hi! I'm Roomora. I can help you create a ${style} look for your room.`,
        },
    ]);

    function sendMessage() {
        if (!message.trim()) return;

        setMessages([
            ...messages,
            {
                sender: "user",
                text: message,
            },
        ]);

        setMessage("");
    }

    return (
        <div className="flex min-h-screen bg-[#f7f5f0]">

            {/* Sidebar */}
            <aside className="hidden w-60 border-r border-gray-200 bg-[#f7f5f0] p-6 md:block">

                <h1 className="text-2xl font-semibold">
                    roomora<span className="text-[#9b8b72]">.</span>
                </h1>

                <button className="mt-10 w-full rounded-xl bg-[#20201e] px-4 py-3 text-sm text-white">
                    + New design
                </button>

                <div className="mt-8 space-y-5 text-sm text-gray-500">
                    <p className="cursor-pointer text-black">My designs</p>
                    <p className="cursor-pointer hover:text-black">Saved</p>
                    <p className="cursor-pointer hover:text-black">Explore</p>
                    <p className="cursor-pointer hover:text-black">Shop</p>
                </div>

            </aside>


            {/* Main */}
            <main className="flex min-h-screen flex-1 flex-col">

                {/* Header */}
                <header className="flex items-center justify-between border-b border-gray-200 px-6 py-5">

                    <div>
                        <p className="text-sm text-gray-400">
                            Your design
                        </p>

                        <h2 className="font-medium">
                            {style} Room
                        </h2>
                    </div>

                    <button className="rounded-full border border-gray-300 px-5 py-2 text-sm">
                        Save design
                    </button>

                </header>


                {/* Content */}
                <div className="grid flex-1 lg:grid-cols-2">

                    {/* Room */}
                    <section className="flex flex-col border-b border-gray-200 p-6 lg:border-b-0 lg:border-r">

                        <div className="mb-4 flex justify-between">

                            <h3 className="font-medium">
                                Your room
                            </h3>

                            <span className="text-sm text-gray-400">
                                {style} · ₹{budget || "—"}
                            </span>

                        </div>

                        <div className="flex flex-1 items-center justify-center overflow-hidden rounded-3xl bg-[#e9e5dc]">

                            {image ? (
                                <img
                                    src={image}
                                    alt="Your room"
                                    className="h-full max-h-[650px] w-full object-cover"
                                />
                            ) : (
                                <div className="text-center text-gray-400">
                                    <p>No room image</p>
                                </div>
                            )}

                        </div>

                    </section>


                    {/* Chat */}
                    <section className="flex min-h-[600px] flex-col">

                        <div className="border-b border-gray-200 px-6 py-5">
                            <p className="text-sm uppercase tracking-[0.2em] text-[#9b8b72]">
                                AI Designer
                            </p>
                        </div>


                        {/* Messages */}
                        <div className="flex-1 space-y-6 overflow-y-auto p-6">

                            {messages.map((item, index) => (

                                <div
                                    key={index}
                                    className={`flex ${item.sender === "user"
                                            ? "justify-end"
                                            : "justify-start"
                                        }`}
                                >

                                    <div
                                        className={`max-w-md rounded-2xl px-5 py-4 text-sm leading-6 ${item.sender === "user"
                                                ? "bg-[#20201e] text-white"
                                                : "bg-white text-gray-700"
                                            }`}
                                    >
                                        {item.text}
                                    </div>

                                </div>

                            ))}

                        </div>


                        {/* Input */}
                        <div className="border-t border-gray-200 p-5">

                            <div className="flex items-center rounded-2xl border border-gray-300 bg-white px-4">

                                <input
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            sendMessage();
                                        }
                                    }}
                                    placeholder="Ask Roomora about your room..."
                                    className="flex-1 bg-transparent py-4 text-sm outline-none"
                                />

                                <button
                                    onClick={sendMessage}
                                    className="rounded-xl bg-[#20201e] px-4 py-2 text-sm text-white"
                                >
                                    →
                                </button>

                            </div>

                            <p className="mt-3 text-center text-xs text-gray-400">
                                Roomora can make mistakes. Check important information.
                            </p>

                        </div>

                    </section>

                </div>

            </main>

        </div>
    );
}

export default Designer;