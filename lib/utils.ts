import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatEuros(montant: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  }).format(montant);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("fr-FR").format(
    typeof date === "string" ? new Date(date) : date
  );
}

export function genererNumeroDocument(prefix: string, sequence: number): string {
  const annee = new Date().getFullYear();
  const num = String(sequence).padStart(4, "0");
  return `${prefix}-${annee}-${num}`;
}
