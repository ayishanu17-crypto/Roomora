import { useState } from "react";

function Design({ onContinue }) {
    const [style, setStyle] = useState("Modern");
    const [image, setImage] = useState(null);
    const [budget, setBudget] = useState("");

    function handleImage(e) {
        const file = e.target.files[0];

        if (file) {
            setImage(URL.createObjectURL(file));
        }
    }

    function handleContinue() {
        onContinue({
            image,
            style,
            budget
        });
    }

    return (
        <div className="min-h-screen bg-[#f7f5f0] px-6 py-8 md:px-12">

            {/* Header */}
            <header className="flex items-center justify-between">

                <h1 className="text-2xl font-semibold">
                    roomora<span className="text-[#9b8b72]">.</span>
                </h1>

                <button className="text-sm text-gray-500 hover:text-black">
                    My designs
                </button>

            </header>


            {/* Main */}
            <main className="mx-auto max-w-5xl py-16">

                <div className="mb-12">

                    <p className="text-sm uppercase tracking-[0.25em] text-[#9b8b72]">
                        New design
                    </p>

                    <h2 className="mt-3 text-4xl font-medium md:text-6xl">
                        Let's transform your space.
                    </h2>

                    <p className="mt-5 max-w-xl text-gray-500">
                        Upload a photo of your room, choose your style,
                        and tell us how much you want to spend.
                    </p>

                </div>


                {/* Upload */}
                <section>

                    <h3 className="mb-4 text-lg font-medium">
                        01 · Your room
                    </h3>

                    <label className="block cursor-pointer">

                        <div className="flex min-h-[360px] items-center justify-center overflow-hidden rounded-[2rem] border-2 border-dashed border-gray-300 bg-white transition hover:border-[#9b8b72]">

                            {image ? (

                                <img
                                    src={image}
                                    alt="Uploaded room"
                                    className="h-[360px] w-full object-cover"
                                />

                            ) : (

                                <div className="text-center">

                                    <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#f0ece4] text-2xl">
                                        +
                                    </div>

                                    <p className="font-medium">
                                        Upload a room photo
                                    </p>

                                    <p className="mt-2 text-sm text-gray-400">
                                        JPG, PNG or WEBP
                                    </p>

                                </div>

                            )}

                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImage}
                            className="hidden"
                        />

                    </label>

                </section>


                {/* Style */}
                <section className="mt-14">

                    <h3 className="mb-5 text-lg font-medium">
                        02 · Your style
                    </h3>

                    <div className="flex flex-wrap gap-3">

                        {[
                            "Modern",
                            "Minimal",
                            "Japandi",
                            "Boho",
                            "Luxury",
                            "Scandinavian",
                        ].map((item) => (

                            <button
                                key={item}
                                onClick={() => setStyle(item)}
                                className={`rounded-full border px-6 py-3 text-sm transition ${style === item
                                        ? "border-[#20201e] bg-[#20201e] text-white"
                                        : "border-gray-300 bg-white hover:border-gray-500"
                                    }`}
                            >
                                {item}
                            </button>

                        ))}

                    </div>

                </section>


                {/* Budget */}
                <section className="mt-14">

                    <h3 className="mb-5 text-lg font-medium">
                        03 · Your budget
                    </h3>

                    <div className="flex max-w-md items-center rounded-2xl border border-gray-300 bg-white px-5">

                        <span className="text-gray-400">
                            ₹
                        </span>

                        <input
                            type="number"
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            placeholder="Enter your budget"
                            className="w-full bg-transparent px-3 py-4 outline-none"
                        />

                    </div>

                </section>


                {/* Continue */}
                <div className="mt-16 flex justify-end">

                    <button
                        disabled={!image}
                        onClick={handleContinue}
                        className="rounded-full bg-[#20201e] px-8 py-4 text-sm text-white transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-30"
                    >
                        Continue to AI designer →
                    </button>

                </div>

            </main>

        </div>
    );
}

export default Design;