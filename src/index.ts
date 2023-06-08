#!/usr/bin/env node

import { input } from "@inquirer/prompts"
import path from "path"
import fs, { mkdirSync, readFileSync, writeFileSync } from "fs"
import kleur from "kleur";
import { program } from "commander";

program
  .option("--version")
  .option("-v");

program.parse();

const options = program.opts();

const currentProjectName = getCurrentDirName();

if (options.version || options.v) {
  const packageJsonPath = path.resolve(__dirname, "../package.json")
  const packageJson = JSON.parse(readFileSync(packageJsonPath, { encoding: 'utf-8' }));
  console.log(packageJson.version);
} else {
  build();
}

async function build () {

  let cwd = process.cwd();

  let projectName = await input({ message: `project name: ${currentProjectName}` })
  projectName = projectName || currentProjectName;

  if (fs.existsSync(cwd)) {
    console.log(kleur.red(`directory already exists: ${cwd} `));
    return;
  } else {
    mkdirSync(cwd);
  }

  const projectDescription = await input({ message: 'project description: ' })

  writePackageJson({ cwd, projectName, projectDescription });

  writeGitIgnore({ cwd })

  writeTsConfig({ cwd })

  writeReadme({ cwd, projectName })

  writeEnv({ cwd })

  writeIndex({ cwd, projectName })

  writeCommon({ cwd })

}

function getCurrentDirName () {
  const cwd = process.cwd();
  const dirname = path.dirname(cwd);
  return cwd.slice(dirname.length + 1)
}

function readTemplate (filePath: string) {
  const templatePath = path.resolve(__dirname, `template/${filePath}.template`)
  return readFileSync(templatePath, { encoding: 'utf-8' })
}

function writeFile (cwd: string, filePath: string, content: string) {
  const p = path.resolve(cwd, filePath)
  const dir = path.dirname(p)
  if (!fs.existsSync(dir)) {
    mkdirSync(dir)
  }
  writeFileSync(p, content, { encoding: 'utf-8' })
}

function writePackageJson (params: {
  cwd: string;
  projectName: string;
  projectDescription: string;
}) {
  const packageJsonStr = readTemplate('package.json')

  const json = packageJsonStr.replace('project-name', params.projectName).replace('project-description', params.projectDescription);

  writeFile(params.cwd, 'package.json', json)
}

function writeGitIgnore (params: {
  cwd: string;
}) {
  const content = readTemplate('.gitignore')
  writeFile(params.cwd, '.gitignore', content)
}

function writeTsConfig (params: {
  cwd: string
}) {
  const content = readTemplate('tsconfig.json')
  writeFile(params.cwd, 'tsconfig.json', content)
}

function writeEnv (params: {
  cwd: string
}) {
  writeFile(params.cwd, '.env', "")
}

function writeReadme (params: {
  cwd: string;
  projectName: string;
}) {
  writeFile(params.cwd, 'README.md', `# ${params.projectName}`);
}

function writeIndex (params: {
  cwd: string;
  projectName: string;
}) {
  const content = `export const projectName = "${params.projectName}"`;
  writeFile(params.cwd, 'src/index.ts', content)
}

function writeCommon (params: {
  cwd: string;
}) {
  const envContent = readTemplate('src/common/env.ts')
  writeFile(params.cwd, 'src/common/env.ts', envContent)
}