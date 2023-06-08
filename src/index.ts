import { input } from "@inquirer/prompts"
import path from "path"
import fs, { mkdirSync, readFileSync, writeFileSync } from "fs"
import { getCurrentDirName } from "./utils"

const currentProjectName = getCurrentDirName();

async function build () {

  const cwd = process.cwd();

  let projectName = await input({ message: `project name: ${currentProjectName}` })
  projectName = projectName || currentProjectName;

  const projectDescription = await input({ message: 'project description: ' })

  writePageageJson({ cwd, projectName, projectDescription });

  writeGitIgnore({ cwd })

  writeTsConfig({ cwd })

  writeEnv({ cwd })

  writeIndex({ cwd, projectName })

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

function writePageageJson (params: {
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

function writeIndex (params: {
  cwd: string;
  projectName: string;
}) {
  const content = `export const projectName = "${params.projectName}"`;
  writeFile(params.cwd, 'src/index.ts', content)
}

build();
