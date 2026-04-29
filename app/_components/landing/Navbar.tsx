"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-[backdrop-filter,background-color,border-color] duration-300",
        scrolled
          ? "bg-[var(--ivory)]/85 backdrop-blur-md border-b border-[var(--line)]"
          : "bg-transparent border-b border-transparent"
      )}
    >
      <div className="max-w-[1240px] mx-auto px-6 h-[72px] flex items-center justify-between">
        <Logo size={28} />
        <div className="hidden md:flex items-center gap-9 text-[14px] text-[var(--ink-2)]">
          <a href="#equipe" className="hover:text-[var(--ink)] transition-colors">
            L&apos;équipe
          </a>
          <a href="#fonctionnalites" className="hover:text-[var(--ink)] transition-colors">
            Fonctionnalités
          </a>
          <a href="#tarifs" className="hover:text-[var(--ink)] transition-colors">
            Tarifs
          </a>
          <a href="#manifeste" className="hover:text-[var(--ink)] transition-colors">
            Manifeste
          </a>
        </div>
        <div className="flex items-center gap-1">
          <Link
            href="/login"
            className="text-[14px] text-[var(--ink-2)] hover:text-[var(--ink)] px-3 py-2 transition-colors"
          >
            Connexion
          </Link>
          <Link
            href="/signup"
            className="text-[14px] bg-[var(--ink)] text-[var(--ivory)] hover:bg-[var(--accent)] px-4 py-2 rounded-full font-medium transition-colors inline-flex items-center gap-1.5"
          >
            Démarrer
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="w-3.5 h-3.5"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>
    </nav>
  );
}
