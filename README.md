# Serenith Website

Responsywny, anglojęzyczny one-pager zbudowany na podstawie „Serenith Website.md”. Next.js App Router + TypeScript, statyczny eksport, GSAP ScrollTrigger i Lenis. Fonty Inter oraz JetBrains Mono są hostowane lokalnie. Oryginalne `logo.svg` pozostaje zachowane; kopia w `public/` służy aplikacji.

## Requirements / wymagania

**Node.js 24 LTS i npm ≥10.9.2.** Pełne wymagania i instalacja Windows: [requirements.md](requirements.md). Wersja Node.js jest zadeklarowana w `engines`, `.nvmrc` i `.node-version`.

## Uruchomienie

Logo edytuj w głównym pliku `logo.svg`. Polecenia `dev` i `build` automatycznie synchronizują je do `public/logo.svg`, więc kolejne zmiany trafią do strony przy jej uruchomieniu lub budowaniu.

```powershell
npm.cmd ci
npm.cmd run dev
```

Strona: http://127.0.0.1:3000. Na macOS/Linux można używać `npm` zamiast `npm.cmd`.

## Wersja produkcyjna

```powershell
npm.cmd run build
npm.cmd run preview
```

Podgląd: http://127.0.0.1:4173. Build tworzy katalog `out/`, gotowy do hostingu statycznego. Serwer podglądu jest lokalnym narzędziem deweloperskim.

## Cloudflare Workers — publikacja statyczna

`wrangler.jsonc` konfiguruje Worker `serenith` do serwowania katalogu `out/`. Projekt korzysta ze statycznego eksportu Next.js, więc nie potrzebuje adaptera OpenNext ani katalogu `.next/standalone`.

W Cloudflare Workers Builds ustaw:

- Build command: `npm run build`
- Deploy command: `npm run deploy` (również `npx wrangler deploy` korzysta z tej samej konfiguracji)
- Node.js: `24`

Projekt obsługuje npm 10.9.2 używany przez Cloudflare. `package.json` i `package-lock.json` wysyłaj razem. Override `undici` jest zadeklarowany globalnie, aby npm 10 i npm 11 zgodnie rozwiązywały tę zależność do poprawionej wersji 7.30.1.

Przed ponownym wdrożeniem wyślij zmienione pliki do gałęzi używanej przez Cloudflare. Konfiguracja w repozytorium zapobiega automatycznej migracji do OpenNext uruchamianej przez Wrangler przy braku konfiguracji.

Sprawdzenie bez publikowania:

```powershell
npm.cmd run build
npm.cmd run deploy:check
```

Ręczna publikacja po zalogowaniu (`npx wrangler login`):

```powershell
npm.cmd run build
npm.cmd run deploy
```

Cloudflare Pages jest osobną ścieżką wdrożenia: build `npm run build`, katalog wynikowy `out`. Polecenie `wrangler pages deploy` dotyczy projektu Pages, natomiast obecny log pochodzi z Workers Builds.

## Weryfikacja

```powershell
npm.cmd run typecheck
npm.cmd run build
npm.cmd run test:e2e
```

Testy Playwright uruchamiają podgląd statycznego eksportu i sprawdzają sześć etapów, progi dopasowania, zakładki oraz klawiaturę, mobile, reduced motion i litepaper. Domyślnie używają zainstalowanej przeglądarki Microsoft Edge. Aby użyć Chromium Playwright, ustaw `PLAYWRIGHT_CHANNEL=chromium` i zainstaluj je poleceniem `npx playwright install chromium`.

## Struktura

- `src/app/page.tsx` — siedem sekcji, nawigacja, animacja przewijania i interakcje.
- `src/components/visuals.tsx` — ikony SVG, animowana sfera Canvas, dokument i sześć stanów kanwy.
- `src/lib/content.ts` — angielskie teksty etapów i zastosowań.
- `src/app/globals.css` — tokeny, układ, animacje i responsywność.
- `src/app/litepaper/page.tsx` — lokalny szkic opisu architektury.
- `tests/site.spec.ts` — testy zachowania przeglądarki.

## Zachowanie

Tor animacji ma `550vh`, sześć etapów i klikalną nawigację. GSAP mapuje postęp przewijania na progi z dokumentu: 0, 0.16, 0.33, 0.50, 0.68 i 0.85. Ten sam element dokumentu przenosi się z hero do lokalnego sandboxa. Lenis wygładza przewijanie; dotyk pozostaje natywny. Wektorowe i HTML-owe przejścia wykorzystują transformacje oraz przezroczystość.

Przy `prefers-reduced-motion: reduce` animacje są wyłączone, długa sekcja zmienia się w kompaktową scenę, a etapy wybiera się przyciskami. Menu mobilne obsługuje Escape; zakładki obsługują strzałki, Home i End. Canvas wstrzymuje obliczenia poza ekranem i w nieaktywnej karcie. Fonty nie wymagają połączeń z Google Fonts.

## Zakres i materiały do uzupełnienia

To strona prezentacyjna i wizualizacja protokołu. Nie wykonuje prawdziwego TFHE, transakcji blockchain, uploadu badań ani podpisywania NDA. Wszystkie wyniki w animacji są ilustracją architektury.

Specyfikacja nie podaje oficjalnego adresu repozytorium Serenith ani gotowego litepapera. Dlatego link GitHub jest jawnie opisany jako repozytorium biblioteki `tfhe-rs`, a litepaper to lokalny **szkic architektury**. Przed publikacją podmień go na zatwierdzony dokument i dodaj właściwy adres repozytorium projektu. Treści o bezpieczeństwie wymagają potwierdzenia względem rzeczywistej implementacji.
