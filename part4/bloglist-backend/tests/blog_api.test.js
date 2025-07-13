const { test, describe, after, beforeEach } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const Blog = require('../models/blog');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const app = require('../app');

const api = supertest(app);

const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0,
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0,
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0,
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0,
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0,
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0,
  },
];

describe('integration testing', () => {
  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('password123', 10);
    const user = new User({ username: 'root', passwordHash });
    await user.save();

    await Blog.deleteMany({});
    await Blog.insertMany(initialBlogs);
  });

  test('blogs are returned as json', async () =>
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/));

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');

    assert.strictEqual(response.body.length, initialBlogs.length);
  });

  test('a specific blog is among the returned blogs', async () => {
    const response = await api.get('/api/blogs');

    const titles = response.body.map(blog => blog.title);
    assert(titles.includes('Canonical string reduction'));
  });

  test('the unique identifier property of the blog posts is named id and not _id', async () => {
    const response = await api.get('/api/blogs');

    const blogs = response.body;
    assert('id' in blogs[0]);
    assert(!('_id' in blogs[0]));
  });

  describe('adding...', () => {
    test('a valid blog can be added', async () => {
      const newBlog = {
        title: 'Exploits of a Mom',
        author: 'xkcd',
        url: 'https://xkcd.com/327/',
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const response = await api.get('/api/blogs');

      const titles = response.body.map(blog => blog.title);

      assert.strictEqual(response.body.length, initialBlogs.length + 1);

      assert(titles.includes('Exploits of a Mom'));
    });

    test('if the likes property is missing, it defaults to 0', async () => {
      const newBlog = {
        title: 'Exploits of a Mom',
        author: 'xkcd',
        url: 'https://xkcd.com/327/',
      };

      await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const response = await api.get('/api/blogs');

      const addedBlog = response.body.find(
        blog => blog.title === 'Exploits of a Mom'
      );

      assert.strictEqual(addedBlog.likes, 0);
    });

    test('if the title property is missing, the backend responds with the status code 400 Bad Request', async () => {
      const newBlog = {
        author: 'xkcd',
        url: 'https://xkcd.com/327/',
      };

      await api.post('/api/blogs').send(newBlog).expect(400);
    });

    test('if the url property is missing, the backend responds with the status code 400 Bad Request', async () => {
      const newBlog = {
        title: 'Exploits of a Mom',
        author: 'xkcd',
      };

      await api.post('/api/blogs').send(newBlog).expect(400);
    });
  });

  describe('deleting...', () => {
    test('succeeds with the status code 204 if the id is valid', async () => {
      const responseAtStart = await api.get('/api/blogs');
      const blogsAtStart = responseAtStart.body;
      const blogToDelete = blogsAtStart[0];

      await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204);

      const responseAtEnd = await api.get('/api/blogs');
      const blogsAtEnd = responseAtEnd.body;

      const titles = blogsAtEnd.map(blog => blog.title);
      assert(!titles.includes(blogToDelete.title));

      assert.strictEqual(blogsAtEnd.length, initialBlogs.length - 1);
    });
  });

  describe('updating...', () => {
    test('succeeds with the status code 200 if the id is valid', async () => {
      const responseAtStart = await api.get('/api/blogs');
      const blogsAtStart = responseAtStart.body;
      const blogToUpdate = blogsAtStart[0];

      blogToUpdate.title += ', now with more coolness';
      blogToUpdate.url += '?coolversion=true';
      blogToUpdate.likes += 100500;
      if (blogToUpdate.author)
        blogToUpdate.author += ', the coolest author ever';

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const response = await api.get('/api/blogs');
      const blogsAtEnd = response.body;

      const updatedBlog = blogsAtEnd.find(
        blog => blog.title === blogToUpdate.title
      );

      assert.strictEqual(updatedBlog.url, blogToUpdate.url);
      assert.strictEqual(updatedBlog.author, blogToUpdate.author);
      assert.strictEqual(updatedBlog.likes, blogToUpdate.likes);
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
    });

    test('fails with the status code 404 if the id is not found', async () => {
      const tempBlog = new Blog({ title: 'temporary', url: 'https://tmp.com' });
      await tempBlog.save();
      await tempBlog.deleteOne();

      const nonExistentId = tempBlog.id.toString();

      await api.put(`/api/blogs/${nonExistentId}`).send(tempBlog).expect(404);
    });

    test('if the likes property is missing, it defaults to 0', async () => {
      const responseAtStart = await api.get('/api/blogs');
      const blogsAtStart = responseAtStart.body;
      const blogToUpdate = blogsAtStart[0];

      delete blogToUpdate.likes;

      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(blogToUpdate)
        .expect(200)
        .expect('Content-Type', /application\/json/);

      const response = await api.get('/api/blogs');
      const blogsAtEnd = response.body;

      const updatedBlog = blogsAtEnd.find(
        blog => blog.title === blogToUpdate.title
      );

      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length);
      assert.strictEqual(updatedBlog.likes, 0);
    });
  });
});

