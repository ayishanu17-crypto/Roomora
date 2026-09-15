import { useState } from "react";

function Designer({ image, imageFile, style, budget }) {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);

    const [messages, setMessages] = useState([
        {
            sender: "ai",
            text: `Hi! I'm Roomora. I can help you create a ${style} look for your room.`,
        },
    ]);

    async function fileToBase64(file) {
        // Read the file as bytes and encode it to a base64 data URL.
        // (Note: `FileReader` does not exist in browsers — use the
        // standard File/Blob API instead.)
        const buffer = await file.arrayBuffer();
        const bytes = new Uint8Array(buffer);

        let binary = "";
        const chunkSize = 0x8000;

        for (let i = 0; i < bytes.length; i += chunkSize) {
            binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
        }

        return `data:${file.type};base64,${btoa(binary)}`;
    }

    async function sendMessage() {
        if (!message.trim() || loading) return;

        const userMessage = message;

        setMessages((prev) => [
            ...prev,
            {
                sender: "user",
                text: userMessage,
            },
        ]);

        setMessage("");
        setLoading(true);

        try {
            let imageData = null;

            if (imageFile) {
                imageData = await fileToBase64(imageFile);
            }

            const response = await fetch(
                "http://localhost:5000/api/chat",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        message: userMessage,
                        style: style,
                        budget: budget,
                        image: imageData,
                    }),
                }
            );

            const data = await response.json();

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: data.reply,
                },
            ]);
        } catch (error) {
            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    sender: "ai",
                    text: "Sorry, I couldn't connect to Roomora.",
                },
            ]);
        }

        setLoading(false);
    }

    async function generateRoom() {
        if (!imageFile || generating) return;

        setGenerating(true);

        try {
            const imageData = await fileToBase64(imageFile);

            const response = await fetch(
                "http://localhost:5000/api/generate-room",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        image: imageData,
                        style: style,
                        budget: budget,
                    }),
                }
            );

            const data = await response.json();

            if (data.image) {
                setGeneratedImage(data.image);
            } else {
                alert(data.detail || "Could not generate the room.");
            }
        } catch (error) {
            console.error(error);
            alert("Something went wrong while generating the room.");
        }

        setGenerating(false);
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

                    <p className="cursor-pointer text-black">
                        My designs
                    </p>

                    <p className="cursor-pointer hover:text-black">
                        Saved
                    </p>

                    <p className="cursor-pointer hover:text-black">
                        Explore
                    </p>

                    <p className="cursor-pointer hover:text-black">
                        Shop
                    </p>

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
                                {generatedImage ? "Redesigned room" : "Your room"}
                            </h3>

                            <span className="text-sm text-gray-400">
                                {style} · ₹{budget || "—"}
                            </span>

                        </div>

                        <div className="flex flex-1 items-center justify-center overflow-hidden rounded-3xl bg-[#e9e5dc]">

                            {generatedImage ? (

                                <img
                                    src={generatedImage}
                                    alt="Redesigned room"
                                    className="h-full max-h-[650px] w-full object-cover"
                                />

                            ) : image ? (

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

                            {loading && (

                                <div className="flex justify-start">

                                    <div className="rounded-2xl bg-white px-5 py-4 text-sm text-gray-400">
                                        Roomora is thinking...
                                    </div>

                                </div>

                            )}

                        </div>

                        {/* Input */}
                        <div className="border-t border-gray-200 p-5">

                            <div className="flex items-center rounded-2xl border border-gray-300 bg-white px-4">

                                <input
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(e.target.value)
                                    }
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
                                    disabled={loading}
                                    className="rounded-xl bg-[#20201e] px-4 py-2 text-sm text-white disabled:opacity-50"
                                >
                                    →
                                </button>

                            </div>

                            <div className="mt-3 flex justify-center">

                                <button
                                    onClick={generateRoom}
                                    disabled={generating}
                                    className="text-sm text-[#9b8b72] hover:underline disabled:opacity-50"
                                >
                                    {generating
                                        ? "✨ Designing your room..."
                                        : "✨ Generate redesigned room"}
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