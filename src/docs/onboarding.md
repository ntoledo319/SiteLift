# Onboarding: Developing SiteLift

## First-Day Setup

1. **Clone the repo.**
2. **Install dependencies**: `npm install`.
3. **Run a local server**: You can use `npx live-server` or any static server of your choice.

## Coding Conventions

- **Vanilla Only**: Do not add external libraries without Toledo Technologies approval.
- **ES Modules**: Use `export` in `script.js` and keep the bootstrap logic clean.
- **CSS Tokens**: Always use the variables defined in `:root` for colors and fonts.
- **Accessibility**: Ensure every image has an `alt` tag and keyboard navigation works (test via `Tab`).

## Common Commands

- **Lint & Fix**: `npm run lint:fix`
- **Format**: `npm run format`
- **Test**: `npm run test`

## Making Changes

1. **UI Changes**: Modify `style.css` and use `npm run format` to ensure consistency.
2. **Logic Changes**: Modify `script.js` and add/update tests in `test/`.
3. **Verification**: Run `npm run lint` and `npm test` before committing.
