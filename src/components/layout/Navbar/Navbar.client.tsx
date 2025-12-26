"use client";

import Image, { StaticImageData } from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { BiChevronDown } from "react-icons/bi";
import { useAuth } from "@/context/authContext";
import { toast } from "sonner";
import { useLanguage } from "@/context/LanguageContext";
import { assets } from "../../../../public/assets/assets";
import { FaClipboardList, FaUserTie } from "react-icons/fa";
import { GrLogout } from "react-icons/gr";

interface Language {
  code: string;
  name: string;
  flag: StaticImageData;
}

interface LinkItem {
  name: string;
  href?: string;
  dropdown?: { name: string; href: string }[];
}

interface NavbarClientProps {
  links: LinkItem[];
  logo: React.ReactNode;
}

const NavbarClient = ({ links, logo }: NavbarClientProps) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, user, logout, firebaseUser, isFirebaseAuth } =
    useAuth();
  const { languages, currentLanguage, setCurrentLanguage } = useLanguage();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const navbarRef = useRef<HTMLElement>(null);

  const toggleDropdown = (name: string) => {
    setActiveDropdown((prev) => (prev === name ? null : name));
  };

  const closeAllDropdowns = () => {
    setActiveDropdown(null);
    setIsMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        navbarRef.current &&
        !navbarRef.current.contains(event.target as Node) &&
        activeDropdown &&
        !isMobileMenuOpen
      ) {
        setActiveDropdown(null);
      }
    };

    if (activeDropdown && !isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [activeDropdown, isMobileMenuOpen]);

  // esc press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeAllDropdowns();
    };

    if (isMobileMenuOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isMobileMenuOpen]);

  const signOutHandler = async () => {
    let toastId: string | number | null = null;

    try {
      toastId = toast.loading("Logging out...");
      await logout();
      toast.dismiss(toastId);
      toast.success("Logged out successfully!");
      setTimeout(() => {
        router.push("/");
      }, 300);
    } catch (error) {
      if (toastId) {
        toast.dismiss(toastId);
      }
      toast.error("Failed to logout");
    } finally {
      closeAllDropdowns();
    }
  };

  const handleLanguageChange = (language: Language) => {
    setCurrentLanguage(language);
    setActiveDropdown(null);

    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("lang", language.code);

    toast.success(`Language changed to ${language.name}`);

    // Update URL without full reload
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, "", newUrl);
  };


  useEffect(() => {
    const langParam = searchParams?.get("lang");

    // If URL has no language, set default to "en"
    if (!langParam) {
      const defaultLang =
        languages.find((l) => l.code === "en") || languages[0];
      setCurrentLanguage(defaultLang);

      // Update URL permanently with default language
      const params = new URLSearchParams(searchParams?.toString() || "");
      params.set("lang", defaultLang.code);
      const newUrl = `${window.location.pathname}?${params.toString()}`;
      window.history.replaceState({}, "", newUrl);
    } else {
      const languageFromUrl = languages.find((lang) => lang.code === langParam);
      if (languageFromUrl && languageFromUrl.code !== currentLanguage.code) {
        setCurrentLanguage(languageFromUrl);
      }
    }
  }, [searchParams]);


  const getUserAvatar = () => {
    if (isFirebaseAuth && firebaseUser?.photoURL) return firebaseUser.photoURL;
    return user?.avatar || assets.people;
  };

  const getUserName = () => {
    if (isFirebaseAuth && firebaseUser?.displayName)
      return firebaseUser.displayName;
    return user?.name || "User";
  };

  return (
    <>
      {/* Navbar */}
      <nav
        ref={navbarRef}
        className={`
          fixed top-0 left-0 right-0 z-50 
          flex items-center justify-between 
          mx-auto mt-2 sm:mt-4 
          py-2 sm:py-3 px-3 sm:px-4 md:px-6 
          border rounded-md md:rounded-2xl 
          text-white text-sm md:text-md 
          shadow-lg
          transition-all duration-500 ease-out
          backdrop-blur-xl 
          max-w-8xl 
          w-[calc(100%-1rem)] md:w-[90%] lg:w-[82%]
          ${
            scrolled
              ? "border-white/60 bg-black/40 shadow-2xl scale-[0.99]"
              : "border-white/40 bg-black/20 shadow-lg scale-100"
          }
        `}
      >
        {/* Logo */}
        <Link
          href="/"
          onClick={closeAllDropdowns}
          className="flex-shrink-0 transform transition-transform duration-300 hover:scale-105"
        >
          {logo}
        </Link>

        {/* Desktop Menu */}
        <div className="hidden lg:flex items-center gap-2 xl:gap-4 ml-2 xl:ml-4">
          {links.map((link, index) => (
            <div key={index} className="relative">
              {link.dropdown ? (
                <>
                  <button
                    onClick={() => toggleDropdown(link.name)}
                    className={`
                      relative overflow-hidden
                      transition-all duration-300 ease-out
                      whitespace-nowrap text-xs sm:text-sm xl:text-base
                      transform hover:scale-105
                      before:absolute before:bottom-0 before:left-0
                      before:h-0.5
                      before:bg-gradient-to-r before:from-blue before:to-[#001d44]
                      before:transition-all before:duration-300
                      group
                      flex items-center gap-1
                      ${
                        link.dropdown?.some((item) =>
                          pathname?.startsWith(item.href)
                        )
                          ? "text-blue font-semibold"
                          : "hover:text-blue before:w-0 hover:before:w-full"
                      }
                    `}
                  >
                    <span>{link.name}</span>
                    <BiChevronDown
                      className={`transition-transform ${
                        activeDropdown === link.name ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {activeDropdown === link.name && (
                    <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      {link.dropdown.map((item, idx) => (
                        <Link
                          key={idx}
                          href={item.href}
                          onClick={closeAllDropdowns}
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue transition-colors duration-200"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  href={link.href || "#"}
                  onClick={closeAllDropdowns}
                  className={`
                    relative overflow-hidden
                    transition-all duration-300 ease-out
                    whitespace-nowrap text-xs sm:text-sm xl:text-base
                    transform hover:scale-105
                    before:absolute before:bottom-0 before:left-0
                    before:h-0.5
                    before:bg-gradient-to-r before:from-blue before:to-[#001d44]
                    before:transition-all before:duration-300
                    flex-shrink-0
                    ${
                      pathname === link.href ||
                      (link.href === "/allships" &&
                        pathname?.startsWith("/allships/")) ||
                      (link.href === "/cruises" &&
                        searchParams?.get("source") === "cruises")
                        ? "text-blue font-semibold"
                        : "hover:text-blue before:w-0 hover:before:w-full"
                    }
                  `}
                >
                  {link.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* Right Side Desktop */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language */}
          <div className="relative">
            <button
              onClick={() => toggleDropdown("language")}
              className="flex items-center gap-2 p-2 rounded-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
            >
              <Image
                src={currentLanguage?.flag || assets.FlagUS}
                width={24}
                height={16}
                alt={currentLanguage?.name || "Language"}
                className="rounded-sm"
              />
              <span className="text-xs hidden lg:block">
                {currentLanguage?.code?.toUpperCase() || "EN"}
              </span>
              <BiChevronDown
                className={`transition-transform ${
                  activeDropdown === "language" ? "rotate-180" : ""
                }`}
                size={16}
              />
            </button>
            {activeDropdown === "language" && (
              <div
                data-no-translate="true"
                className="absolute top-full right-0 mt-2 w-40 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50"
              >
                {languages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageChange(language)}
                    className={`flex items-center gap-2 w-full px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200 ${
                      currentLanguage.code === language.code ? "bg-blue-50" : ""
                    }`}
                  >
                    <Image
                      src={language.flag || assets.FlagUS}
                      width={20}
                      height={14}
                      alt={language.name}
                      className="rounded-sm"
                    />
                    <span className="text-sm">{language.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* User Menu */}
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => toggleDropdown("user")}
                className="bg-[#FFF4E870] p-2 rounded-3xl flex items-center gap-2"
              >
                <div className="bg-white p-1 rounded-full">
                  <Image
                    src={getUserAvatar()}
                    width={60}
                    height={60}
                    alt="user"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                </div>
                <BiChevronDown
                  className={`text-black transition-transform ${
                    activeDropdown === "user" ? "rotate-180" : ""
                  }`}
                  size={24}
                />
              </button>
              {activeDropdown === "user" && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                  <div className="px-4 py-2 text-lg font-semibold text-gray-800 border-b border-gray-300">
                    {getUserName()}
                  </div>
                  <Link
                    href="/profile"
                    onClick={closeAllDropdowns}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue transition-colors duration-200"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/profile"
                    onClick={closeAllDropdowns}
                    className="block px-4 py-2 text-gray-800 hover:bg-gray-100 hover:text-blue transition-colors duration-200 border-b border-gray-300"
                  >
                    Trips
                  </Link>
                  <button
                    onClick={signOutHandler}
                    className="block w-full text-left px-4 py-2 cursor-pointer text-gray-800 hover:bg-gray-100 hover:text-blue transition-colors duration-200"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/login"
                onClick={closeAllDropdowns}
                className="hover:text-blue transition-all duration-300 text-sm lg:text-base transform hover:scale-105 relative before:absolute before:bottom-0 before:left-0 before:w-0 before:h-0.5 before:bg-blue/90 before:transition-all before:duration-300 hover:before:w-full mr-2"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="bg-gradient-to-r from-[#EC8A17] to-[#FF9A28] px-6 py-3 rounded-lg text-white hover:shadow-md transform hover:scale-105 transition-all duration-300"
                onClick={closeAllDropdowns}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Mobile Button */}
        <button
          className="md:hidden text-white focus:outline-none p-2 rounded-lg transition-all duration-300 ease-out hover:bg-white/20 hover:scale-110"
          onClick={() => setIsMobileMenuOpen((p) => !p)}
          aria-expanded={isMobileMenuOpen}
          aria-label="Toggle menu"
        >
          <div className="flex flex-col items-center justify-center w-6 h-6 space-y-1">
            <span
              className={`h-0.5 w-6 bg-current transform transition-all duration-300 ease-out ${
                isMobileMenuOpen ? "rotate-45 translate-y-1.5" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-current transform transition-all duration-300 ease-out ${
                isMobileMenuOpen ? "opacity-0 scale-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-6 bg-current transform transition-all duration-300 ease-out ${
                isMobileMenuOpen ? "-rotate-45 -translate-y-1.5" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`
          md:hidden fixed inset-0 z-40 
          transition-all duration-500 ease-out
          ${isMobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"}
        `}
        onClick={closeAllDropdowns}
      />

      {/* Mobile Menu */}
      <div
        className={`
          lg:hidden fixed top-0 right-0 h-full 
          w-60 max-w-[65vw] 
          bg-white/95 backdrop-blur-lg 
          shadow-2xl z-50 
          transition-all duration-500 ease-out 
          transform
          ${
            isMobileMenuOpen
              ? "translate-x-0 opacity-100"
              : "translate-x-full opacity-0"
          }
        `}
      >
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200/50">
          <Link
            href="/"
            onClick={closeAllDropdowns}
            className="transform transition-transform duration-300 hover:scale-105"
          >
            {logo}
          </Link>
          <button
            onClick={closeAllDropdowns}
            className="p-2 rounded-lg hover:bg-gray-100/80 transition-colors duration-200"
          >
            <svg
              className="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Mobile Menu Content */}
        <div className="flex flex-col h-full">
          {/* Navigation Links */}
          <div className="py-6">
            {links.map((link, index) => (
              <div
                key={index}
                className="border-b border-gray-100/50 last:border-b-0"
              >
                {link.dropdown ? (
                  <div>
                    <button
                      onClick={() => toggleDropdown(link.name)}
                      className={`
                        flex items-center justify-between w-full 
                        px-6 py-4 text-left
                        transition-all duration-300 ease-out
                        hover:bg-indigo-50/50 hover:text-blue/90
                        ${
                          link.dropdown?.some((item) =>
                            pathname?.startsWith(item.href)
                          )
                            ? "text-blue bg-indigo-50/30 font-semibold"
                            : "text-gray-800"
                        }
                      `}
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      <span className="text-base font-medium">{link.name}</span>
                      <BiChevronDown
                        className={`text-current transition-transform duration-300 ${
                          activeDropdown === link.name ? "rotate-180" : ""
                        }`}
                        size={20}
                      />
                    </button>

                    {/* Mobile Dropdown */}
                    {activeDropdown === link.name && (
                      <div className="pl-8 bg-gray-50/50">
                        {link.dropdown.map((dropdownItem, idx) => (
                          <Link
                            key={idx}
                            href={dropdownItem.href}
                            className="block px-6 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue transition-colors duration-200 border-b border-gray-100/30"
                            onClick={closeAllDropdowns}
                          >
                            {dropdownItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href={link.href || "#"}
                    className={`
                      block px-6 py-4 text-base font-medium
                      transition-all duration-300 ease-out
                      hover:bg-indigo-50/50 hover:text-blue/90
                      ${
                        pathname === link.href ||
                        (link.href === "/cruises" &&
                          searchParams?.get("source") === "cruises")
                          ? "text-blue bg-indigo-50/30 font-semibold"
                          : "text-gray-800"
                      }
                    `}
                    onClick={closeAllDropdowns}
                    style={{
                      animationDelay: `${index * 100}ms`,
                    }}
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Auth Section */}
          <div
            className={`
              p-6 border-t border-gray-200/50 bg-gray-50/50
              transition-all duration-500 ease-out
              ${
                isMobileMenuOpen
                  ? "translate-y-0 opacity-100"
                  : "translate-y-4 opacity-0"
              }
            `}
            style={{ animationDelay: "400ms" }}
          >
            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-white/70 rounded-xl backdrop-blur-sm">
                  <div className="bg-gradient-to-br from-indigo-400 to-blue-500 p-1 rounded-full">
                    <Image
                      src={getUserAvatar()}
                      width={40}
                      height={40}
                      alt="user"
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {getUserName()}
                    </p>
                  </div>
                </div>

                {/* User Actions */}
                <div className="space-y-2">
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all duration-200"
                    onClick={closeAllDropdowns}
                  >
                    <span className="text-blue">
                      <FaUserTie />
                    </span>
                    <span className="text-gray-800 hover:text-blue font-medium">
                      Profile
                    </span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all duration-200 hover:text-blue"
                    onClick={closeAllDropdowns}
                  >
                    <span className="text-blue">
                      <FaClipboardList />
                    </span>
                    <span className="text-gray-800 font-medium hover:text-blue">
                      My Trips
                    </span>
                  </Link>
                  <button
                    onClick={signOutHandler}
                    className="flex items-center gap-3 cursor-pointer w-full px-4 py-3 bg-red-50 rounded-xl hover:bg-red-100 transition-all duration-200 "
                  >
                    <span className="text-red-600">
                      <GrLogout />
                    </span>
                    <span className="text-red-600 font-medium">Sign Out</span>
                  </button>
                </div>

                {/* Language Selector Mobile */}
                <div className="pt-4 border-t border-gray-200/50">
                  <button
                    onClick={() => toggleDropdown("language")}
                    className="flex items-center justify-between w-full p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={currentLanguage?.flag || assets.FlagUS} // Fixed: use fallback instead of emoji
                        width={24}
                        height={16}
                        alt={currentLanguage?.name || "Language"}
                        className="rounded-sm"
                      />
                      <span className="text-gray-800 font-medium">
                        {currentLanguage.name}
                      </span>
                    </div>
                    <BiChevronDown
                      className={`text-gray-600 transition-transform ${
                        activeDropdown === "language" ? "rotate-180" : ""
                      }`}
                      size={20}
                    />
                  </button>

                  {activeDropdown === "language" && (
                    <div className="mt-2 space-y-1">
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => handleLanguageChange(language)}
                          className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 ${
                            currentLanguage.code === language.code
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-white/50 hover:bg-white/80 text-gray-700"
                          }`}
                        >
                          <Image
                            src={language.flag || assets.FlagUS} // Fixed: use fallback instead of emoji
                            width={20}
                            height={14}
                            alt={language.name}
                            className="rounded-sm"
                          />
                          <span className="text-sm font-medium">
                            {language.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {/* Language Selector for Logged Out Users */}
                <div className="pb-4 border-b border-gray-200/50">
                  <button
                    onClick={() => toggleDropdown("language")}
                    className="flex items-center justify-between w-full p-3 bg-white/70 rounded-xl hover:bg-white/90 transition-all duration-200"
                  >
                    <div className="flex items-center gap-3">
                      <Image
                        src={currentLanguage.flag}
                        width={24}
                        height={16}
                        alt={currentLanguage.name}
                        className="rounded-sm"
                      />
                      <span className="text-gray-800 font-medium">
                        {currentLanguage.name}
                      </span>
                    </div>
                    <BiChevronDown
                      className={`text-gray-600 transition-transform ${
                        activeDropdown === "language" ? "rotate-180" : ""
                      }`}
                      size={20}
                    />
                  </button>

                  {activeDropdown === "language" && (
                    <div className="mt-2 space-y-1">
                      {languages.map((language) => (
                        <button
                          key={language.code}
                          onClick={() => handleLanguageChange(language)}
                          className={`flex items-center gap-3 w-full p-3 rounded-lg transition-all duration-200 ${
                            currentLanguage.code === language.code
                              ? "bg-indigo-100 text-indigo-700"
                              : "bg-white/50 hover:bg-white/80 text-gray-700"
                          }`}
                        >
                          <Image
                            src={language.flag}
                            width={20}
                            height={14}
                            alt={language.name}
                            className="rounded-sm"
                          />
                          <span className="text-sm font-medium">
                            {language.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Auth Buttons */}
                <Link
                  href="/login"
                  className="block w-full px-6 py-3 text-center border border-indigo-300 text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-200 font-medium"
                  onClick={closeAllDropdowns}
                >
                  Login
                </Link>
                <Link
                  href="/signup"
                  className="block w-full px-6 py-3 text-center bg-gradient-to-r from-[#EC8A17] to-[#FF9A28] text-white rounded-xl hover:shadow-lg hover:scale-[1.02] transition-all duration-200 font-medium"
                  onClick={closeAllDropdowns}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarClient;
