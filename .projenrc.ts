import { ReleasableCommits } from "projen";
import { GithubCredentials } from "projen/lib/github";
import {
  NodePackageManager,
  NodeProject,
  NpmAccess,
} from "projen/lib/javascript";
import { ProjenrcTs } from "projen/lib/typescript";

const project = new NodeProject({
  name: "tsconfig",
  packageManager: NodePackageManager.PNPM,
  projenCommand: "pnpx projen",
  projenrcJs: false,
  packageName: "@jessestricker/tsconfig",
  description: "A collection of tsconfig.json files.",
  keywords: ["tsconfig", "node", "pedantic"],
  homepage: "https://github.com/jessestricker/tsconfig",
  repository: "https://github.com/jessestricker/tsconfig.git",
  authorName: "Jesse Stricker",
  license: "MIT-0",
  entrypoint: "",
  npmAccess: NpmAccess.PUBLIC,
  jest: false,
  prettier: true,
  prettierOptions: {
    yaml: true,
  },
  devDeps: ["ts-node", "typescript", "@types/node", "shx"],
  githubOptions: {
    mergify: false,
  },
  projenCredentials: GithubCredentials.fromApp(),
  workflowNodeVersion: ">=24.5",
  pullRequestTemplate: false,
  minMajorVersion: 1,
  defaultReleaseBranch: "main",
  releasableCommits: ReleasableCommits.featuresAndFixes(),
  releaseToNpm: true,
  npmTrustedPublishing: true,
});

// exports
const tsconfigNames = ["node-22", "node-24", "node-ts", "pedantic"];
project.package.addField(
  "exports",
  Object.fromEntries(
    tsconfigNames.map((tsconfigName) => [
      `./${tsconfigName}.json`,
      `./src/tsconfig.${tsconfigName}.json`,
    ]),
  ),
);

// .projenrc.ts
const projenrc = new ProjenrcTs(project);
projenrc.tsconfig.file.addOverride("compilerOptions.module", "nodenext");
projenrc.tsconfig.file.addOverride("compilerOptions.target", "esnext");
project.defaultTask?.reset(
  `pnpm exec ts-node --project ${projenrc.tsconfig.file.path} ${projenrc.filePath}`,
);

// git
project.gitattributes.addAttributes(
  "/src/tsconfig.*.json",
  "linguist-language=jsonc",
);

// packaging
project.npmignore?.exclude(
  ...(project.github?.workflows.map((workflow) => workflow.file!.path) ?? []),
  project.artifactsDirectory,
  "/src/index.ts",
);

// testing
const supportedTypeScriptVersions = ["5.9.3", "6.0.2"];
project.testTask.spawn(
  project.addTask("test:tsconfig", {
    steps: supportedTypeScriptVersions.flatMap((typeScriptVersion) =>
      tsconfigNames.map((tconfigName) => ({
        exec: `pnpx --package=typescript@${typeScriptVersion} -- tsc --project src/tsconfig.${tconfigName}.json --noEmit`,
      })),
    ),
  }),
);

// prettier
project.addTask("format", { exec: "prettier --write ." });
project.testTask.spawn(
  project.addTask("format:check", { exec: "prettier --check ." }),
);
project.prettier?.ignoreFile?.exclude(
  ...project.files.map((file) => file.path),
  project.package.lockFile,
);

project.synth();
