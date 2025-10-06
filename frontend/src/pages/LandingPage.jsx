import { MapPin, MessageSquare, Compass, Search } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* Hero Section */}
      <header className="flex flex-col items-center justify-center text-center flex-grow px-6 pt-24 pb-16">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Explore Smarter with Your AI Map Assistant
        </h1>
        <p className="text-gray-600 max-w-2xl mb-10 leading-relaxed">
          Discover nearby places, get instant directions, and chat with your AI travel companion — all in one intuitive map app.
        </p>
        <a
          href="/app"
          className="bg-blue-600 text-white font-semibold px-8 py-3 rounded-xl text-lg hover:bg-blue-700 transition"
        >
          Launch App
        </a>
      </header>

      {/* Features Section */}
      <section className="py-20 px-6 bg-slate-50 border-t border-slate-200">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-semibold mb-12">What You Can Do</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                icon: <Search className="w-7 h-7 text-blue-600" />,
                title: "Search Places",
                desc: "Find restaurants, parks, hotels, and more instantly.",
              },
              {
                icon: <Compass className="w-7 h-7 text-green-600" />,
                title: "Explore Nearby",
                desc: "See what's around you with real-time map insights.",
              },
              {
                icon: <MessageSquare className="w-7 h-7 text-purple-600" />,
                title: "Chat & Navigate",
                desc: "Ask your assistant to guide or find anything for you.",
              },
              {
                icon: <MapPin className="w-7 h-7 text-red-600" />,
                title: "Save Favorites",
                desc: "Bookmark your go-to spots for easy future visits.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition p-6 flex flex-col items-center text-center"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-10 text-center mt-auto">
        <p className="text-gray-400 text-sm">
          © {new Date().getFullYear()} SmartMap Assistant — Built with ❤️ using React & Maps API
        </p>
      </footer>
    </div>
  );
}
