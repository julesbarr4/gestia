import Link from "next/link";
import { Logo } from "./Logo";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--line)] py-12 px-6 bg-[var(--ivory)]">
      <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-5">
        <Logo size={26} />
        <p className="text-[13px] text-[var(--ink-3)] text-center">
          © {new Date().getFullYear()} Gestia — JMB TRADING · Tous droits réservés
        </p>
        <div className="flex gap-6 text-[13px] text-[var(--ink-3)]">
          <Link href="/cgv" className="hover:text-[var(--ink)] transition-colors">CGV</Link>
          <Link href="/confidentialite" className="hover:text-[var(--ink)] transition-colors">Confidentialité</Link>
          <Link href="/contact" className="hover:text-[var(--ink)] transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
