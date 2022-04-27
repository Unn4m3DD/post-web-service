import path from 'path';
import fs from 'fs';
import shell from 'shelljs'
import express from 'express'
import { RepoMeta } from '../types';

const app = express()

const hashCode = function (s: string) {
  var h = 0, l = s.length, i = 0;
  if (l > 0)
    while (i < l)
      h = (h << 5) - h + s.charCodeAt(i++) | 0;
  return ((Math.abs(h)) % 10000) + 1000;
};
let active_services: RepoMeta[] = []

const repo_update = async (repo: string) => {
  if (repo == "post-web-service") return
  const repo_path = __dirname + path.sep + ".." + path.sep + repo
  shell.cd(repo_path)
  const git_status = shell.exec(`git pull --no-rebase`).stdout
  const { setup, run, title, subtitle, image, video } = JSON.parse(fs.readFileSync(path.resolve(repo_path, '.run.json')).toString());
  if (git_status.indexOf("up to date") == -1 && setup != "")
    //if (setup != "")
    shell.exec(setup)
  console.log("setup for " + repo + " done");
  if (
    !fs.existsSync(`/etc/nginx/include/${repo}.conf`) ||
    process.argv[2] == "--certificate"
  ) {
    const nginx_config =
      `
server {
  listen 80;
  server_name ${repo}.unn4m3dd.xyz;
  location / {
      proxy_pass http://localhost:${hashCode(repo)};
  }
}
`
    fs.writeFileSync(`/etc/nginx/include/${repo}.conf`, nginx_config)
    console.log("nginx config written to " + `/etc/nginx/include/${repo}.conf`)
    shell.exec(`sudo certbot --nginx -d ${repo}.unn4m3dd.xyz`)
  }
  const systemd_service =
    `[Unit]\n` +
    `Description=${repo} Service\n` +
    `[Service]\n` +
    `ExecStart=/usr/bin/sh -c "cd ${repo_path} && PORT=${hashCode(repo)} ${run}"\n`
  fs.writeFileSync(`/etc/systemd/system/${repo}.service`, systemd_service)
  console.log("systemd config written to " + `/etc/systemd/system/${repo}.service`)

  active_services.push({
    repo,
    title,
    subtitle,
    image,
    video
  })
  shell.exec(`sudo systemctl daemon-reload && sudo systemctl restart ${repo} && sudo systemctl restart nginx`)

  if (++current_port > 2000) current_port = 1000
}


const repo_owner = "Unn4m3DD"
let global_ip = "unn4m3dd.xyz";


let current_port = 1000
app.post('/repo', (req, res) => {
  shell.cd(__dirname + path.sep + "..")
  shell.exec(`echo "\n" | git clone git@github.com:${repo_owner}/${req.query.repo}`)
  res.send(`https://github.com/${repo_owner}/${req.query.repo} cloned`)
})

app.patch('/repo', async (req, res) => {
  await repo_update(req.query.repo as string)
  res.send(`<a href="http://${global_ip}:${current_port - 1}">${req.query.repo} updated</a>`)
})
app.delete('/repo', (req, res) => {
  const repo_path = __dirname + path.sep + ".." + path.sep + req.query.repo
  shell.exec(`sudo systemctl stop ${req.query.repo}`)
  shell.exec(`sudo rm -rf ${repo_path}`)
  res.send(` up to date`)
})
app.get('/repos', (req, res) => {
  res.send(active_services)
})

app.listen(process.env.PORT || 8000, () => {
  console.info(`listening on port ${app}`)
})
// for (let i of fs.readdirSync(__dirname + path.sep + "..").filter(e => e != "post-web-service"))
//   repo_update(i)
