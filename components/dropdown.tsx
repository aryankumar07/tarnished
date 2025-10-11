'use client'
import { useState } from "react";
import { cn } from "../lib/utils";
import { DropDownProps } from "../constants";
import SoundComponent from "./soundComponent";

const BottomArrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-chevron-down"
  >
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const RightArrow = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="lucide lucide-chevron-right"
  >
    <path d="m9 18 6-6-6-6" />
  </svg>
);

const DropDown = ({ data }: { data: DropDownProps }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <div className="w-full border-b border-foreground/20 shadow-sm">
      <SoundComponent
        href='/sounds/drop.mp3'
        render={(handlePlay) => (
          <button
            type="button"
            onClick={() => {
              handlePlay()
              setIsOpen((prev) => !prev)
            }}
            className={cn(
              "w-full flex justify-between items-center group p-2 hover:bg-orange hover:rounded-sm",
              isOpen ? "border border-orange/80 bg-orange/15" : "border-none"
            )}
            aria-expanded={isOpen}
          >
            <div className="flex items-center gap-2">
              {isOpen ? RightArrow : BottomArrow}
              <h2 className="text-lg font-medium group-hover:text-black">
                {data.heading.title}
              </h2>
              {data.heading.subTitle && (
                <span className="text-foreground/50 hidden sm:inline group-hover:text-black">
                  {data.heading.subTitle}
                </span>
              )}
            </div>
            {data.time && (
              <span className="text-foreground/50 hidden md:inline group-hover:text-black">
                {data.time}
              </span>
            )}
          </button>
        )}
      />
      {isOpen && (
        <div className="mt-2 p-4 flex flex-col gap-2">
          {data.content && <p className="text-justify">{data.content}</p>}
          {data.highlights && data.highlights.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.highlights && data.highlights.map((highlight, index) => (
                <span
                  key={`${highlight}-${index}`}
                  className="text-foreground/50"
                >
                  {highlight}
                  {index < data.highlights!.length - 1 ? "," : ""}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};



export default DropDown;
