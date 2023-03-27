1. link your vite to this repo via `pnpm`

```json
{
   "pnpm": {
      "overrides": {
        "vite": "link:../../vite/packages/vite"
      }
  }
}
```
2. run `npm test` to see the perf result

> you can check test code in `perf.spec.ts`, it will test the FCP time