# DOM Hunters - gra do nauki JavaScript DOM

Interaktywny projekt edukacyjny inspirowany konceptem MonsterJS, ale zbudowany od zera w czystym HTML, CSS i JavaScript.

Motyw: Deadpool, Predator, Pennywise (klaun z IT), Alien, Venom.

## Co obejmuje ten projekt

Aplikacja przechodzi przez szerokie spektrum pracy z DOM w 46 misjach:

- selektory i pobieranie elementow (`getElementById`, `getElementsByClassName`, `querySelector`, `querySelectorAll`)
- przechodzenie po drzewie (`closest`, `children`, `parentElement`)
- atrybuty i dane (`setAttribute`, `getAttribute`, `dataset`)
- manipulacja stylem, klasami i stanem formularzy (`style`, `setProperty`, `classList`, `disabled`, `checked`, `selected`)
- tworzenie i usuwanie elementow (`createElement`, `append`, `prepend`, `before`, `after`, `insertBefore`, `remove`, `removeChild`, `DocumentFragment`)
- zdarzenia (`click`, `input`, delegation, `stopPropagation`, `capture`, `once`, `removeEventListener`, `CustomEvent`)

## Uruchomienie

To jest projekt bez bundlera i bez npm.

1. Otworz folder projektu w VS Code.
2. Uruchom plik `index.html` przez Live Server albo bezposrednio w przegladarce.
3. Wpisuj kod w panelu po prawej i klikaj `Uruchom i sprawdz`.

## Jak dziala walidacja

Kazda misja resetuje scene DOM do stanu poczatkowego.
Po uruchomieniu Twojego kodu, silnik sprawdza warunek misji na podstawie zmian w drzewie.
Progres zapisywany jest lokalnie w `localStorage`.

Aktywna wersja gry korzysta z jednego pliku skryptu `src/app.js`, dzieki czemu projekt dziala bezposrednio z `file://` i nie wymaga serwera developerskiego.

## Struktura

- `index.html` - layout aplikacji
- `styles.css` - wyglad, animacje i responsywnosc
- `src/app.js` - silnik gry, definicje misji, uruchamianie kodu, progres i UI
