# 🩺 CONSILIUM – Forum Dyskusyjne dla Lekarzy (Frontend)

> [![🇬🇧](https://flagcdn.com/w20/gb.png) Read in English](README.md)

## 📌 Opis

Projekt **CONSILIUM** został zrealizowany jako część mojej pracy dyplomowej na kierunku Informatyka. Celem było stworzenie realnej aplikacji webowej, która wspiera specjalistów w procesie konsultacji medycznych, jednocześnie rozwijając kompetencje z zakresu **React**, **REST API**, UX i projektowania systemów frontend-backend.

## Cel aplikacji

Aplikacja służy jako **zamknięte forum dyskusyjne dla lekarzy**, które wspiera proces stawiania diagnoz poprzez umożliwienie wymiany wiedzy, doświadczeń i wspólnej analizy przypadków klinicznych.

## ⚙️ Technologie

- **React.js** – główny framework do budowy interfejsu użytkownika  
- **React Router** – obsługa wielu widoków w aplikacji SPA  
- **Axios** – komunikacja z REST API backendu   
- **Context API** – globalny stan aplikacji (autoryzacja, użytkownik)  

## ✨ Główne funkcje (frontend)

- Logowanie / rejestracja / weryfikacja lekarzy
- Przegląd i filtrowanie wątków dyskusyjnych
- Tworzenie nowych tematów i dodawanie komentarzy (oraz odpowiedzi do komentarzy)
- Responsywny interfejs dostosowany do różnych urządzeń
- Prywatne dyskusje między lekarzami (prywatne chaty)
- Obsługa sesji użytkownika i autoryzacji tokenem

## 🚀 Jak uruchomić frontend lokalnie

> ⚠️
> Aplikacja wymaga działającego backendu (API). Link do backendu: [consiliumbackend](https://github.com/Rzanklod/consiliumbackend)
> 🐳 Wsparcie dla Dockera już wkrótce™

1. Sklonuj repozytorium:

```bash
git clone https://github.com/Rzanklod/consiliumfrontend.git
cd consiliumfrontend
```

2. Zainstaluj zależności projektu:

```bash
npm install
```

3. Uruchom aplikacje w trybie deweloperskim:

```bash
npm start
```

4. Otwórz przeglądarke i wejdź pod adres:

```bash
http://localhost:3000
```

