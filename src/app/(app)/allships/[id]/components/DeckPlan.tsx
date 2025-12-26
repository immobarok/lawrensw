interface Deck {
  id: number;
  image: string;
  shipview_id: number;
  title: string;
}

interface Ship {
  id: number;
  name: string;
  decks?: Deck[];
}

interface ShipInformationProps {
  ship: Ship;
}

const DeckPlan = ({ ship }: ShipInformationProps) => {
  if (!ship?.decks || ship.decks.length === 0) {
    return (
      <div className="w-full p-4 sm:p-6 relative z-0">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4">
          Ship deck plan
        </h2>
        <p className="text-gray-500">No deck plan information available</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-hidden relative z-0">
      <div className="p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">
          Ship deck plan
        </h2>

        <div className="space-y-6 ">
          {ship.decks.map((deck) => (
            <div
              key={deck.id}
              className="bg-white rounded-lg overflow-hidden "
            >
             

              {/* Deck Image */}
              <div className="relative w-full aspect-[4/3] sm:aspect-video border-t">
                <img
                  src={deck.image}
                  alt={deck.title || `Deck ${deck.id}`}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeckPlan;
