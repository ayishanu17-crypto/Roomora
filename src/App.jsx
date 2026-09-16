import { useState } from "react";
import Design from "./Design";
import Designer from "./Designer";
import Auth from "./Auth";

function App() {
  const [designing, setDesigning] = useState(false);
  const [designerData, setDesignerData] = useState(null);
  const [selectedStyle, setSelectedStyle] = useState("Modern");
  const [showDesigns, setShowDesigns] = useState(false);
  const [showAllStyles, setShowAllStyles] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showExplore, setShowExplore] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const [savedDesigns, setSavedDesigns] = useState(() => {
    const saved = localStorage.getItem("roomoraDesigns");
    return saved ? JSON.parse(saved) : [];
  });

  function saveDesign(design) {
    const newDesign = {
      id: Date.now(),
      image: design.image,
      style: design.style,
      budget: design.budget,
      createdAt: new Date().toLocaleDateString(),
    };

    const updatedDesigns = [newDesign, ...savedDesigns];

    setSavedDesigns(updatedDesigns);

    localStorage.setItem(
      "roomoraDesigns",
      JSON.stringify(updatedDesigns)
    );

    alert("Design saved successfully!");
  }

  function deleteDesign(id) {
    const updatedDesigns = savedDesigns.filter(
      (design) => design.id !== id
    );

    setSavedDesigns(updatedDesigns);

    localStorage.setItem(
      "roomoraDesigns",
      JSON.stringify(updatedDesigns)
    );
  }

  function goHome() {
    setShowDesigns(false);
    setShowAllStyles(false);
    setShowShop(false);
    setShowExplore(false);
    setShowAuth(false);
    setDesigning(false);
    setDesignerData(null);
  }

  function chooseStyle(style) {
    setSelectedStyle(style);
    setShowAllStyles(false);
    setShowShop(false);
    setShowExplore(false);
    setShowDesigns(false);
    setShowAuth(false);
    setDesigning(true);
    setDesignerData(null);
  }

  function openShop() {
    setShowShop(true);
    setShowAllStyles(false);
    setShowDesigns(false);
    setShowExplore(false);
    setShowAuth(false);
    setDesigning(false);
    setDesignerData(null);
  }

  function openExplore() {
    setShowExplore(true);
    setShowShop(false);
    setShowAllStyles(false);
    setShowDesigns(false);
    setShowAuth(false);
    setDesigning(false);
    setDesignerData(null);
  }

  function openDesigns() {
    setShowDesigns(true);
    setShowShop(false);
    setShowExplore(false);
    setShowAllStyles(false);
    setShowAuth(false);
    setDesigning(false);
    setDesignerData(null);
  }

  function openAuth() {
    setShowAuth(true);
    setShowShop(false);
    setShowExplore(false);
    setShowAllStyles(false);
    setShowDesigns(false);
    setDesigning(false);
    setDesignerData(null);
  }

  function startDesigning() {
    setSelectedStyle("Modern");
    setShowDesigns(false);
    setShowAllStyles(false);
    setShowShop(false);
    setShowExplore(false);
    setShowAuth(false);
    setDesignerData(null);
    setDesigning(true);
  }

  // -------------------------
  // AUTH PAGE
  // -------------------------

  if (showAuth) {
    return (
      <div className="page-enter">
        <Auth onBack={() => setShowAuth(false)} />
      </div>
    );
  }

  // -------------------------
  // EXPLORE PAGE
  // -------------------------

  if (showExplore) {
    return (
      <div className="page-enter">
        <ExplorePage
          onBack={goHome}
          onChooseStyle={chooseStyle}
        />
      </div>
    );
  }

  // -------------------------
  // ALL STYLES PAGE
  // -------------------------

  if (showAllStyles) {
    const styles = [
      {
        name: "Modern",
        image:
          "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=900&q=85",
        description:
          "Clean lines, elegant finishes and contemporary comfort.",
      },
      {
        name: "Minimal",
        image:
          "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=900&q=85",
        description:
          "Simple, calm and clutter-free spaces.",
      },
      {
        name: "Japandi",
        image:
          "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=900&q=85",
        description:
          "Japanese simplicity meets Scandinavian warmth.",
      },
      {
        name: "Scandinavian",
        image:
          "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=900&q=85",
        description:
          "Bright, cozy and functional Nordic-inspired interiors.",
      },
      {
        name: "Boho",
        image:
          "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=900&q=85",
        description:
          "Layered textures, natural materials and artistic details.",
      },
      {
        name: "Luxury",
        image:
          "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85",
        description:
          "Sophisticated materials, statement pieces and elegance.",
      },
      {
        name: "Industrial",
        image:
          "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?auto=format&fit=crop&w=900&q=85",
        description:
          "Raw materials, exposed textures and urban character.",
      },
      {
        name: "Contemporary",
        image:
          "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85",
        description:
          "Current trends balanced with timeless design.",
      },
      {
        name: "Rustic",
        image:
          "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?auto=format&fit=crop&w=900&q=85",
        description:
          "Natural textures, earthy colors and cozy character.",
      },
      {
        name: "Mid-Century Modern",
        image:
          "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=900&q=85",
        description:
          "Classic furniture, organic shapes and retro-modern charm.",
      },
      {
        name: "Dark Academia",
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=85",
        description:
          "Moody colors, vintage details and scholarly atmosphere.",
      },
      {
        name: "Biophilic",
        image:
          "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=900&q=85",
        description:
          "Greenery, natural light and a connection with nature.",
      },
    ];

    return (
      <div className="page-enter min-h-screen bg-[#f7f5f0]">
        <header className="border-b border-[#dedbd4] px-5 py-5 sm:px-6 md:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <button
              onClick={goHome}
              className="text-2xl font-semibold tracking-tight transition hover:opacity-70"
            >
              roomora<span className="text-[#9b8b72]">.</span>
            </button>

            <button
              onClick={startDesigning}
              className="roomora-button rounded-full bg-[#20201e] px-5 py-2.5 text-sm text-white"
            >
              Start designing
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:px-10 md:py-16">
          <button
            onClick={goHome}
            className="mb-8 text-sm text-gray-500 transition hover:text-[#20201e]"
          >
            ← Back to home
          </button>

          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-[0.2em] text-[#9b8b72]">
              Roomora Styles
            </p>

            <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-6xl">
              Find a style that feels like you.
            </h1>

            <p className="mt-5 text-base leading-7 text-gray-500 md:text-lg">
              Explore different interior styles and choose the one
              you'd like Roomora to create for your space.
            </p>
          </div>

          <div className="mt-12 grid gap-x-5 gap-y-10 sm:grid-cols-2 lg:mt-14 lg:grid-cols-3">
            {styles.map((style) => (
              <button
                key={style.name}
                onClick={() => chooseStyle(style.name)}
                className="group roomora-card rounded-[2rem] text-left"
              >
                <div className="image-zoom overflow-hidden rounded-[2rem] bg-white">
                  <img
                    src={style.image}
                    alt={style.name}
                    className="h-[320px] w-full object-cover sm:h-[360px]"
                  />
                </div>

                <div className="mt-5 flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-medium">
                      {style.name}
                    </h2>

                    <p className="mt-2 max-w-sm text-sm leading-6 text-gray-500">
                      {style.description}
                    </p>
                  </div>

                  <span className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#d8d3ca] text-sm transition duration-300 group-hover:border-[#20201e] group-hover:bg-[#20201e] group-hover:text-white">
                    →
                  </span>
                </div>
              </button>
            ))}
          </div>
        </main>

        <SiteFooter
          onHome={goHome}
          onExplore={openExplore}
          onDesigns={openDesigns}
          onStyles={() => setShowAllStyles(true)}
          onShop={openShop}
          onHow={() => goHome()}
        />
      </div>
    );
  }

  // -------------------------
  // SHOP PAGE
  // -------------------------

  if (showShop) {
    return (
      <div className="page-enter">
        <ShopPage
          onBack={goHome}
          onStartDesigning={startDesigning}
          onExplore={openExplore}
        />
      </div>
    );
  }

  // -------------------------
  // MY DESIGNS PAGE
  // -------------------------

  if (showDesigns) {
    return (
      <div className="page-enter min-h-screen bg-[#f7f5f0]">
        <header className="border-b border-[#dedbd4] px-5 py-5 sm:px-6 md:px-10">
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <button
              onClick={goHome}
              className="text-2xl font-semibold tracking-tight transition hover:opacity-70"
            >
              roomora<span className="text-[#9b8b72]">.</span>
            </button>

            <button
              onClick={startDesigning}
              className="roomora-button rounded-full bg-[#20201e] px-5 py-2.5 text-sm text-white"
            >
              + New design
            </button>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:px-10 md:py-16">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#9b8b72]">
              Your collection
            </p>

            <h1 className="mt-3 text-4xl font-medium tracking-tight md:text-5xl">
              My Designs
            </h1>

            <p className="mt-4 max-w-xl text-gray-500">
              Your saved Roomora designs, all in one place.
            </p>
          </div>

          {savedDesigns.length === 0 ? (
            <div className="roomora-card mt-14 rounded-[2rem] border border-[#dedbd4] bg-white px-6 py-20 text-center md:mt-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f1eee8] text-2xl">
                +
              </div>

              <h2 className="mt-6 text-2xl font-medium">
                No designs yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
                Start designing your room and save your favorite
                ideas here.
              </p>

              <button
                onClick={startDesigning}
                className="roomora-button mt-7 rounded-full bg-[#20201e] px-7 py-3.5 text-sm text-white"
              >
                Create your first design →
              </button>
            </div>
          ) : (
            <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
              {savedDesigns.map((design) => (
                <div
                  key={design.id}
                  className="roomora-card overflow-hidden rounded-[2rem] bg-white"
                >
                  <div className="image-zoom relative overflow-hidden">
                    <img
                      src={design.image}
                      alt={`${design.style} room`}
                      className="h-72 w-full object-cover md:h-80"
                    />

                    <button
                      onClick={() => deleteDesign(design.id)}
                      className="absolute right-4 top-4 rounded-full bg-white/90 px-4 py-2 text-xs text-gray-600 backdrop-blur transition hover:bg-white hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>

                  <div className="p-6">
                    <p className="text-xs uppercase tracking-[0.15em] text-[#9b8b72]">
                      {design.style}
                    </p>

                    <h3 className="mt-2 text-xl font-medium">
                      {design.style} Room
                    </h3>

                    <div className="mt-4 flex flex-col gap-2 text-sm text-gray-500 sm:flex-row sm:items-center sm:justify-between">
                      <span>
                        Budget: ₹{design.budget || "Not set"}
                      </span>

                      <span>{design.createdAt}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <SiteFooter
          onHome={goHome}
          onExplore={openExplore}
          onDesigns={openDesigns}
          onStyles={() => setShowAllStyles(true)}
          onShop={openShop}
          onHow={() => {
            goHome();
            setTimeout(() => {
              document
                .getElementById("how")
                ?.scrollIntoView({ behavior: "smooth" });
            }, 50);
          }}
        />
      </div>
    );
  }

  // -------------------------
  // AI DESIGNER
  // -------------------------

  if (designerData) {
    return (
      <div className="page-enter">
        <Designer
          image={designerData.image}
          imageFile={designerData.imageFile}
          style={designerData.style}
          budget={designerData.budget}
          onSave={(design) => saveDesign(design)}
          onBack={() => setDesignerData(null)}
        />
      </div>
    );
  }

  // -------------------------
  // DESIGN SETUP
  // -------------------------

  if (designing) {
    return (
      <div className="page-enter">
        <Design
          selectedStyle={selectedStyle}
          onContinue={(data) => setDesignerData(data)}
        />
      </div>
    );
  }

  // -------------------------
  // HOMEPAGE
  // -------------------------

  return (
    <div className="page-enter min-h-screen bg-[#f7f5f0]">
      {/* Navbar */}

      <nav className="flex items-center justify-between gap-5 px-5 py-5 sm:px-6 md:px-16 md:py-6">
        <button
          onClick={goHome}
          className="text-2xl font-semibold tracking-tight transition hover:opacity-70"
        >
          roomora<span className="text-[#9b8b72]">.</span>
        </button>

        <div className="hidden items-center gap-8 text-sm md:flex">
          <button
            onClick={openExplore}
            className="transition hover:text-[#9b8b72]"
          >
            Explore
          </button>

          <a
            href="#how"
            className="transition hover:text-[#9b8b72]"
          >
            How it works
          </a>

          <a
            href="#designs"
            className="transition hover:text-[#9b8b72]"
          >
            Designs
          </a>

          <button
            onClick={openShop}
            className="transition hover:text-[#9b8b72]"
          >
            Shop
          </button>
        </div>

        {/* Auth + Start designing */}

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={openAuth}
            className="roomora-button rounded-full border border-[#d8d3ca] bg-white px-4 py-2.5 text-sm font-medium sm:px-5"
          >
            Log in
          </button>

          <button
            onClick={startDesigning}
            className="roomora-button rounded-full bg-[#20201e] px-4 py-2.5 text-sm text-white sm:px-5"
          >
            Start designing
          </button>
        </div>
      </nav>

      {/* Hero */}

      <section className="px-5 pb-20 pt-10 sm:px-6 md:px-16 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid items-center gap-12 md:grid-cols-2 md:gap-16">
            <div>
              <p className="mb-5 text-sm uppercase tracking-[0.25em] text-[#9b8b72]">
                AI powered interior design
              </p>

              <h2 className="max-w-xl text-5xl font-medium leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
                Transform your space.
                <br />
                <span className="text-[#9b8b72]">
                  Your way.
                </span>
              </h2>

              <p className="mt-7 max-w-md text-base leading-7 text-gray-600 md:text-lg md:leading-8">
                Design your room with AI, discover your style,
                and find pieces that make your space feel like you.
              </p>

              <div className="mt-9 flex flex-wrap gap-3 sm:gap-4">
                <button
                  onClick={startDesigning}
                  className="roomora-button rounded-full bg-[#20201e] px-6 py-3.5 text-sm text-white sm:px-7"
                >
                  Start designing →
                </button>

                <button
                  onClick={openDesigns}
                  className="roomora-button rounded-full border border-gray-300 px-6 py-3.5 text-sm sm:px-7"
                >
                  My designs
                </button>
              </div>
            </div>

            {/* Hero Image */}

            <div className="relative">
              <div className="image-zoom overflow-hidden rounded-[2rem]">
                <img
                  src="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85"
                  alt="Modern interior"
                  className="h-[430px] w-full object-cover sm:h-[500px] md:h-[520px]"
                />
              </div>

              <div className="absolute bottom-5 left-5 rounded-2xl bg-white/90 p-4 shadow-lg backdrop-blur sm:bottom-6 sm:left-6 sm:p-5">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Roomora AI
                </p>

                <p className="mt-1 text-sm font-medium">
                  Modern · Warm · Minimal
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}

      <section
        id="how"
        className="bg-[#20201e] px-5 py-20 text-white sm:px-6 md:px-16 md:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <p className="text-sm uppercase tracking-[0.25em] text-gray-400">
            Simple by design
          </p>

          <h2 className="mt-4 max-w-xl text-4xl font-medium md:text-5xl">
            From empty room to a space you love.
          </h2>

          <div className="mt-12 grid gap-5 md:mt-16 md:grid-cols-3">
            <Step number="01" title="Show us your room">
              Upload a photo of your room and tell Roomora
              what you want to change.
            </Step>

            <Step number="02" title="Chat with Roomora">
              Talk naturally with your AI designer about
              colors, layouts, furniture and your budget.
            </Step>

            <Step number="03" title="Make it yours">
              Discover furniture and decor that fit your
              style and your budget.
            </Step>
          </div>
        </div>
      </section>

      {/* Featured Styles */}

      <section
        id="designs"
        className="px-5 py-20 sm:px-6 md:px-16 md:py-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#9b8b72]">
                Find your style
              </p>

              <h2 className="mt-3 text-4xl font-medium md:text-5xl">
                What feels like you?
              </h2>
            </div>

            <button
              onClick={() => setShowAllStyles(true)}
              className="w-fit text-sm underline underline-offset-4 transition hover:text-[#9b8b72]"
            >
              Explore all styles →
            </button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            <StyleCard
              image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=700&q=80"
              title="Minimal"
              onClick={() => chooseStyle("Minimal")}
            />

            <StyleCard
              image="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=80"
              title="Japandi"
              onClick={() => chooseStyle("Japandi")}
            />

            <StyleCard
              image="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&q=80"
              title="Modern"
              onClick={() => chooseStyle("Modern")}
            />

            <StyleCard
              image="https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=700&q=80"
              title="Warm"
              onClick={() => chooseStyle("Warm")}
            />
          </div>
        </div>
      </section>

      {/* AI CTA */}

      <section className="px-5 pb-20 sm:px-6 md:px-16 md:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#e8e2d7] p-7 sm:p-8 md:p-16">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.25em] text-[#8d7d65]">
              Meet your AI designer
            </p>

            <h2 className="mt-4 text-4xl font-medium md:text-6xl">
              Not sure where to start?
            </h2>

            <p className="mt-6 text-base leading-7 text-gray-600 md:text-lg md:leading-8">
              Tell Roomora what you're imagining.
              We'll help you turn the idea into a space.
            </p>

            <button
              onClick={startDesigning}
              className="roomora-button mt-8 rounded-full bg-[#20201e] px-7 py-3.5 text-sm text-white"
            >
              Chat with Roomora →
            </button>
          </div>
        </div>
      </section>

      {/* Shop */}

      <section
        id="shop"
        className="px-5 pb-20 sm:px-6 md:px-16 md:pb-24"
      >
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#9b8b72]">
                Shop your style
              </p>

              <h2 className="mt-3 text-4xl font-medium md:text-5xl">
                Pieces for your space.
              </h2>

              <p className="mt-4 max-w-xl text-base leading-7 text-gray-500">
                Discover furniture and decor ideas that can bring
                your Roomora design to life.
              </p>
            </div>

            <button
              onClick={openShop}
              className="w-fit text-sm underline underline-offset-4 transition hover:text-[#9b8b72]"
            >
              View all products →
            </button>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4">
            <ShopCard
              image="https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=700&q=80"
              category="Furniture"
              title="Lounge Chair"
              price="₹8,999"
              onClick={openShop}
            />

            <ShopCard
              image="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=700&q=80"
              category="Lighting"
              title="Modern Lamp"
              price="₹2,499"
              onClick={openShop}
            />

            <ShopCard
              image="https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=700&q=80"
              category="Decor"
              title="Minimal Workspace"
              price="₹6,499"
              onClick={openShop}
            />

            <ShopCard
              image="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=700&q=80"
              category="Furniture"
              title="Accent Table"
              price="₹4,299"
              onClick={openShop}
            />
          </div>
        </div>
      </section>

      {/* Footer */}

      <SiteFooter
        onHome={goHome}
        onExplore={openExplore}
        onDesigns={openDesigns}
        onStyles={() => setShowAllStyles(true)}
        onShop={openShop}
        onHow={() => {
          document
            .getElementById("how")
            ?.scrollIntoView({ behavior: "smooth" });
        }}
      />
    </div>
  );
}

// -------------------------
// EXPLORE / INSPIRATION PAGE
// -------------------------

function ExplorePage({ onBack, onChooseStyle }) {
  const [styleFilter, setStyleFilter] = useState("All");
  const [roomFilter, setRoomFilter] = useState("All");

  const inspirations = [
    {
      id: 1,
      style: "Modern",
      room: "Living Room",
      title: "Warm Modern Living",
      description:
        "Clean architecture, soft neutrals and comfortable statement furniture.",
      image:
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 2,
      style: "Japandi",
      room: "Bedroom",
      title: "Calm Japandi Bedroom",
      description:
        "Natural wood, soft textures and a quiet palette for a peaceful room.",
      image:
        "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 3,
      style: "Minimal",
      room: "Workspace",
      title: "Minimal Work Corner",
      description:
        "A focused workspace with simple furniture and plenty of breathing room.",
      image:
        "https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 4,
      style: "Boho",
      room: "Living Room",
      title: "Soft Boho Living",
      description:
        "Layered textiles, earthy tones and natural materials create a relaxed feel.",
      image:
        "https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 5,
      style: "Luxury",
      room: "Bedroom",
      title: "Quiet Luxury Bedroom",
      description:
        "Elegant materials, warm lighting and refined details without feeling excessive.",
      image:
        "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 6,
      style: "Scandinavian",
      room: "Dining Room",
      title: "Scandinavian Dining",
      description:
        "Bright interiors, natural finishes and functional pieces made for everyday life.",
      image:
        "https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 7,
      style: "Industrial",
      room: "Workspace",
      title: "Industrial Creative Studio",
      description:
        "Raw textures, dark accents and practical furniture with urban character.",
      image:
        "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=85",
    },
    {
      id: 8,
      style: "Biophilic",
      room: "Living Room",
      title: "Biophilic Retreat",
      description:
        "Bring nature indoors with greenery, natural light and organic textures.",
      image:
        "https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=1200&q=85",
    },
  ];

  const styles = [
    "All",
    "Modern",
    "Minimal",
    "Japandi",
    "Boho",
    "Luxury",
    "Scandinavian",
    "Industrial",
    "Biophilic",
  ];

  const rooms = [
    "All",
    "Living Room",
    "Bedroom",
    "Workspace",
    "Dining Room",
  ];

  const filteredInspirations = inspirations.filter((item) => {
    const matchesStyle =
      styleFilter === "All" || item.style === styleFilter;

    const matchesRoom =
      roomFilter === "All" || item.room === roomFilter;

    return matchesStyle && matchesRoom;
  });

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      {/* Header */}

      <header className="border-b border-[#dedbd4] px-5 py-5 sm:px-6 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="text-2xl font-semibold tracking-tight transition hover:opacity-70"
          >
            roomora<span className="text-[#9b8b72]">.</span>
          </button>

          <button
            onClick={() => onChooseStyle("Modern")}
            className="roomora-button rounded-full bg-[#20201e] px-5 py-2.5 text-sm text-white"
          >
            Start designing
          </button>
        </div>
      </header>

      {/* Hero */}

      <section className="px-5 pb-14 pt-12 sm:px-6 md:px-10 md:pb-20 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <button
            onClick={onBack}
            className="mb-8 text-sm text-gray-500 transition hover:text-[#20201e]"
          >
            ← Back to home
          </button>

          <p className="text-xs uppercase tracking-[0.25em] text-[#9b8b72]">
            Roomora Explore
          </p>

          <h1 className="mt-4 max-w-4xl text-5xl font-medium leading-tight tracking-tight sm:text-6xl md:text-7xl">
            Find a room that feels like you.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-500 md:text-lg">
            Browse interior inspiration, discover new styles and
            find ideas you can bring into your own space.
          </p>
        </div>
      </section>

      {/* Filters */}

      <section className="border-y border-[#dedbd4] bg-[#f3f0ea] px-5 py-5 sm:px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="min-w-0">
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-gray-400">
                Style
              </p>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {styles.map((style) => (
                  <button
                    key={style}
                    onClick={() => setStyleFilter(style)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                      styleFilter === style
                        ? "bg-[#20201e] text-white"
                        : "border border-[#d8d3ca] bg-white text-gray-600 hover:bg-[#ece8e0]"
                    }`}
                  >
                    {style}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-gray-400">
                Room
              </p>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {rooms.map((room) => (
                  <button
                    key={room}
                    onClick={() => setRoomFilter(room)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                      roomFilter === room
                        ? "bg-[#20201e] text-white"
                        : "border border-[#d8d3ca] bg-white text-gray-600 hover:bg-[#ece8e0]"
                    }`}
                  >
                    {room}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Inspiration Gallery */}

      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:px-10 md:py-20">
        <div className="mb-10">
          <p className="text-sm text-gray-500">
            {filteredInspirations.length} inspirations
          </p>

          <h2 className="mt-2 text-3xl font-medium md:text-4xl">
            Inspiration for your next room
          </h2>
        </div>

        {filteredInspirations.length === 0 ? (
          <div className="roomora-card rounded-[2rem] border border-[#dedbd4] bg-white px-6 py-20 text-center">
            <h2 className="text-2xl font-medium">
              No inspiration found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              Try another style or room type.
            </p>

            <button
              onClick={() => {
                setStyleFilter("All");
                setRoomFilter("All");
              }}
              className="roomora-button mt-7 rounded-full bg-[#20201e] px-6 py-3 text-sm text-white"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-14 md:grid-cols-2">
            {filteredInspirations.map((item) => (
              <div key={item.id} className="group">
                <div className="image-zoom relative overflow-hidden rounded-[2rem] bg-white">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="h-[380px] w-full object-cover sm:h-[450px] md:h-[500px]"
                  />

                  <div className="absolute left-5 top-5">
                    <span className="rounded-full bg-white/90 px-4 py-2 text-xs text-gray-600 backdrop-blur">
                      {item.style}
                    </span>
                  </div>
                </div>

                <div className="mt-5">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.15em] text-[#9b8b72]">
                        {item.room}
                      </p>

                      <h3 className="mt-2 text-2xl font-medium">
                        {item.title}
                      </h3>

                      <p className="mt-2 max-w-lg text-sm leading-6 text-gray-500">
                        {item.description}
                      </p>
                    </div>

                    <button
                      onClick={() => onChooseStyle(item.style)}
                      className="roomora-button shrink-0 self-start rounded-full bg-[#20201e] px-5 py-3 text-xs text-white"
                    >
                      Create this style →
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* CTA */}

      <section className="px-5 pb-20 sm:px-6 md:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#e8e2d7] px-7 py-14 sm:px-8 md:px-16 md:py-20">
          <p className="text-xs uppercase tracking-[0.25em] text-[#8d7d65]">
            Your room. Your style.
          </p>

          <h2 className="mt-4 max-w-2xl text-4xl font-medium md:text-6xl">
            Found something you love?
          </h2>

          <p className="mt-5 max-w-xl text-base leading-7 text-gray-600">
            Upload your own room and let Roomora help you bring
            the inspiration to life.
          </p>

          <button
            onClick={() =>
              onChooseStyle(
                styleFilter === "All" ? "Modern" : styleFilter
              )
            }
            className="roomora-button mt-8 rounded-full bg-[#20201e] px-7 py-3.5 text-sm text-white"
          >
            Start with this inspiration →
          </button>
        </div>
      </section>

      <SiteFooter
        onHome={onBack}
        onExplore={onBack}
        onDesigns={() => {}}
        onStyles={() => {}}
        onShop={() => {}}
        onHow={onBack}
      />
    </div>
  );
}

// -------------------------
// SHOP PAGE COMPONENT
// -------------------------

function ShopPage({ onBack, onStartDesigning }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [style, setStyle] = useState("All");

  const products = [
    {
      id: 1,
      name: "Lounge Chair",
      category: "Furniture",
      style: "Modern",
      price: 8999,
      image:
        "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 2,
      name: "Arc Floor Lamp",
      category: "Lighting",
      style: "Modern",
      price: 3499,
      image:
        "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 3,
      name: "Minimal Desk",
      category: "Furniture",
      style: "Minimal",
      price: 6499,
      image:
        "https://images.unsplash.com/photo-1494438639946-1ebd1d20bf85?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 4,
      name: "Accent Side Table",
      category: "Furniture",
      style: "Japandi",
      price: 4299,
      image:
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 5,
      name: "Ceramic Vase",
      category: "Decor",
      style: "Japandi",
      price: 1299,
      image:
        "https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 6,
      name: "Textured Rug",
      category: "Rugs",
      style: "Boho",
      price: 4599,
      image:
        "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 7,
      name: "Wall Art Set",
      category: "Wall Art",
      style: "Contemporary",
      price: 2199,
      image:
        "https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 8,
      name: "Wooden Storage Unit",
      category: "Storage",
      style: "Scandinavian",
      price: 7499,
      image:
        "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 9,
      name: "Boucle Sofa",
      category: "Furniture",
      style: "Luxury",
      price: 24999,
      image:
        "https://images.unsplash.com/photo-1550226891-ef816aed4a98?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 10,
      name: "Pendant Light",
      category: "Lighting",
      style: "Industrial",
      price: 2999,
      image:
        "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 11,
      name: "Indoor Plant",
      category: "Decor",
      style: "Biophilic",
      price: 899,
      image:
        "https://images.unsplash.com/photo-1485955900006-10f4d324d411?auto=format&fit=crop&w=900&q=85",
    },
    {
      id: 12,
      name: "Reading Chair",
      category: "Furniture",
      style: "Dark Academia",
      price: 9999,
      image:
        "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?auto=format&fit=crop&w=900&q=85",
    },
  ];

  const categories = [
    "All",
    "Furniture",
    "Lighting",
    "Decor",
    "Rugs",
    "Wall Art",
    "Storage",
  ];

  const styles = [
    "All",
    "Modern",
    "Minimal",
    "Japandi",
    "Scandinavian",
    "Boho",
    "Luxury",
    "Industrial",
    "Contemporary",
    "Biophilic",
    "Dark Academia",
  ];

  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || product.category === category;

    const matchesStyle =
      style === "All" || product.style === style;

    return matchesSearch && matchesCategory && matchesStyle;
  });

  return (
    <div className="min-h-screen bg-[#f7f5f0]">
      {/* Header */}

      <header className="border-b border-[#dedbd4] px-5 py-5 sm:px-6 md:px-10">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <button
            onClick={onBack}
            className="text-2xl font-semibold tracking-tight transition hover:opacity-70"
          >
            roomora<span className="text-[#9b8b72]">.</span>
          </button>

          <button
            onClick={onStartDesigning}
            className="roomora-button rounded-full bg-[#20201e] px-5 py-2.5 text-sm text-white"
          >
            Start designing
          </button>
        </div>
      </header>

      {/* Shop Hero */}

      <section className="px-5 pb-12 pt-12 sm:px-6 md:px-10 md:pb-16 md:pt-20">
        <div className="mx-auto max-w-7xl">
          <button
            onClick={onBack}
            className="mb-8 text-sm text-gray-500 transition hover:text-[#20201e]"
          >
            ← Back to home
          </button>

          <p className="text-xs uppercase tracking-[0.25em] text-[#9b8b72]">
            Roomora Shop
          </p>

          <h1 className="mt-4 max-w-3xl text-5xl font-medium leading-tight tracking-tight sm:text-6xl md:text-7xl">
            Pieces that make your space feel like you.
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-gray-500 md:text-lg">
            Explore furniture, lighting and decor selected to
            complement different interior styles.
          </p>

          {/* Search */}

          <div className="mt-10 max-w-2xl">
            <div className="flex items-center rounded-full border border-[#d8d3ca] bg-white px-5 py-4 transition focus-within:border-[#9b8b72]">
              <span className="mr-3 text-lg text-gray-400">
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search furniture, lighting, decor..."
                className="w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filters */}

      <section className="border-y border-[#dedbd4] bg-[#f3f0ea] px-5 py-5 sm:px-6 md:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-gray-400">
                Category
              </p>

              <div className="flex gap-2 overflow-x-auto pb-1">
                {categories.map((item) => (
                  <button
                    key={item}
                    onClick={() => setCategory(item)}
                    className={`whitespace-nowrap rounded-full px-4 py-2 text-sm transition ${
                      category === item
                        ? "bg-[#20201e] text-white"
                        : "border border-[#d8d3ca] bg-white text-gray-600 hover:bg-[#ece8e0]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.18em] text-gray-400">
                Style
              </p>

              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="rounded-full border border-[#d8d3ca] bg-white px-5 py-2.5 text-sm outline-none transition focus:border-[#9b8b72]"
              >
                {styles.map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All styles" : item}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Products */}

      <main className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:px-10 md:py-16">
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            {filteredProducts.length} products
          </p>

          <h2 className="mt-1 text-2xl font-medium">
            Discover your pieces
          </h2>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="roomora-card rounded-[2rem] border border-[#dedbd4] bg-white px-6 py-20 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f1eee8] text-2xl">
              ⌕
            </div>

            <h2 className="mt-6 text-2xl font-medium">
              No products found
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-gray-500">
              Try a different search term or remove one of
              the filters.
            </p>

            <button
              onClick={() => {
                setSearch("");
                setCategory("All");
                setStyle("All");
              }}
              className="roomora-button mt-7 rounded-full bg-[#20201e] px-6 py-3 text-sm text-white"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
              />
            ))}
          </div>
        )}
      </main>

      {/* Shop CTA */}

      <section className="px-5 pb-20 sm:px-6 md:px-10">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#20201e] px-7 py-14 text-white sm:px-8 md:px-16 md:py-20">
          <p className="text-xs uppercase tracking-[0.25em] text-gray-400">
            Design first
          </p>

          <h2 className="mt-4 max-w-2xl text-4xl font-medium md:text-6xl">
            Find pieces that belong in your room.
          </h2>

          <p className="mt-5 max-w-xl leading-7 text-gray-400">
            Start with your room, choose your style and let
            Roomora help you create a space around you.
          </p>

          <button
            onClick={onStartDesigning}
            className="roomora-button mt-8 rounded-full bg-white px-7 py-3.5 text-sm text-[#20201e]"
          >
            Start designing →
          </button>
        </div>
      </section>

      <SiteFooter
        onHome={onBack}
        onExplore={() => {}}
        onDesigns={() => {}}
        onStyles={() => {}}
        onShop={onBack}
        onHow={onBack}
      />
    </div>
  );
}

// -------------------------
// PRODUCT CARD
// -------------------------

function ProductCard({ product }) {
  function handleProductClick() {
    alert(
      `${product.name}\n\n${product.style} style\n₹${product.price.toLocaleString(
        "en-IN"
      )}\n\nProduct links will be connected later.`
    );
  }

  return (
    <div className="group">
      <div className="image-zoom relative overflow-hidden rounded-[1.75rem] bg-white">
        <img
          src={product.image}
          alt={product.name}
          className="h-[320px] w-full object-cover sm:h-[360px]"
        />

        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs text-gray-600 backdrop-blur">
            {product.style}
          </span>
        </div>
      </div>

      <div className="mt-5">
        <p className="text-xs uppercase tracking-[0.15em] text-[#9b8b72]">
          {product.category}
        </p>

        <div className="mt-2 flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-medium">
              {product.name}
            </h3>

            <p className="mt-1 text-sm text-gray-500">
              ₹{product.price.toLocaleString("en-IN")}
            </p>
          </div>

          <button
            onClick={handleProductClick}
            className="roomora-button rounded-full border border-[#d8d3ca] px-4 py-2 text-xs"
          >
            View product
          </button>
        </div>
      </div>
    </div>
  );
}

// -------------------------
// STEP COMPONENT
// -------------------------

function Step({ number, title, children }) {
  return (
    <div className="roomora-card rounded-3xl border border-white/10 p-7 md:p-8">
      <span className="text-sm text-gray-500">
        {number}
      </span>

      <h3 className="mt-10 text-2xl md:mt-12">
        {title}
      </h3>

      <p className="mt-4 leading-7 text-gray-400">
        {children}
      </p>
    </div>
  );
}

// -------------------------
// STYLE CARD
// -------------------------

function StyleCard({ image, title, onClick }) {
  return (
    <button
      onClick={onClick}
      className="roomora-card group w-full text-left"
    >
      <div className="image-zoom overflow-hidden rounded-3xl">
        <img
          src={image}
          alt={title}
          className="h-72 w-full object-cover sm:h-80"
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-lg">{title}</p>

        <span className="flex h-8 w-8 items-center justify-center rounded-full border border-[#d8d3ca] text-sm transition group-hover:bg-[#20201e] group-hover:text-white">
          →
        </span>
      </div>
    </button>
  );
}

// -------------------------
// HOMEPAGE SHOP CARD
// -------------------------

function ShopCard({
  image,
  category,
  title,
  price,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className="roomora-card group w-full text-left"
    >
      <div className="image-zoom overflow-hidden rounded-3xl bg-white">
        <img
          src={image}
          alt={title}
          className="h-72 w-full object-cover sm:h-80"
        />
      </div>

      <p className="mt-4 text-xs uppercase tracking-[0.15em] text-[#9b8b72]">
        {category}
      </p>

      <div className="mt-1 flex items-center justify-between gap-3">
        <p className="text-lg">{title}</p>

        <p className="text-sm text-gray-500">
          {price}
        </p>
      </div>
    </button>
  );
}

// -------------------------
// FOOTER
// -------------------------

function SiteFooter({
  onHome,
  onExplore,
  onDesigns,
  onStyles,
  onShop,
  onHow,
}) {
  return (
    <footer className="border-t border-[#e4dfd7] bg-[#efede7]">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:px-10 md:py-14">
        <div className="grid gap-10 md:grid-cols-4 md:gap-12">
          {/* Brand */}

          <div className="md:col-span-2">
            <button
              onClick={onHome}
              className="text-2xl font-semibold tracking-tight transition hover:opacity-70"
            >
              roomora<span className="text-[#9b8b72]">.</span>
            </button>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#777269]">
              Transform your space with AI-powered interior design,
              personalized ideas, and inspiration made for you.
            </p>

            <p className="mt-6 text-sm font-medium text-[#9b8b72]">
              Transform your space. Your way.
            </p>
          </div>

          {/* Explore */}

          <div>
            <h3 className="text-sm font-semibold text-[#24231f]">
              Explore
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-[#777269]">
              <button
                onClick={onHome}
                className="w-fit transition hover:text-[#24231f]"
              >
                Home
              </button>

              <button
                onClick={onExplore}
                className="w-fit transition hover:text-[#24231f]"
              >
                Designs
              </button>

              <button
                onClick={onStyles}
                className="w-fit transition hover:text-[#24231f]"
              >
                Styles
              </button>

              <button
                onClick={onShop}
                className="w-fit transition hover:text-[#24231f]"
              >
                Shop
              </button>
            </div>
          </div>

          {/* Roomora */}

          <div>
            <h3 className="text-sm font-semibold text-[#24231f]">
              Roomora
            </h3>

            <div className="mt-5 flex flex-col gap-3 text-sm text-[#777269]">
              <button
                onClick={onHow}
                className="w-fit transition hover:text-[#24231f]"
              >
                How it works
              </button>

              <button
                onClick={onHome}
                className="w-fit transition hover:text-[#24231f]"
              >
                About
              </button>

              <button
                onClick={() =>
                  alert("Contact page will be connected later.")
                }
                className="w-fit transition hover:text-[#24231f]"
              >
                Contact
              </button>

              <button
                onClick={() =>
                  alert("Privacy page will be connected later.")
                }
                className="w-fit transition hover:text-[#24231f]"
              >
                Privacy
              </button>
            </div>
          </div>
        </div>

        {/* Bottom */}

        <div className="mt-12 flex flex-col gap-3 border-t border-[#ddd8cf] pt-6 text-xs text-[#8a847b] sm:flex-row sm:items-center sm:justify-between md:mt-14">
          <p>
            © {new Date().getFullYear()} Roomora. All rights reserved.
          </p>

          <p>Designed for better spaces.</p>
        </div>
      </div>
    </footer>
  );
}

export default App;