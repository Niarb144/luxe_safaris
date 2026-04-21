"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from "next/navigation";

const links = [
  { name: "Home", href: "/" },
  { name: "Our Tours", href: "/tours" },
  { name: "Holiday Types", href: "/holidays" },
  { name: "Accommodation", href: "/accommodation" },
  { name: "Practical Info", href: "/info" },
  { name: "Contact", href: "/contact" },
  { name: "Blog", href: "/blog" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState("/");
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Image src="/images/logo.jpeg" alt="Logo" width={100} height={50} />

        {/* Desktop Menu */}
        <nav className="hidden md:flex gap-8 items-center">
          {links.map((link) => (
            <div key={link.name} className="relative group">
              <Link
                href={link.href}
                onClick={() => setActive(link.href)}
                className={`text-sm font-medium transition-colors nav-link ${
                  scrolled ? "text-black" : "text-white"
                }`}
              >
                {link.name}
              </Link>

              {/* Hover underline */}
              <motion.span
                layoutId="underline"
                className="absolute left-0 -bottom-1 h-[2px] w-full bg-orange-500 origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
              />

              {/* Active underline */}
              {pathname === link.href && (
                <motion.span
                  layoutId="active"
                  className="absolute left-0 -bottom-1 h-[2px] w-full bg-[#b77e24]"
                />
              )}
            </div>
          ))}
        </nav>

        <div className="hidden md:block bg-[#b77e24] text-white px-4 py-2 rounded">
            Call Us
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            <AnimatePresence mode="wait">
              {menuOpen ? (
                <motion.div
                  key="x"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                >
                  <X />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                >
                  <Menu />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white shadow-lg"
          >
            <div className="flex flex-col px-6 py-4 gap-4">
              {links.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => {
                    setMenuOpen(false);
                    setActive(link.href);
                  }}
                  className="text-black text-sm font-medium border-b pb-2"
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
