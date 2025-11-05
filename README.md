# DevSecOps Demo

En enkel Node.js applikation för att demonstrera GitHub Actions och DevSecOps-praxis.

## Funktioner

- **Express Backend**: Enkel REST API med säkerhetsvalidering
- **Statisk Frontend**: HTML-sida med interaktiv validering
- **Testbar Logik**: Fullständig testsvit med Jest
- **Säkerhetsfokus**: Input-validering, XSS-skydd, lösenordsstyrka

## Kom igång

### Installation

```bash
npm install
```

### Kör applikationen

```bash
npm start
```

Öppna sedan `http://localhost:3000` i din webbläsare.

### Kör tester

```bash
npm test
```

### Kör tester med coverage

```bash
npm run test:coverage
```

## Projektstruktur

```
DevSecOps-demo/
├── main.js           # Affärslogik med testbara funktioner
├── main.test.js      # Jest-tester för affärslogiken
├── server.js         # Express server
├── public/
│   └── index.html    # Statisk frontend
└── package.json      # Projekt-konfiguration
```

## API Endpoints

- `GET /api/health` - Health check
- `POST /api/validate` - Validera text input
- `POST /api/validate-password` - Validera lösenordsstyrka

## Testbar Logik

Projektet innehåller flera testbara funktioner i `main.js`:

- `validateInput()` - Kontrollerar för XSS-attacker
- `sanitizeInput()` - Rengör farlig input
- `calculateComplexityScore()` - Beräknar textkomplexitet
- `validatePassword()` - Validerar lösenordsstyrka

## Säkerhetsfunktioner

- **Helmet.js**: HTTP-säkerhetshuvuden
- **CORS**: Cross-Origin Resource Sharing
- **Input-validering**: XSS och injection-skydd
- **Lösenordsvalidering**: Krav på stark lösenordspolicy

## För GitHub Actions

Detta projekt är förberett för CI/CD med GitHub Actions. Du kan lägga till workflows för:

- Automatisk testning
- Säkerhetsskanning (npm audit, Snyk, etc.)
- Linting och kodkvalitet
- Automatisk deployment

## Licens

MIT