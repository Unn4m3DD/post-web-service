# Post Web Service
Post Web Service is used to manage website publication automatically using git actions and a raspberry pi.

## How to use
It listens to GET requests on:  
`/add?repo="repo_name"` that adds a new repository to the list of published websites  
`/del?repo="repo_name"` that delestes a repository  
`/update?repo="repo_name"` that updates a repository  

Every repo added must contain a file named .run.json with 2 properties:  
"setup" that is a command that will be ran before trying to publish the server to the internet, usually used to download dependecies  
"run" that is the command to run the server  
Example of a .run.json file:  
```json
{
  "setup": "npm i",
  "run": "node src/index.js"
}
```
The program will set an environment variable (`PORT`) for the port on wich the service must run to be accessible.  

Integrated with github action or gitlab CI/CD it is trivial to automate a publish on push with a simple get request to this API  

## TODO
Add credentials to the get request so it can only be accessed by the owner  
