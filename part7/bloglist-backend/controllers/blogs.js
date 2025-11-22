const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');
const jwt = require('jsonwebtoken');
const { userExtractor } = require('../utils/middleware');

blogsRouter.get('/', async (request, response) =>
  response.json(await Blog.find({}).populate('user', { username: 1, name: 1 }))
);

blogsRouter.post('/', userExtractor, async (request, response) => {
  const body = request.body;
  const user = request.user;

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' });
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user;

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' });
  }

  const blogToDelete = await Blog.findById(request.params.id);
  if (!blogToDelete) return response.status(404).end();

  if (blogToDelete.user.toString() !== user.id.toString())
    return response.status(401).json({ error: 'deletion not authorized' });

  await Blog.findByIdAndDelete(request.params.id);
  user.blogs = user.blogs.filter(id => id.toString() !== request.params.id.toString());
  await user.save();
  response.status(204).end();
});

blogsRouter.put('/:id', async (request, response) => {
  const { title, author, url, likes } = request.body;

  const blogToUpdate = await Blog.findById(request.params.id);
  if (!blogToUpdate) return response.status(404).end();

  blogToUpdate.title = title;
  blogToUpdate.author = author;
  blogToUpdate.url = url;
  blogToUpdate.likes = likes;

  const updatedBlog = await blogToUpdate.save();

  response.json(updatedBlog);
});

blogsRouter.post('/:id/comments', async (request, response) => {
  const blog = await Blog.findById(request.params.id);
  if (!blog) return response.status(404).end();

  blog.comments = blog.comments.concat(request.body.text);

  const updatedBlog = await blog.save();
  response.status(201).json(updatedBlog);
});

module.exports = blogsRouter;
