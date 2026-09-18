import { useState } from "react";

function Design({ onContinue, selectedStyle = "Modern" }) {
    const [style, setStyle] = useState(selectedStyle);
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [budget, setBudget] = useState("");

    const styles = [
        "Modern",
        "Minimal",
        "Japandi",
        "Scandinavian",
        "Boho",
        "Luxury",
        "Industrial",
        "Contemporary",
        "Rustic",
        "Mid-Century Modern",
        "Dark Academia",
        "Biophilic",
    ];

    function handleImage(e) {
        const file = e.target.files[0];

        if (file) {
            setImageFile(file);
            setImage(URL.createObjectURL(file));
        }
    }

    function continueDesign() {
        if (!imageFile) {
            alert("Please upload a room photo first.");
            return;
        }

        onContinue({
            image,
            imageFile,
            style,
            budget,
        });
    }

    return (
        <div className="min-h-screen bg-[#f7f5f0]">

            {/* Header */}

            <header className="flex items-center justify-between border-b border-[#dedbd4] px-6 py-5 md:px-10">

                <h1 className="text-2xl font-semibold tracking-tight">
                    roomora<span className="text-[#9b8b72]">.</span>
                </h1>

                <span className="text-xs uppercase tracking-[0.18em] text-gray-400">
                    Create your design
                </span>

            </header>


            {/* Main */}

            <main className="mx-auto max-w-5xl px-5 py-10 md:px-8 md:py-14">

                <div className="max-w-2xl">

                    <p className="text-xs uppercase tracking-[0.2em] text-[#9b8b72]">
                        Roomora Studio
                    </p>

                    <h2 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
                        Let's design your room.
                    </h2>

                    <p className="mt-4 text-base leading-7 text-gray-500">
                        Upload your space, choose a style, and tell us
                        your budget. Roomora will take care of the rest.
                    </p>

                </div>


                {/* Room Upload */}

                <section className="mt-12">

                    <div className="mb-4">

                        <h3 className="font-medium">
                            01. Your room
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                            Upload a clear photo of your room.
                        </p>

                    </div>


                    <label className="group flex min-h-[360px] cursor-pointer items-center justify-center overflow-hidden rounded-[28px] border border-[#d8d3ca] bg-white transition hover:border-[#9b8b72]">

                        {image ? (

                            <img
                                src={image}
                                alt="Uploaded room"
                                className="h-full min-h-[360px] w-full object-cover"
                            />

                        ) : (

                            <div className="text-center">

                                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f1eee8] text-xl">
                                    +
                                </div>

                                <p className="mt-5 text-sm font-medium">
                                    Upload your room photo
                                </p>

                                <p className="mt-2 text-xs text-gray-400">
                                    JPG, PNG or WEBP
                                </p>

                            </div>

                        )}


                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                            className="hidden"
                        />

                    </label>

                </section>


                {/* Style */}

                <section className="mt-12">

                    <div className="mb-5">

                        <h3 className="font-medium">
                            02. Choose your style
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                            What kind of atmosphere do you want?
                        </p>

                    </div>


                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">

                        {styles.map((item) => (

                            <button
                                key={item}
                                onClick={() => setStyle(item)}
                                className={`rounded-2xl border px-5 py-5 text-left transition ${
                                    style === item
                                        ? "border-[#20201e] bg-[#20201e] text-white"
                                        : "border-[#d8d3ca] bg-white text-gray-700 hover:border-[#9b8b72]"
                                }`}
                            >

                                <span className="text-sm font-medium">
                                    {item}
                                </span>

                                {style === item && (

                                    <span className="mt-2 block text-xs text-gray-300">
                                        Selected
                                    </span>

                                )}

                            </button>

                        ))}

                    </div>

                </section>


                {/* Budget */}

                <section className="mt-12">

                    <div className="mb-5">

                        <h3 className="font-medium">
                            03. Set your budget
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                            We'll keep our recommendations within your range.
                        </p>

                    </div>


                    <div className="relative max-w-md">

                        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400">
                            ₹
                        </span>

                        <input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="20,000"
                            className="w-full rounded-2xl border border-[#d8d3ca] bg-white px-10 py-4 text-sm outline-none transition focus:border-[#9b8b72]"
                        />

                    </div>

                </section>


                {/* Continue */}

                <div className="mt-14 border-t border-[#dedbd4] pt-8">

                    <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">

                        <div>

                            <p className="text-sm font-medium">
                                Ready to see your design?
                            </p>

                            <p className="mt-1 text-xs text-gray-400">
                                {style} · ₹{budget || "Budget not set"}
                            </p>

                        </div>


                        <button
                            onClick={continueDesign}
                            className="w-full rounded-2xl bg-[#20201e] px-8 py-4 text-sm font-medium text-white transition hover:bg-[#333330] md:w-auto"
                        >
                            Continue to AI Designer →
                        </button>

                    </div>

                </div>

            </main>

        </div>
    );
}

export default Design;