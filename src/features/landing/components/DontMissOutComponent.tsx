import placeholder1 from "@src/assets/landing/placeholder1.jpg";

export default function DontMissOutComponent() {
  return (
    <section className="h-[100vh] py-24 text-white px-4 sm:px-6 lg:px-30">
      <div className="text-center">
        <div className="mb-16">
        <h2 className="text-responsive-2xl font-bold text-white">Don't Miss Out!</h2>
      </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col items-center text-center p-7">
            <div className="w-full aspect-square rounded-lg overflow-hidden mb-6">
              <img
                src={placeholder1}
                alt="Event"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-responsive-sm font-bold mb-2 text-white">Event Title</h3>
            <p className="text-responsive-xs text-white opacity-90">
              Connect with communities, join events, and engage with content
              that matters to you. Be part of something bigger.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-7">
            <div className="w-full aspect-square rounded-lg overflow-hidden mb-6">
              <img
                src={placeholder1}
                alt="Event"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-responsive-sm font-bold mb-2 text-white">Event Title</h3>
            <p className="text-responsive-xs text-white opacity-90">
              Connect with communities, join events, and engage with content
              that matters to you. Be part of something bigger.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-7">
            <div className="w-full aspect-square rounded-lg overflow-hidden mb-6">
              <img
                src={placeholder1}
                alt="Event"
                className="w-full h-full object-cover"
              />
            </div>
            <h3 className="text-responsive-sm font-bold mb-2 text-white">Event Title</h3>
            <p className="text-responsive-xs text-white opacity-90">
              Connect with communities, join events, and engage with content
              that matters to you. Be part of something bigger.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
