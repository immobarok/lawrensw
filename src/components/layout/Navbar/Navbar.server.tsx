import Logo from "@/components/shared/Logo";
import NavbarClient from "./Navbar.client";

const Navbar = () => {
  const Links = [
    { name: "Home", href: "/" },
    {
      name: "Cruises",
      dropdown: [
        { name: "Cruises", href: "/cruises" },
        { name: "Arctic Cruises", href: "/arctic-cruises" },
        { name: "Expedition Antarctica", href: "/expedition-antarctica" },
        { name: "Cruise Svalbard", href: "/cruise-svalbard" },
        { name: "Cruise Greenland", href: "/cruise-greenland" },
      ],
    },
    { name: "Our ships", href: "/allships" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return <NavbarClient links={Links} logo={<Logo />} />;
};

export default Navbar;
