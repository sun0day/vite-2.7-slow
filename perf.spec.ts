import { test, expect } from "@playwright/test";
import { createServer } from "vite";
import react from "@vitejs/plugin-react";
import { rm } from "node:fs/promises";
import { join } from "node:path";

let server;
let times = [];

test.beforeEach(async ({ page }) => {
  // empty .vite cache before start server
  await rm(join(__dirname, "./node_modules/.vite"), { recursive: true }).catch(
    (err) => {}
  );
  server = await createServer({
    plugins: [react()],
  });

  await server.listen(5173);
});
test.afterEach(async () => {
  await server.close();

  server = null;
});
test.afterAll(() => {
  console.log("\n");
  console.log("FCP max: ", Math.max(...times).toFixed(0));
  console.log("FCP min: ", Math.min(...times).toFixed(0));
  console.log(
    "FCP avg: ",
    (times.reduce((acc, cur) => acc + cur, 0) / times.length).toFixed(0)
  );
});

for (let i = 0; i < 20; i++) {
  test(`perf test ${i}`, async ({ page }) => {
    page.on("console", (msg) => {
      /\d+/.test(msg.text()) && times.push(+msg.text());
    });
    await page.goto(`http://localhost:${5173}/`);
    // wait for collecting fcp time
    await new Promise((r) => setTimeout(r, 200));
  });
}
