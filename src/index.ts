import { input } from "@inquirer/prompts"
import { ExecException, exec } from "child_process"
import path from "path"
import fs from "fs"
import { getCurrentDirName } from "./utils"

const currentProjectName = getCurrentDirName();

async function build () {

  let projectName = await input({ message: `project name: ${currentProjectName} ?` })
  projectName = projectName || currentProjectName;

  console.log("setted project name: ", projectName)

  console.log(__dirname)

}

build();

// exec('git --version', (err: ExecException | null, stdout: string, stderr: string) => {
//   console.log(stdout)
// })

// input({ message: "Enter you name:" }).then(answer => {
//   console.log("you name:", answer)
// })