describe('when there is initially one user in the database', () => {
  beforeEach(async () => {
    await User.deleteMany({});

    const passwordHash = await bcrypt.hash('password123', 10);
    const user = new User({ username: 'root', passwordHash });

    await user.save();
  });

  test('creation of a new user succeeds', async () => {
    const responseAtStart = await api.get('/api/users');
    const usersAtStart = responseAtStart.body;

    const newUser = {
      username: 't800',
      name: 'Arnold Schwarzenegger',
      password: 'xxx',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const responseAtEnd = await api.get('/api/users');
    const usersAtEnd = responseAtEnd.body;

    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    assert(usernames.includes(newUser.username));
  });

  test('creation fails with the correct status code and message if the username is already taken', async () => {
    const responseAtStart = await api.get('/api/users');
    const usersAtStart = responseAtStart.body;

    const newUser = {
      username: 'root',
      name: 'Arnold Schwarzenegger',
      password: 'hastalavistababy',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const responseAtEnd = await api.get('/api/users');
    const usersAtEnd = responseAtEnd.body;

    assert(result.body.error.includes('expected `username` to be unique'));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with the correct status code and message if the username is missing', async () => {
    const responseAtStart = await api.get('/api/users');
    const usersAtStart = responseAtStart.body;

    const newUser = {
      name: 'Arnold Schwarzenegger',
      password: 'hastalavistababy',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const responseAtEnd = await api.get('/api/users');
    const usersAtEnd = responseAtEnd.body;

    assert(result.body.error.includes('`username` is required'));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with the correct status code and message if the password is missing', async () => {
    const responseAtStart = await api.get('/api/users');
    const usersAtStart = responseAtStart.body;

    const newUser = {
      username: 't800',
      name: 'Arnold Schwarzenegger',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const responseAtEnd = await api.get('/api/users');
    const usersAtEnd = responseAtEnd.body;

    assert(result.body.error.includes('`password` is required'));
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with the correct status code and message if the username is shorter than 3 characters', async () => {
    const responseAtStart = await api.get('/api/users');
    const usersAtStart = responseAtStart.body;

    const newUser = {
      username: 'tt',
      name: 'Arnold Schwarzenegger',
      password: 'hastalavistababy',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const responseAtEnd = await api.get('/api/users');
    const usersAtEnd = responseAtEnd.body;

    assert(
      result.body.error.includes(
        '`username` (`' +
          newUser.username +
          '`) is shorter than the minimum allowed length (3)'
      )
    );
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });

  test('creation fails with the correct status code and message if the password is shorter than 3 characters', async () => {
    const responseAtStart = await api.get('/api/users');
    const usersAtStart = responseAtStart.body;

    const newUser = {
      username: 't800',
      name: 'Arnold Schwarzenegger',
      password: 'pw',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    const responseAtEnd = await api.get('/api/users');
    const usersAtEnd = responseAtEnd.body;

    assert(
      result.body.error.includes(
        '`password` is shorter than the minimum allowed length (3)'
      )
    );
    assert.strictEqual(usersAtEnd.length, usersAtStart.length);
  });
});

after(async () => await mongoose.connection.close());
