<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>Gestia — Le cabinet exécutif qui ne dort jamais</title>

<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Geist:wght@300;400;500;600&family=Geist+Mono:wght@400;500&display=swap" rel="stylesheet" />

<script src="https://cdn.tailwindcss.com"></script>
<script>
  tailwind.config = {
    theme: { extend: { fontFamily: { sans: ["Geist","ui-sans-serif","system-ui","sans-serif"], serif: ["Instrument Serif","ui-serif","Georgia","serif"], mono: ["Geist Mono","ui-monospace","monospace"] } } }
  };
</script>

<style>
  :root {
    /* Tones — premium ivoire + ink + accent forêt */
    --ivory: #FBF8F3;
    --ivory-2: #F4EFE6;
    --ink: #0E0E0E;
    --ink-2: #4A4A47;
    --ink-3: #8A8780;
    --line: #E5DFD2;
    --accent: oklch(0.42 0.07 155); /* sapin profond */
    --radius: 14px;
  }
  html, body { background: var(--ivory); color: var(--ink); font-family: Geist, ui-sans-serif, system-ui, sans-serif; -webkit-font-smoothing: antialiased; }
  body { font-feature-settings: "ss01", "cv11"; }
  ::selection { background: var(--accent); color: var(--ivory); }
  /* hide scrollbar accent */
  html { scroll-behavior: smooth; }
</style>
</head>
<body>
  <div id="root"></div>

  <script src="https://unpkg.com/react@18.3.1/umd/react.development.js" integrity="sha384-hD6/rw4ppMLGNu3tX5cjIb+uRZ7UkRJ6BPkLpg4hAu/6onKUg4lLsHAs9EBPT82L" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/react-dom@18.3.1/umd/react-dom.development.js" integrity="sha384-u6aeetuaXnQ38mYT8rp6sbXaQe3NL9t+IBXmnYxwkUI2Hw4bsp2Wvmx4yRQF1uAm" crossorigin="anonymous"></script>
  <script src="https://unpkg.com/@babel/standalone@7.29.0/babel.min.js" integrity="sha384-m08KidiNqLdpJqLq95G/LEi8Qvjl/xUYll3QILypMoQ65QorJ9Lvtp2RXYGBFj1y" crossorigin="anonymous"></script>

  <script type="text/babel" src="components.jsx"></script>
  <script type="text/babel" src="tweaks-panel.jsx"></script>

  <script type="text/babel">
    const { useState, useEffect } = React;

    const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
      "accentHue": 155,
      "accentChroma": 0.05,
      "accentLightness": 0.42,
      "ivoryWarmth": 80,
      "radius": 14,
      "headlineStyle": "serif-italic",
      "heroLabel": "Le cabinet exécutif",
      "heroLabelItalic": "qui ne dort jamais.",
      "showFloatingCallouts": true,
      "darkHero": false,
      "showTeamCard": true
    }/*EDITMODE-END*/;

    function App() {
      const [tw, setTweak] = useTweaks(TWEAK_DEFAULTS);

      // Apply tweaks → CSS vars
      useEffect(() => {
        const r = document.documentElement.style;
        r.setProperty("--accent", `oklch(${tw.accentLightness} ${tw.accentChroma} ${tw.accentHue})`);
        const w = tw.ivoryWarmth;
        r.setProperty("--ivory", `oklch(0.975 ${(w/100)*0.012} 80)`);
        r.setProperty("--ivory-2", `oklch(0.945 ${(w/100)*0.018} 78)`);
        r.setProperty("--line", `oklch(0.89 ${(w/100)*0.018} 76)`);
        r.setProperty("--radius", `${tw.radius}px`);
      }, [tw]);

      return (
        <div className="relative">
          <Navbar />
          <main>
            <Hero />
            <LogoStrip />
            <TeamSection />
            <Features />
            <HowItWorks />
            <Testimonials />
            <Pricing />
            <Manifesto />
            <FAQ />
            <FinalCTA />
          </main>
          <Footer />

          <TweaksPanel title="Tweaks · Gestia">
            <TweakSection title="Identité de marque">
              <TweakSlider label="Teinte accent (hue)" value={tw.accentHue} onChange={v => setTweak("accentHue", v)} min={0} max={360} step={1} suffix="°" />
              <TweakSlider label="Saturation accent" value={tw.accentChroma} onChange={v => setTweak("accentChroma", v)} min={0} max={0.3} step={0.005} />
              <TweakSlider label="Clarté accent" value={tw.accentLightness} onChange={v => setTweak("accentLightness", v)} min={0.2} max={0.8} step={0.01} />
              <TweakSlider label="Chaleur ivoire" value={tw.ivoryWarmth} onChange={v => setTweak("ivoryWarmth", v)} min={0} max={100} step={1} suffix="%" />
              <TweakSlider label="Rayon des coins" value={tw.radius} onChange={v => setTweak("radius", v)} min={0} max={28} step={1} suffix="px" />
            </TweakSection>
            <TweakSection title="Hero">
              <TweakText label="Titre — partie 1" value={tw.heroLabel} onChange={v => setTweak("heroLabel", v)} />
              <TweakText label="Titre — partie 2 (italique)" value={tw.heroLabelItalic} onChange={v => setTweak("heroLabelItalic", v)} />
              <TweakToggle label="Callouts flottants sur le mockup" value={tw.showFloatingCallouts} onChange={v => setTweak("showFloatingCallouts", v)} />
            </TweakSection>
            <TweakSection title="Présets palette">
              <TweakButton onClick={() => {
                setTweak({ accentHue: 155, accentChroma: 0.07, accentLightness: 0.42, ivoryWarmth: 80 });
              }}>Sapin (par défaut)</TweakButton>
              <TweakButton onClick={() => {
                setTweak({ accentHue: 32, accentChroma: 0.13, accentLightness: 0.55, ivoryWarmth: 100 });
              }}>Terracotta</TweakButton>
              <TweakButton onClick={() => {
                setTweak({ accentHue: 250, accentChroma: 0.10, accentLightness: 0.48, ivoryWarmth: 30 });
              }}>Encre bleutée</TweakButton>
              <TweakButton onClick={() => {
                setTweak({ accentHue: 85, accentChroma: 0.18, accentLightness: 0.85, ivoryWarmth: 40 });
              }}>Lime électrique</TweakButton>
              <TweakButton onClick={() => {
                setTweak({ accentHue: 0, accentChroma: 0, accentLightness: 0.30, ivoryWarmth: 60 });
              }}>Mono — sans accent</TweakButton>
            </TweakSection>
          </TweaksPanel>
        </div>
      );
    }

    ReactDOM.createRoot(document.getElementById("root")).render(<App />);
  </script>
</body>
</html>
