const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

// const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateId(request, response, next) {
  const { id } = request.params
  
  if(!isUuid(id)) return response.status(400).json({ error: 'Invalid Repository ID' })

  next()
}

app.use('/repositories/:id', validateId)

app.get("/repositories", (request, response) => {
  return response.json(repositories)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  
  console.log(title, url, techs)
  
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0
  }
  
  repositories.push(repository)
  
  return response.json(repository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repository => repository.id === id)

  
  const likes = repositories[repositoryIndex].likes
  
  const updatedRepository = {
    id,
    title,
    url,
    techs,
    likes
  }
  
  repositories[repositoryIndex] = updatedRepository
  
  return response.json(updatedRepository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  
  if(repositoryIndex < 0 ) return response.status(400).json({ error: 'Repository Not Found' })
  
  repositories.splice(repositoryIndex, 1)
  
  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params
  
  const repositoryIndex = repositories.findIndex(repository => repository.id === id)
  
  if(repositoryIndex < 0 ) return response.json({ error: 'Repository Not Found' })

  const likes = repositories[repositoryIndex].likes + 1

  repositories[repositoryIndex].likes = likes
  
  return response.json(repositories[repositoryIndex])
});

module.exports = app;
