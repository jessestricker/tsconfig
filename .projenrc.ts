import { ReleasableCommits } from "projen";
import { GithubCredentials } from "projen/lib/github";
import {
  NodePackageManager,
  NodeProject,
  NpmAccess,
} from "projen/lib/javascript";
import { ProjenrcTs } from "projen/lib/typescript";
import path from "node:path/posix";

const project = new NodeProject({
  name: "tsconfig",
  packageManager: NodePackageManager.PNPM,
  projenCommand: "pnpx projen",
  projenrcJs: false,
  packageName: "@jessestricker/tsconfig",
  description: "A collection of tsconfig.json files.",
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
  devDeps: ["ts-node", "typescript", "@types/node"],
  githubOptions: {
    mergify: false,
  },
  projenCredentials: GithubCredentials.fromApp({
    appIdSecret: "APP_ID",
    privateKeySecret: "APP_PRIVATE_KEY",
  }),
  pullRequestTemplate: false,
  defaultReleaseBranch: "main",
  releasableCommits: ReleasableCommits.featuresAndFixes(),
  releaseToNpm: true,
  npmTrustedPublishing: true,
});

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

const projenrc = new ProjenrcTs(project);
projenrc.tsconfig.file.addOverride("compilerOptions.module", "node20");
project.defaultTask?.reset(
  `pnpm exec ts-node --project ${projenrc.tsconfig.file.path} ${projenrc.filePath}`,
);

project.gitattributes.addAttributes(
  "/src/tsconfig.*.json",
  "linguist-language=jsonc",
);

project.npmignore?.exclude(
  ...(project.github?.workflows.map((workflow) => workflow.file!.path) ?? []),
  project.artifactsDirectory,
  "/src/index.ts",
);

project.testTask.spawn(
  project.addTask("test:tsconfig", {
    steps: tsconfigNames.map((tconfigName) => ({
      exec: `pnpm exec tsc --project src/tsconfig.${tconfigName}.json --noEmit`,
    })),
  }),
);

project.addTask("format", { exec: "prettier --write ." });
project.testTask.spawn(
  project.addTask("format:check", { exec: "prettier --check ." }),
);
project.prettier?.ignoreFile?.exclude(
  ...project.files.map((file) => file.path),
  project.package.lockFile,
);

project.synth();
