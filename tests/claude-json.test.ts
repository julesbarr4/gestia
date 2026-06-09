import { describe, it, expect } from "vitest";
import { nettoyerJsonLLM, parseJsonLLM } from "@/lib/claude";

describe("nettoyerJsonLLM", () => {
  it("retire un bloc ```json ... ```", () => {
    const brut = '```json\n{"a":1}\n```';
    expect(nettoyerJsonLLM(brut)).toBe('{"a":1}');
  });

  it("retire un bloc ``` sans langage", () => {
    const brut = '```\n{"a":1}\n```';
    expect(nettoyerJsonLLM(brut)).toBe('{"a":1}');
  });

  it("laisse intact un JSON déjà propre", () => {
    expect(nettoyerJsonLLM('{"a":1}')).toBe('{"a":1}');
  });

  it("supprime les espaces superflus", () => {
    expect(nettoyerJsonLLM('  {"a":1}  ')).toBe('{"a":1}');
  });
});

describe("parseJsonLLM", () => {
  it("parse un JSON encapsulé dans un bloc markdown", () => {
    const brut = '```json\n{"sujet":"Bonjour","corps":"Texte"}\n```';
    expect(parseJsonLLM(brut)).toEqual({ sujet: "Bonjour", corps: "Texte" });
  });

  it("lève sur une sortie non-JSON", () => {
    expect(() => parseJsonLLM("désolé, je ne peux pas")).toThrow();
  });
});
