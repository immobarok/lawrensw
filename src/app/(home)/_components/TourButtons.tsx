"use client";

import Button from "@/components/ui/Button";

interface TourButton {
  id: number;
  button_name: string;
  trip_url: string;
  trip_id: string;
}

interface TourButtonsProps {
  buttons: TourButton[];
}

const TourButtons = ({ buttons }: TourButtonsProps) => {
  const renderButtons = () => {
    if (buttons && buttons.length > 0) {
      return buttons.map((button, index) => (
        <Button
          key={button.id}
          className={`text-sm md:text-lg font-medium flex-nowrap py-3.5 px-8 ${
            index === 0
              ? "bg-secondary"
              : "bg-[rgba(0,0,0,0.20)] border border-secondary backdrop-blur-[7.45px]"
          }`}
          onClick={() => window.open(button.trip_url, "_blank")}
        >
          {button.button_name}
        </Button>
      ));
    }

    // fallback buttons
    return (
      <>
        <Button className="text-sm md:text-lg font-medium bg-secondary py-3.5 px-8 flex-nowrap">
          Antarctic Tour
        </Button>
        <Button className="text-sm md:text-lg font-medium flex-nowrap bg-[rgba(0,0,0,0.20)] border border-secondary backdrop-blur-[7.45px] py-3.5 px-8">
          Arctic tours
        </Button>
      </>
    );
  };

  return (
    <div className="flex flex-wrap gap-4 justify-center">{renderButtons()}</div>
  );
};

export default TourButtons;
