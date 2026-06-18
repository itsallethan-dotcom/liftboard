import postcss from "postcss";
import tailwindcss from "@tailwindcss/postcss";
import path from "path";
import { fileURLToPath } from "url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

process.chdir("c:/Users/grimg/Desktop");

const css = '@import "tailwindcss";';

try {
  await postcss([tailwindcss({})]).process(css, {
    from: "c:/Users/grimg/Desktop/test.css",
  });
  console.log("WITHOUT base, from Desktop: OK");
} catch (e) {
  console.log("WITHOUT base, from Desktop: FAIL");
  console.log(e.message);
}

try {
  await postcss([tailwindcss({ base: projectRoot })]).process(css, {
    from: path.join(projectRoot, "app/globals.css"),
  });
  console.log("WITH base, from project globals.css, cwd Desktop: OK");
} catch (e) {
  console.log("WITH base, from project globals.css, cwd Desktop: FAIL");
  console.log(e.message);
}
