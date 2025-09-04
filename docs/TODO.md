# Senior Refactor Roadmap and Progress

Principles:
- Preserve functionality and visuals (no UX/markup regressions)
- Improve architecture, readability, reuse, and maintainability
- Strengthen typing, error handling, and data flow
- Keep commits incremental and verify after each step

## High Priority (Next up)
- [x] SubHeader: format schedule as "{todayName}:{HH:MM-HH:MM or dayOff}" using weekly `schedules` (implemented via getTodayScheduleInfo; SubHeader renders "Day: Window/Выходной")
- [ ] Verify worktime modal logic across all entry points (Cart, BusketDesktop, CTA buttons)
- [ ] Normalize API layer: ensure trailing slashes and align query param naming (organizationSlug, spotId)
- [ ] Centralize Accept-Language header in base API client

## Architecture and Structure
- [ ] Establish clear layer boundaries (shared/lib, shared/ui, entities, features, pages, widgets) without breaking imports
- [ ] Create barrels (index.ts) for public API of folders to simplify imports
- [ ] Introduce absolute import aliases (tsconfig paths) and unify existing relative imports
- [ ] Co-locate styles with components, keep only global variables and resets in global styles
- [ ] Deduplicate icons/images and ensure consistent naming

## API and Data
- [ ] Create or consolidate `baseApi` (RTK Query) with baseUrl and default headers
- [ ] Move all endpoints to RTK Query services, unify error/transformResponse handlers
- [ ] Ensure endpoints use trailing slashes per backend spec
- [ ] Strongly type all requests/responses in `src/types/*`
- [ ] Add small client-side caching policies where applicable (providesTags/invalidatesTags)

## State Management
- [ ] Audit slices for unnecessary local state vs global state
- [ ] Extract pure computations into selectors/memoized helpers
- [ ] Remove dead code, unused actions, and any imperative DOM state in slices

## Components
- [ ] Extract reusable UI primitives (Button, Modal, Icon, Loader, Badge, Banner)
- [ ] Split complex components into container (business) and presentational (UI)
- [ ] Ensure accessibility: roles, aria- attributes for modals and buttons
- [ ] Replace magic numbers with tokens/variables or derive via measurements (like scrollHeight)

## Utilities
- [ ] timeUtils: expose a helper returning { todayName, window, isClosed } to avoid recomputations in components
- [ ] currency utils: unify formatting and round rules
- [ ] storage utils: narrow surface, add schema validation where necessary

## i18n
- [ ] Ensure all user-facing strings are localized (ru/en/kg)
- [ ] Localize day names if backend provides ru-only dayName (fallback mapping)
- [ ] Keep keys flat and consistent; remove duplicates

## Styling
- [ ] Normalize SCSS structure (variables, mixins, utilities)
- [ ] Leverage Tailwind where already used; remove conflicting styles
- [ ] Ensure responsive truncation (e.g., schedule text with title tooltip)

## Quality
- [ ] ESLint/Prettier pass, fix import ordering and rules
- [ ] TypeScript strictness increase where feasible (no implicit any)
- [ ] Add smoke tests for critical flows (cart submit, schedule blocking)

## Delivery Info Banner (Cart)
- [ ] Ensure banner logic is pure and covered by unit test
- [ ] Confirm colorTheme usage and contrast
- [ ] Add progress wording: "Добавьте товаров на N c для бесплатной доставки"

## Operational
- [ ] Dockerfile/docker-compose sanity check (dev/prod)
- [ ] Document environment variables in README
- [ ] Update README with new architecture map and conventions

---

Progress Notes:
- Preparation: checklist scaffolded; next change will target SubHeader formatting using weekly schedules and graceful fallback.
