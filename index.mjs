#!/usr/bin/env npx --yes zx

$.verbose = false;

let componentName = argv._[1];

if (!componentName) {
  componentName = await question("Component name: ");
}

const componentsPath = "src/components";
if (!(await fs.pathExists(componentsPath))) {
  throw new Error(
    "No components folder found. Please run this command from the root of your project."
  );
}

const componentPath = `${componentsPath}/${componentName}`;
if (await fs.pathExists(componentPath)) {
  throw new Error("Component already exists.");
}

await fs.mkdirp(componentPath);
await fs.outputFile(`${componentPath}/${componentName}.module.css`, "");
await fs.outputFile(
  `${componentPath}/${componentName}.tsx`,
  `import styles from "./${componentName}.module.css";

function ${componentName}() {
  return <div>${componentName}</div>;
}

export default ${componentName};
`
);
await fs.outputFile(
  `${componentPath}/index.js`,
  `export { default } from "./${componentName}";`
);

const ls = await $`ls ${componentPath}`;
console.log(`Files created in ${componentPath}:`);
console.log(ls.toString());
