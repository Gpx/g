#!/usr/bin/env npx --yes zx

$.verbose = false;

let type = argv._[1];

switch (type) {
  case "page":
    await createPage();
    break;
  case "component":
    await createComponent();
    break;
  default:
    console.log(
      "You have to specify what you want to create: page or component"
    );
    break;
}

async function createPage() {
  const pageName = argv._[2];
  if (!pageName) {
    throw new Error("You have to specify the name of the page");
  }

  const pagesPath = "./src/pages";
  if (!(await fs.pathExists(pagesPath))) {
    throw new Error(
      "No pages folder found. Please run this command from the root of your project"
    );
  }

  const pagePath = `${pagesPath}/${pageName}`;
  if (await fs.pathExists(pagePath)) {
    throw new Error(`Page ${pageName} already exists`);
  }

  await fs.mkdirp(pagePath);
  await fs.outputFile(
    `${pagePath}/${pageName}.tsx`,
    `function ${pageName}() {
  return <div>${pageName}</div>; 
}

export default ${pageName};
`
  );
  await fs.outputFile(
    `${pagePath}/index.tsx`,
    `export { default } from "./${pageName}";`
  );
  await fs.outputFile(
    `${pagePath}/${pageName}.test.tsx`,
    `import { render, screen } from "@testing-library/react";
import Foo from ".";

describe("Foo", () => {
  it("does something", () => {
    render(<Foo />);
    expect("Implement the tests").toBe(true);
  });
});
`
  );
  const ls = await $`ls ${pagePath}`;
  console.log(`Files created in ${pagePath}:`);
  console.log(ls.toString());
  console.log("Remember to add the page to the routes to access it");
  console.log(
    `const ${pageName} = React.lazy(() => import("pages/${pageName}"));`
  );
  console.log(
    `<Route path="/${pageName.toLowerCase()}" element={<${pageName} />} />`
  );
}

async function createComponent() {
  const componentName = argv._[2];
  if (!componentName) {
    throw new Error("You have to specify the name of the component");
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
    `${componentPath}/index.tsx`,
    `export { default } from "./${componentName}";`
  );

  const ls = await $`ls ${componentPath}`;
  console.log(`Files created in ${componentPath}:`);
  console.log(ls.toString());
  console.log("You can import your component like so:");
  console.log(`import ${componentName} from "components/${componentName}";`);
}
