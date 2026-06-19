In the "Por que é diferente" section, the card titles (h3) are rendering with a dark color from the scoped `.landing-root h3` selector, making them nearly invisible against the dark cards. Update the `Differentiators` component so those titles use a high-contrast light color.

### Changes
- In `src/components/landing/LandingPage.tsx`, change the card `<h3>` class from `text-white` to `!text-white` (or an explicit `text-[color:#FBF8F2]` with stronger specificity) so it overrides the `.landing-root h3` color token.
- Verify that the section eyebrow and body text already have adequate contrast; if not, adjust them to the same light tone.
- Keep the dark background and glassmorphic card style intact.

### Verification
- Re-render the landing page and confirm the three card titles are clearly readable in light color on the dark cards.