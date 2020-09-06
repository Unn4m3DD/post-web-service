const path = require('path');
const fs = require('fs');
const shell = require('shelljs')
const express = require('express')
const fetch = require('node-fetch');
const app = express()

const repo_owner = "Unn4m3DD"
let global_ip;
fetch("https://ipecho.net/plain").then(async (res) => {
  global_ip = await res.text()
  console.log(`http://${global_ip}`)
})

let active_services = {}

let current_port = 3000

shell.cd(__dirname + path.sep + "..")

app.get('/add', (req, res) => {
  shell.exec(`git clone https://github.com/${repo_owner}/${req.query.repo}`)
  res.send(`https://github.com/${repo_owner}/${req.query.repo} cloned`)
})
app.get('/update', (req, res) => {
  const repo_path = __dirname + path.sep + ".." + path.sep + req.query.repo
  shell.cd(repo_path)
  shell.exec(`git pull`)
  const { setup, run } = JSON.parse(fs.readFileSync(path.resolve(repo_path, '.run.json')));
  shell.exec(setup)
  const systemd_service =
    `[Unit]\n` +
    `Description=${req.query.repo} Service\n` +
    `[Service]\n` +
    `ExecStart=/usr/bin/sh -c "cd ${repo_path} && PORT=${current_port} ${run}"\n`
  fs.writeFileSync(`/etc/systemd/system/${req.query.repo}.service`, systemd_service)
  active_services[req.query.repo] = current_port
  shell.exec(`sudo systemctl daemon-reload && sudo systemctl restart ${req.query.repo}`)
  res.send(`<a href="http://${global_ip}:${current_port}">${req.query.repo} updated</a>`)
  if (++current_port > 4000) current_port = 3000
})
app.get('/del', (req, res) => {
  const repo_path = __dirname + path.sep + ".." + path.sep + req.query.repo
  shell.exec(`sudo systemctl stop ${req.query.repo}`)
  shell.exec(`sudo rm -rf ${repo_path}`)
  res.send(`${deleted} up to date`)
})
app.get('/', (req, res) => {
  let result = ""
  for (let key in active_services) {
    result += `<a href="http://${global_ip}:${active_services[key]}">${key}</a>`
  }
  res.send(result)
})

app.listen(80)
