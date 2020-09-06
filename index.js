const path = require('path');
const fs = require('fs');
const shell = require('shelljs')
const express = require('express')
const app = express()

const repo_owner = "Unn4m3DD"

shell.cd(__dirname + path.sep + "..")

app.get('/clone', (req, res) => {
  shell.exec(`git clone https://github.com/${repo_owner}/${req.query.repo}`)
  res.send(`https://github.com/${repo_owner}/${req.query.repo} cloned`)
})
app.get('/pull', (req, res) => {
  const repo_path = __dirname + path.sep + ".." + path.sep + req.query.repo
  shell.cd(repo_path)
  shell.exec(`git pull`)
  const { setup, run } = JSON.parse(fs.readFileSync(path.resolve(repo_path, '.run.json')));
  shell.exec(setup)
  const systemd_service =
    `[Unit]
  Description=${req.query.repo} Service
  
  [Service]
  ExecStart=/usr/bin/sh -c "cd ${repo_path} && ${run}"`
  fs.writeFileSync(`/etc/systemd/system/${req.query.repo}.service`, systemd_service)

  res.send(`${req.query.repo} up to date`)

})
app.get('/del', (req, res) => {
})

app.listen(
  3000, () => {
    console.log("http://localhost:3000")
  }
)
