import { useState } from "react";

function Design({ onContinue }) {
    const [style, setStyle] = useState("Modern");
    const [image, setImage] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [budget, setBudget] = useState("");

    const styles = [
        "Modern",
        "Minimal",
        "Japandi",
        "Boho",
        "Luxury",
        "Scandinavian",
    ];

    function handleImage(e) {
        const file = e.target.files[0];

        if (file) {
            setImageFile(file);
            setImage(URL.createObjectURL(file));
        }
    }

    function continueDesign() {
        onContinue({
            image,
            imageFile,
            style,
            budget,
        });
    }

    return (
        <div className="min-h-screen bg-[#f7f5f0] px-6 py-10">

            <div className="mx-auto max-w-4xl">

                <h1 className="text-4xl font-semibold">
                    Design your room
                </h1>

                <p className="mt-2 text-gray-500">
                    Tell Roomora about your space.
                </p>

                {/* Upload */}
                <div className="mt-10">

                    <h2 className="mb-3 font-medium">
                        Upload your room
                    </h2>

                    <label className="flex min-h-64 cursor-pointer items-center justify-center overflow-hidden rounded-3xl border-2 border-dashed border-gray-300 bg-white">

                        {image ? (
                            <img
                                src={image}
                                alt="Uploaded room"
                                className="h-80 w-full object-cover"
                            />
                        ) : (
                            <div className="text-center text-gray-400">
                                <p className="text-lg">
                                    Click to upload a room photo
                                </p>
                                <p className="mt-1 text-sm">
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

                </div>

                {/* Style */}
                <div className="mt-10">

                    <h2 className="mb-4 font-medium">
                        Choose your style
                    </h2>

                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">

                        {styles.map((item) => (
                            <button
                                key={item}
                                onClick={() => setStyle(item)}
                                className={`rounded-xl border px-4 py-4 text-sm ${style === item
                                        ? "border-[#20201e] bg-[#20201e] text-white"
                                        : "border-gray-300 bg-white"
                                    }`}
                            >
                                {item}
                            </button>
                        ))}

                    </div>

                </div>

                {/* Budget */}
                <div className="mt-10">

                    <h2 className="mb-3 font-medium">
                        What's your budget?
                    </h2>

                    <input
                        type="number"
                        value={budget}
                        onChange={(e) => setBudget(e.target.value)}
                        placeholder="Example: 20000"
                        className="w-full rounded-xl border border-gray-300 bg-white px-4 py-4 outline-none"
                    />

                </div>

                {/* Continue */}
                <button
                    onClick={continueDesign}
                    className="mt-10 w-full rounded-xl bg-[#20201e] px-6 py-4 text-sm text-white"
                >
                    Continue →
                </button>

            </div>

        </div>
    );
}

export default Design;