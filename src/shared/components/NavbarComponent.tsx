import { PrimaryButton } from "./PrimaryButton";
import brandlogo from "@src/assets/navbar/brand.png";
import brandLogoDark from "@src/assets/brand-dark.png";
import { useState } from "react";

interface NavbarProps {
  brandName: string;
  transparent?: boolean;
  onButtonClick?: () => void;
  buttonLabel: string;
  navMenu?: React.ReactNode;
}

export function Navbar({
  brandName,
  transparent = false,
  onButtonClick,
  navMenu,
  buttonLabel,
}: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const shouldBeTransparent = transparent;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav
      className={`w-full fixed top-0 left-0 z-50 transition-colors duration-300 ${
        shouldBeTransparent ? "bg-transparent" : "bg-white shadow-md"
      }`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-30 flex flex-col justify-center h-[86px]">
        <div className="flex justify-between items-center">
          {/* Brand */}
          <div className="flex flex-row items-center">
            <div className="flex flex-row space-x-1 items-center h-[86px]">
              <img
                src={shouldBeTransparent ? brandlogo : brandLogoDark}
                className="h-full max-h-full w-auto object-contain"
              />
              <div
                className={`hidden sm:block text-responsive-base font-semibold transition-colors duration-300 ${
                  shouldBeTransparent ? "text-white" : "text-primary"
                }`}
              >
                {brandName}
              </div>
            </div>

            {/* Desktop Nav Menu */}
            {navMenu && <div className="hidden md:block ml-8">{navMenu}</div>}
          </div>

          {/* Desktop Login Button */}
          <div className="hidden md:flex items-center">
            <PrimaryButton onClick={onButtonClick} label={buttonLabel} />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden flex items-center p-2"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <svg
              className={`w-6 h-6 transition-colors duration-300 ${
                shouldBeTransparent ? "text-white" : "text-primary"
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white shadow-lg absolute top-[86px] left-0 right-0 z-50 py-4 px-4 border-t">
            <div className="w-full">{navMenu}</div>
            <div className="mt-4">
              <PrimaryButton onClick={onButtonClick} label={buttonLabel} />
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
