const blogsRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogsRouter.get('/', async (request, response) =>
  response.json(await Blog.find({}).populate('user', { username: 1, name: 1 }))
);

blogsRouter.post('/', async (request, response) => {
  const body = request.body;

  //console.log('Body: ', body);

  /*
  const user = await User.findById(body.userId);

  if (!user) {
    return response.status(400).json({ error: 'userId missing or not valid' });
  }*/

  const users = await User.find({});
  const user = users[0];

  //console.log('User: ', user);

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id,
  });

  //console.log('Blog: ', blog);

  const savedBlog = await blog.save();
  user.blogs = user.blogs.concat(savedBlog._id);
  await user.save();
  response.status(201).json(savedBlog);
});

blogsRouter.delete('/:id', async (request, response) => {
  await Blog.findByIdAndDelete(request.params.id);
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

module.exports = blogsRouter;
