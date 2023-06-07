export const packageJson = {
  "name": "",
  "version": "1.0.0",
  "description": "",
  "main": "dist/index.js",
  "scripts": {
    "test": "npm run build && node dist/index.js",
    "build": "tsc -p tsconfig.json"
  },
  "author": "yumubai",
  "license": "ISC",
  "devDependencies": {
    "@types/node": "^20.2.5",
    "typescript": "^5.1.3"
  },
  "dependencies": {
    "@inquirer/prompts": "^2.1.0",
    "dotenv": "^16.1.4",
    "kleur": "^4.1.5"
  }
}