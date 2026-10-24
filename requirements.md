# Wymagania projektu

- **Node.js 24 LTS** (`>=24.0.0 <25`). Projekt przygotowano z Node.js **24.22.1**.
- **npm 10.9.2 lub nowszy**. Czysta instalacja jest weryfikowana z npm **10.9.2**, używanym przez Cloudflare. Lokalnie można używać npm **11.19.1**.
- Aktualna przeglądarka obsługująca CSS sticky, Canvas i SVG.
- Do testów E2E: Microsoft Edge. Playwright korzysta z lokalnie zainstalowanego Edge; nie wymaga osobnego pobierania Chromium.

Wersję Node.js deklarują również `package.json` (`engines`), `.nvmrc` i `.node-version`. Zależności JavaScript są zapisane w `package.json` i dokładnie przypięte w `package-lock.json`. Ten projekt nie używa Pythona ani `requirements.txt` dla pip.

## Instalacja na Windows

```powershell
winget install --id OpenJS.NodeJS.LTS --exact --source winget
```

Wymagana jest linia 24 LTS. Jeśli w przyszłości polecenie zainstaluje inną główną wersję, wybierz instalator 24.x z [archiwum Node.js](https://nodejs.org/en/download/archive).

Po instalacji otwórz nowy terminal, aby odświeżyć PATH:

```powershell
node --version
npm.cmd --version
npm.cmd ci
```

Jeśli otwarty terminal jeszcze nie widzi Node.js:

```powershell
$env:Path = 'C:\Program Files\nodejs;' + $env:Path
```

Nie trzeba zmieniać polityki wykonywania PowerShell — polecenie `npm.cmd` działa również przy zablokowanych skryptach `.ps1`.
