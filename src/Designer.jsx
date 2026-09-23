import { useEffect, useRef, useState } from "react";

function Designer({
    image,
    imageFile,
    style,
    budget,
    onSave,
    onBack,
}) {
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [generating, setGenerating] = useState(false);
    const [generatedImage, setGeneratedImage] = useState(null);

    // -------------------------
    // SPEECH RECOGNITION
    // -------------------------

    const [isListening, setIsListening] = useState(false);
    const [speechError, setSpeechError] = useState("");

    const recognitionRef = useRef(null);

    // -------------------------
    // CHAT MESSAGES
    // -------------------------

    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content: `Hi! I'm Roomora. I can help you create a ${style} look for your room.`,
        },
    ]);

    // -------------------------
    // QUICK PROMPTS
    // -------------------------

    const quickPrompts = [
        "How can I improve this room?",
        "What furniture should I add?",
        "How can I improve the lighting?",
        "Suggest colors for my room",
    ];

    // -------------------------
    // FILE TO BASE64
    // -------------------------

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();

            reader.readAsDataURL(file);

            reader.onload = () => {
                resolve(reader.result);
            };

            reader.onerror = (error) => {
                reject(error);
            };
        });
    }

    // -------------------------
    // SPEECH RECOGNITION
    // -------------------------

    function toggleSpeechRecognition() {
        setSpeechError("");

        const SpeechRecognition =
            window.SpeechRecognition ||
            window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            setSpeechError(
                "Speech recognition is not supported in this browser."
            );
            return;
        }

        // Stop listening if already active
        if (isListening && recognitionRef.current) {
            recognitionRef.current.stop();
            return;
        }

        const recognition = new SpeechRecognition();

        recognition.lang = "en-IN";
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            setIsListening(true);
            setSpeechError("");
        };

        recognition.onresult = (event) => {
            const transcript =
                event.results[0][0].transcript;

            setMessage((previous) => {
                if (!previous.trim()) {
                    return transcript;
                }

                return `${previous.trim()} ${transcript}`;
            });
        };

        recognition.onerror = (event) => {
            console.error(
                "Speech recognition error:",
                event.error
            );

            if (event.error === "not-allowed") {
                setSpeechError(
                    "Microphone permission was denied."
                );
            } else if (event.error === "no-speech") {
                setSpeechError(
                    "No speech was detected. Please try again."
                );
            } else if (event.error === "audio-capture") {
                setSpeechError(
                    "No microphone was found."
                );
            } else {
                setSpeechError(
                    "Could not recognize your voice. Please try again."
                );
            }

            setIsListening(false);
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognitionRef.current = recognition;

        try {
            recognition.start();
        } catch (error) {
            console.error(
                "Could not start speech recognition:",
                error
            );

            setIsListening(false);

            setSpeechError(
                "Could not start the microphone."
            );
        }
    }

    // -------------------------
    // SPEECH CLEANUP
    // -------------------------

    useEffect(() => {
        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.stop();
            }
        };
    }, []);

    // -------------------------
    // SEND MESSAGE
    // -------------------------

    async function sendMessage(customMessage = null) {
        const userMessage =
            customMessage || message;

        if (!userMessage.trim()) {
            return;
        }

        // Stop speech recognition if active
        if (
            recognitionRef.current &&
            isListening
        ) {
            recognitionRef.current.stop();
        }

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: userMessage,
            },
        ]);

        setMessage("");
        setSpeechError("");
        setLoading(true);

        try {
            let imageData = null;

            if (imageFile) {
                imageData =
                    await fileToBase64(imageFile);
            }

            const response = await fetch(
                "http://localhost:5000/api/chat",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        message: userMessage,
                        style,
                        budget,
                        image: imageData,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                        "Something went wrong"
                );
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        data.reply ||
                        "I couldn't generate a response right now.",
                },
            ]);
        } catch (error) {
            console.error(error);

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "I couldn't connect to Roomora AI right now. Please try again when the AI service is running.",
                },
            ]);
        } finally {
            setLoading(false);
        }
    }

    // -------------------------
    // GENERATE ROOM
    // -------------------------

    async function generateRoom() {
        if (!imageFile) {
            alert(
                "Please upload a room image first."
            );
            return;
        }

        setGenerating(true);

        try {
            const imageData =
                await fileToBase64(imageFile);

            const response = await fetch(
                "http://localhost:5000/api/generate-room",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        image: imageData,
                        style,
                        budget,
                    }),
                }
            );

            const data =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    data.error ||
                        "Unable to generate room"
                );
            }

            setGeneratedImage(
                data.image
            );
        } catch (error) {
            console.error(error);

            alert(
                "Room generation is not available yet. The AI chat can still be used."
            );
        } finally {
            setGenerating(false);
        }
    }

    // -------------------------
    // SAVE DESIGN
    // -------------------------

    function handleSave() {
        if (!onSave) {
            return;
        }

        onSave({
            image,
            imageFile,
            style,
            budget,
        });
    }

    // -------------------------
    // UI
    // -------------------------

    return (
        <div className="min-h-screen bg-[#f7f5f0]">
            {/* Top Bar */}

            <header className="flex items-center justify-between border-b border-[#dedbd4] bg-[#f7f5f0] px-5 py-4 md:px-8">
                <div className="flex items-center gap-5">
                    <button
                        onClick={onBack}
                        className="text-sm text-gray-500 transition hover:text-[#20201e]"
                    >
                        ← Back
                    </button>

                    <div className="h-5 w-px bg-[#d8d3ca]" />

                    <h1 className="text-2xl font-semibold tracking-tight">
                        roomora
                        <span className="text-[#9b8b72]">
                            .
                        </span>
                    </h1>
                </div>

                <button
                    onClick={handleSave}
                    className="roomora-button rounded-full border border-[#d8d3ca] bg-white px-5 py-2.5 text-sm font-medium transition hover:bg-[#f1eee8]"
                >
                    Save design
                </button>
            </header>

            {/* Main */}

            <main className="mx-auto max-w-7xl px-5 py-6 md:px-8 md:py-8">
                <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">

                    {/* Left Side */}

                    <section className="overflow-hidden rounded-[2rem] border border-[#dedbd4] bg-white">
                        <div className="relative">
                            {generatedImage ? (
                                <img
                                    src={generatedImage}
                                    alt="Generated room design"
                                    className="h-[520px] w-full object-cover md:h-[650px]"
                                />
                            ) : (
                                <img
                                    src={image}
                                    alt="Your room"
                                    className="h-[520px] w-full object-cover md:h-[650px]"
                                />
                            )}

                            {/* Image Label */}

                            <div className="absolute left-5 top-5 rounded-full bg-white/90 px-4 py-2 text-xs font-medium shadow-sm backdrop-blur">
                                {generatedImage
                                    ? "Roomora concept"
                                    : "Your room"}
                            </div>
                        </div>

                        {/* Room Information */}

                        <div className="flex flex-wrap items-center justify-between gap-4 p-5 md:p-6">
                            <div>
                                <p className="text-xs uppercase tracking-[0.18em] text-[#9b8b72]">
                                    Current design
                                </p>

                                <h2 className="mt-1 text-xl font-medium">
                                    {style} room
                                </h2>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                <span className="rounded-full bg-[#f1eee8] px-4 py-2 text-xs text-gray-600">
                                    {style}
                                </span>

                                <span className="rounded-full bg-[#f1eee8] px-4 py-2 text-xs text-gray-600">
                                    ₹
                                    {budget ||
                                        "Budget not set"}
                                </span>
                            </div>
                        </div>

                        {/* Generate Button */}

                        <div className="border-t border-[#eeeae3] p-5 md:p-6">
                            <button
                                onClick={generateRoom}
                                disabled={generating}
                                className="w-full rounded-2xl bg-[#20201e] px-6 py-4 text-sm font-medium text-white transition hover:bg-[#333330] disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {generating
                                    ? "Creating your room..."
                                    : "Generate redesigned room →"}
                            </button>

                            <p className="mt-3 text-center text-xs text-gray-400">
                                Turn your room photo into an AI design concept.
                            </p>
                        </div>
                    </section>

                    {/* Right Side - AI Designer */}

                    <section className="flex min-h-[700px] flex-col overflow-hidden rounded-[2rem] border border-[#dedbd4] bg-white">

                        {/* Chat Header */}

                        <div className="border-b border-[#eeeae3] p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.2em] text-[#9b8b72]">
                                        Roomora AI
                                    </p>

                                    <h2 className="mt-2 text-2xl font-medium">
                                        Your AI designer
                                    </h2>

                                    <p className="mt-2 text-sm leading-6 text-gray-500">
                                        Ask anything about your room,
                                        style, furniture or budget.
                                    </p>
                                </div>

                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#20201e] text-sm text-white">
                                    R
                                </div>
                            </div>
                        </div>

                        {/* Messages */}

                        <div className="flex-1 space-y-5 overflow-y-auto p-6">
                            {messages.map(
                                (msg, index) => (
                                    <div
                                        key={index}
                                        className={`flex ${
                                            msg.role ===
                                            "user"
                                                ? "justify-end"
                                                : "justify-start"
                                        }`}
                                    >
                                        <div
                                            className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                                                msg.role ===
                                                "user"
                                                    ? "rounded-br-md bg-[#20201e] text-white"
                                                    : "rounded-bl-md bg-[#f1eee8] text-gray-700"
                                            }`}
                                        >
                                            {msg.content}
                                        </div>
                                    </div>
                                )
                            )}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="rounded-2xl rounded-bl-md bg-[#f1eee8] px-4 py-3 text-sm text-gray-500">
                                        Roomora is thinking...
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Quick Prompts */}

                        <div className="border-t border-[#eeeae3] px-6 pt-5">
                            <p className="mb-3 text-xs uppercase tracking-[0.15em] text-gray-400">
                                Try asking
                            </p>

                            <div className="flex gap-2 overflow-x-auto pb-4">
                                {quickPrompts.map(
                                    (prompt) => (
                                        <button
                                            key={prompt}
                                            onClick={() =>
                                                sendMessage(
                                                    prompt
                                                )
                                            }
                                            disabled={
                                                loading ||
                                                isListening
                                            }
                                            className="shrink-0 rounded-full border border-[#d8d3ca] px-4 py-2 text-xs text-gray-600 transition hover:border-[#9b8b72] hover:bg-[#f7f5f0] disabled:opacity-50"
                                        >
                                            {prompt}
                                        </button>
                                    )
                                )}
                            </div>
                        </div>

                        {/* Speech Error */}

                        {speechError && (
                            <div className="px-6 pb-3">
                                <p className="rounded-xl bg-red-50 px-3 py-2 text-xs leading-5 text-red-600">
                                    {speechError}
                                </p>
                            </div>
                        )}

                        {/* Listening Indicator */}

                        {isListening && (
                            <div className="px-6 pb-3">
                                <div className="flex items-center gap-2 text-xs text-[#9b8b72]">
                                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#9b8b72]" />

                                    Listening... Speak now
                                </div>
                            </div>
                        )}

                        {/* Chat Input */}

                        <div className="p-6 pt-2">
                            <div className="flex items-center gap-2 rounded-2xl border border-[#d8d3ca] bg-[#faf9f6] p-2 focus-within:border-[#9b8b72]">

                                {/* Input */}

                                <input
                                    type="text"
                                    value={message}
                                    onChange={(e) =>
                                        setMessage(
                                            e.target.value
                                        )
                                    }
                                    onKeyDown={(e) => {
                                        if (
                                            e.key ===
                                                "Enter" &&
                                            !e.shiftKey
                                        ) {
                                            e.preventDefault();

                                            sendMessage();
                                        }
                                    }}
                                    placeholder="Ask Roomora anything..."
                                    className="min-w-0 flex-1 bg-transparent px-3 py-3 text-sm outline-none"
                                />

                                {/* Microphone */}

                                <button
                                    type="button"
                                    onClick={
                                        toggleSpeechRecognition
                                    }
                                    disabled={loading}
                                    title={
                                        isListening
                                            ? "Stop listening"
                                            : "Speak"
                                    }
                                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-sm transition ${
                                        isListening
                                            ? "bg-[#9b8b72] text-white"
                                            : "bg-[#f1eee8] text-[#20201e] hover:bg-[#e5dfd4]"
                                    } disabled:cursor-not-allowed disabled:opacity-40`}
                                >
                                    {isListening
                                        ? "■"
                                        : "🎙"}
                                </button>

                                {/* Send */}

                                <button
                                    type="button"
                                    onClick={() =>
                                        sendMessage()
                                    }
                                    disabled={
                                        loading ||
                                        !message.trim()
                                    }
                                    className="roomora-button flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#20201e] text-white transition hover:bg-[#333330] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    ↑
                                </button>
                            </div>

                            <p className="mt-2 text-center text-[11px] text-gray-400">
                                Press Enter to send
                            </p>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    );
}

export default Designer;