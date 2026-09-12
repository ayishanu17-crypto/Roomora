import { useState } from "react";
import Design from "./Design";
import Designer from "./Designer";

function App() {
  const [designing, setDesigning] = useState(false);
  const [designerData, setDesignerData] = useState(null);

  // Open the AI designer after completing the design setup
  if (designerData) {
    return (
      <Designer
        image={designerData.image}
        style={designerData.style}
        budget={designerData.budget}
      />
    );
  }

  // Open the design setup page
  if (designing) {
    return (
      <Design
        onContinue={(data) => setDesignerData(data)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#f7f5f0]">

      {/* Navbar */}
      <nav className="flex items-center justify-between px-8 py-6 md:px-16">

        <h1 className="text-2xl font-semibold tracking-tight">
          roomora<span className="text-[#9b8b72]">.</span>
        </h1>

        <div className="hidden gap-8 text-sm md:flex">

          <a href="#explore" className="hover:text-[#9b8b72]">
            Explore
          </a>

          <a href="#how" className="hover:text-[#9b8b72]">
            How it works
          </a>

          <a href="#designs" className="hover:text-[#9b8b72]">
            Designs
          </a>

          <a href="#shop" className="hover:text-[#9b8b72]">
            Shop
          </a>

        </div>

        <button
          onClick={() => setDesigning(true)}
          className="rounded-full bg-[#20201e] px-5 py-2.5 text-sm text-white hover:bg-[#363632]"
        >
          Start designing
        </button>

      </nav>


      {/* Hero */}
      <section className="px-6 pb-20 pt-12 md:px-16 md:pt-20">

        <div className="mx-auto max-w-7xl">

          <div className="grid items-center gap-12 md:grid-cols-2">

            <div>

              <p className="mb-5 text-sm uppercase tracking-[0.25em] text-[#9b8b72]">
                AI powered interior design
              </p>

              <h2 className="max-w-xl text-5xl font-medium leading-[1.05] tracking-tight md:text-7xl">
                Your space,
                <br />
                reimagined.
              </h2>

              <p className="mt-7 max-w-md text-lg leading-8 text-gray-600">
                Design your room with AI, discover your style,
                and find pieces that make your space feel like you.
              </p>

              <div className="mt-9 flex flex-wrap gap-4">

                <button
                  onClick={() => setDesigning(true)}
                  className="rounded-full bg-[#20201e] px-7 py-3.5 text-sm text-white transition hover:-translate-y-1"
                >
                  Start designing →
                </button>

                <a
                  href="#designs"
                  className="rounded-full border border-gray-300 px-7 py-3.5 text-sm transition hover:bg-white"
                >
                  Explore designs
                </a>

              </div>

            </div>


            {/* Hero Image */}
            <div className="relative">

              <div className="overflow-hidden rounded-[2rem]">

                <img
                  src="https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85"
                  alt="Modern interior"
                  className="h-[520px] w-full object-cover transition duration-700 hover:scale-105"
                />

              </div>

              <div className="absolute bottom-6 left-6 rounded-2xl bg-white/90 p-5 shadow-lg backdrop-blur">

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
        className="bg-[#20201e] px-6 py-24 text-white md:px-16"
      >

        <div className="mx-auto max-w-7xl">

          <p className="text-sm uppercase tracking-[0.25em] text-gray-400">
            Simple by design
          </p>

          <h2 className="mt-4 max-w-xl text-4xl font-medium md:text-5xl">
            From empty room to a space you love.
          </h2>


          <div className="mt-16 grid gap-6 md:grid-cols-3">

            <div className="rounded-3xl border border-white/10 p-8">

              <span className="text-sm text-gray-500">
                01
              </span>

              <h3 className="mt-12 text-2xl">
                Show us your room
              </h3>

              <p className="mt-4 leading-7 text-gray-400">
                Upload a photo of your room and tell Roomora
                what you want to change.
              </p>

            </div>


            <div className="rounded-3xl border border-white/10 p-8">

              <span className="text-sm text-gray-500">
                02
              </span>

              <h3 className="mt-12 text-2xl">
                Chat with Roomora
              </h3>

              <p className="mt-4 leading-7 text-gray-400">
                Talk naturally with your AI designer about
                colors, layouts, furniture and your budget.
              </p>

            </div>


            <div className="rounded-3xl border border-white/10 p-8">

              <span className="text-sm text-gray-500">
                03
              </span>

              <h3 className="mt-12 text-2xl">
                Make it yours
              </h3>

              <p className="mt-4 leading-7 text-gray-400">
                Discover furniture and decor that fit your
                style and your budget.
              </p>

            </div>

          </div>

        </div>

      </section>


      {/* Styles */}
      <section
        id="designs"
        className="px-6 py-24 md:px-16"
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

            <button className="text-sm underline underline-offset-4">
              Explore all styles →
            </button>

          </div>


          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

            <StyleCard
              image="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=700&q=80"
              title="Minimal"
            />

            <StyleCard
              image="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=700&q=80"
              title="Japandi"
            />

            <StyleCard
              image="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=700&q=80"
              title="Modern"
            />

            <StyleCard
              image="https://images.unsplash.com/photo-1617104678098-de229db51175?auto=format&fit=crop&w=700&q=80"
              title="Warm"
            />

          </div>

        </div>

      </section>


      {/* AI CTA */}
      <section
        id="explore"
        className="px-6 pb-24 md:px-16"
      >

        <div className="mx-auto max-w-7xl overflow-hidden rounded-[2rem] bg-[#e8e2d7] p-8 md:p-16">

          <div className="max-w-2xl">

            <p className="text-sm uppercase tracking-[0.25em] text-[#8d7d65]">
              Meet your AI designer
            </p>

            <h2 className="mt-4 text-4xl font-medium md:text-6xl">
              Not sure where to start?
            </h2>

            <p className="mt-6 text-lg leading-8 text-gray-600">
              Tell Roomora what you're imagining.
              We'll help you turn the idea into a space.
            </p>

            <button
              onClick={() => setDesigning(true)}
              className="mt-8 rounded-full bg-[#20201e] px-7 py-3.5 text-sm text-white transition hover:-translate-y-1"
            >
              Chat with Roomora →
            </button>

          </div>

        </div>

      </section>


      {/* Footer */}
      <footer className="border-t border-gray-200 px-6 py-8 md:px-16">

        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-gray-500 md:flex-row">

          <p>
            © 2026 Roomora
          </p>

          <p>
            Transform your space. Your way.
          </p>

        </div>

      </footer>

    </div>
  );
}


function StyleCard({ image, title }) {

  return (
    <div className="group">

      <div className="overflow-hidden rounded-3xl">

        <img
          src={image}
          alt={title}
          className="h-80 w-full object-cover transition duration-700 group-hover:scale-105"
        />

      </div>

      <p className="mt-4 text-lg">
        {title}
      </p>

    </div>
  );
}


export default App;