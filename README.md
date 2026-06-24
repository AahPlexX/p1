# Ashen Vale

Ashen Vale is a complete single-player browser RPG. Explore the Vale, defeat creatures in turn-based combat, recover relics, and confront the Bell Warden in the Sunken Archive.

## Play

Open `index.html` from an HTTP server or deploy it through GitHub Pages. The game saves automatically in browser storage when storage is available.

- **Keyboard:** Arrow keys or `W`, `A`, `S`, `D` move. Combat actions are available by button.
- **Touch:** Use the directional pad and combat buttons.
- **Objective:** Defeat ordinary foes for three relics, then enter the Sunken Archive and defeat the Bell Warden.

## Verification

This project uses no runtime dependencies. With Node.js 22 or later:

```sh
pnpm run check
pnpm run test
```

## Deployment

The included GitHub Actions workflow deploys the repository root to GitHub Pages. In repository settings, set **Pages → Build and deployment → Source** to **GitHub Actions**.
