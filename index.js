const path = require('path');
const fs = require('fs');
const shell = require('shelljs')
const express = require('express')
const app = express()

const repo_owner = "Unn4m3DD"
let global_ip;
externalip((err, ip) => {
  global_ip = ip
  console.log(`http://${global_ip}`)
})

let active_services = {}

let current_port = 3000



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
    `[Unit]\n` +
    `Description=${req.query.repo} Service\n` +
    `[Service]\n` +
    `ExecStart=/usr/bin/sh -c "PORT=${current_port} && cd ${repo_path} && ${run}"\n`
  fs.writeFileSync(`/etc/systemd/system/${req.query.repo}.service`, systemd_service)
  active_services[req.query.repo] = current_port++
  if (current_port > 4000) current_port = 3000
  res.send(`${req.query.repo} up to date`)

})
app.get('/del', (req, res) => {
})
app.get('/list', (req, res) => {
  let result = ""
  for (let key in active_services) {
    result += `<a href="http://${global_ip}:${active_services[key]}">${key}</a>`
  }
  res.send(result)
})

app.listen(80)
