#!/usr/bin/env node

import { input, confirm } from "@inquirer/prompts"
import path from "path"
import fs, { mkdirSync, readFileSync, writeFileSync } from "fs"
import kleur from "kleur";
import { program } from "commander";
import { ExecException, exec } from "child_process";

program
  .option("--version")
  .option("-v")
  .action((str: string, opt) => {
    const options = program.opts()
    if (options.version || options.v) {
      const packageJsonPath = path.resolve(__dirname, "../package.json")
      const packageJson = JSON.parse(readFileSync(packageJsonPath, { encoding: 'utf-8' }));
      console.log(packageJson.version);
    }
  })

program
  .command('create')
  .description('create a new node+ts project')
  .argument('<string>', 'project name')
  .action((str: string, options) => {
    const firstCmd = program.commands[0]
    const projectName = firstCmd.args[0];
    build(projectName);
  });

program.parse();


async function build (projectName: string) {

  let cwd = process.cwd();

  cwd = path.resolve(cwd, projectName)

  if (fs.existsSync(cwd)) {
    console.log(kleur.red(`directory already exists: ${cwd} `));
    return;
  } else {
    mkdirSync(cwd);
  }

  const projectDescription = await input({ message: 'project description: ' })

  writePackageJson({ cwd, projectName, projectDescription });

  writeGitIgnore({ cwd })

  writeNpmIgnore({ cwd })

  const createLicense = await confirm({
    message: "Create LICENSE ?",
    default: true
  })

  if (createLicense) {
    const from = 2022
    const to = new Date().getFullYear()

    writeLicense({ cwd, from, to, projectName })
  }


  writeTsConfig({ cwd })

  writeReadme({ cwd, projectName })

  writeEnv({ cwd })

  writeIndex({ cwd, projectName })

  writeCommon({ cwd })

  const execGitInit = await confirm({
    message: "exec git init ?",
    default: true
  })

  if (execGitInit) {
    await execCmd(`cd ${cwd} && git init`)
  }

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

function execCmd (cmd: string) {
  return new Promise<{ success: boolean, message: string }>((resolve, reject) => {
    exec(cmd, (err: ExecException | null, stdout: string, stderr: string) => {
      if (err) {
        resolve({ success: false, message: err.message })
      } else {
        resolve({ success: true, message: stdout })
      }
    })
  })
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

function writeNpmIgnore (params: {
  cwd: string
}) {
  const content = readTemplate('.npmignore')
  writeFile(params.cwd, '.npmignore', content);
}

function writeLicense (params: {
  cwd: string,
  from: number,
  to: number,
  projectName: string
}) {
  let content = readTemplate('LICENSE')
  content = content.replace("{from}", String(params.from)).replace("{to}", String(params.to)).replace("{projectName}", params.projectName)
  writeFile(params.cwd, "LICENSE", content)
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