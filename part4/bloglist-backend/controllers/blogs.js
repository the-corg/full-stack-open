const blogsRouter = require('express').Router();
const Blog = require('../models/blog');

blogsRouter.get('/', async (request, response) =>
  response.json(await Blog.find({}))
);

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body);

  blog.save().then(result => response.status(201).json(result));
});

module.exports = blogsRouter;
