
const Content = () => {
  return (
    <div className="text-gray-800 container mx-auto p-4 py-12">
      <div className="max-w-8xl space-y-8">
        {/* Introduction */}
        <section>
          <p className="text-lg leading-relaxed">
            Welcome to Polar Travelerl! These Terms of Service
            (&apos;Terms&apos;) govern your use of our website and travel
            services. By accessing our website or making a booking, you agree to
            be bound by these Terms. Please read them carefully.
          </p>
        </section>
        <section>
          <h1 className="text-2xl font-bold mb-4">Introduction</h1>
          <p className="text-lg leading-relaxed">
            Polar Traveler offers curated travel experiences and products aimed
            at young adventurers. These Terms apply to all visitors, users, and
            customers. If you do not agree with any part of these Terms, you may
            not use our services.
          </p>
        </section>

        {/* Eligibility */}
        <section>
          <h1 className="text-2xl font-bold mb-4">Eligibility</h1>
          <p className="text-lg leading-relaxed mb-2">
            To use our services or make purchases, you must:
          </p>
          <ol className="list-decimal list-inside pl-5 space-y-2 text-lg leading-relaxed">
            <li>
              Be at least 18 years old (or have parental consent if under 18).
            </li>
            <li>Provide accurate, current, and complete information.</li>
            <li>Use our website lawfully and responsibly.</li>
          </ol>
          <p className="text-lg leading-relaxed mt-4">
            We reserve the right to refuse service to anyone, for any reason, at
            any time.
          </p>
        </section>

        {/* Booking Terms */}
        <section>
          <h1 className="text-2xl font-bold mb-4">Booking Terms</h1>
          <p className="text-lg leading-relaxed mb-2">
            When you book a travel package or service, you agree to:
          </p>
          <ol className="list-decimal list-inside pl-5 space-y-2 text-lg leading-relaxed">
            <li>
              Pay the required deposit (usually 25–50%) to secure your spot.
            </li>
            <li>
              Settle full payment by the stated deadline prior to departure.
            </li>
            <li>
              Be responsible for your own visas, passports, and required travel
              documents.
            </li>
            <li>
              Accept that itineraries may change due to weather, safety, or
              logistics.
            </li>
          </ol>
          <p className="text-lg leading-relaxed mt-4">
            Polar Traveler will notify you promptly of any changes and do our
            best to offer alternatives.
          </p>
        </section>

        {/* User Responsibilities */}
        <section>
          <h1 className="text-2xl font-bold mb-4">User Responsibilities</h1>
          <p className="text-lg leading-relaxed mb-2">
            To keep our trips fun, fair, and safe:
          </p>
          <ol className="list-decimal list-inside pl-5 space-y-2 text-lg leading-relaxed">
            <li>Provide truthful contact and travel information.</li>
            <li>
              Maintain respectful behavior toward staff, travelers, and locals.
            </li>
            <li>
              Comply with the laws and customs of the destination country.
            </li>
            <li>
              Avoid tampering with our site, software, or communication systems.
            </li>
          </ol>
          <p className="text-lg leading-relaxed mt-4">
            Failure to comply may result in denied service or removal from a
            trip without refund.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Content;
