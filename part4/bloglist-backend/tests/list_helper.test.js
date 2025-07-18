const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');

const listWithOneBlog = [
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
    likes: 5,
    __v: 0,
  },
];

const listWithManyBlogs = [
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

describe('dummy', () =>
  test('returns one', () => assert.strictEqual(listHelper.dummy([]), 1)));

describe('the total likes', () => {
  test('equals zero for an empty list', () =>
    assert.strictEqual(listHelper.totalLikes([]), 0));

  test('equals the likes of the single blog, when the list has only one blog', () =>
    assert.strictEqual(listHelper.totalLikes(listWithOneBlog), 5));

  test('is calculated correctly for a bigger list', () =>
    assert.strictEqual(listHelper.totalLikes(listWithManyBlogs), 36));
});

describe('the favorite blog', () => {
  test('is undefined for an empty list', () =>
    assert.deepStrictEqual(listHelper.favoriteBlog([]), undefined));

  test('is the single blog, when the list has only one blog', () =>
    assert.deepStrictEqual(
      listHelper.favoriteBlog(listWithOneBlog),
      listWithOneBlog[0]
    ));

  test('is calculated correctly for a bigger list', () =>
    assert.deepStrictEqual(
      listHelper.favoriteBlog(listWithManyBlogs),
      listWithManyBlogs[2]
    ));
});

describe('the author with the most blogs', () => {
  test('is undefined for an empty list', () =>
    assert.deepStrictEqual(listHelper.mostBlogs([]), undefined));

  test('is the author of the single blog, when the list has only one blog', () =>
    assert.deepStrictEqual(listHelper.mostBlogs(listWithOneBlog), {
      author: listWithOneBlog[0].author,
      blogs: 1,
    }));

  test('is calculated correctly for a bigger list', () =>
    assert.deepStrictEqual(listHelper.mostBlogs(listWithManyBlogs), {
      author: 'Robert C. Martin',
      blogs: 3,
    }));
});

describe('the author with the most likes', () => {
  test('is undefined for an empty list', () =>
    assert.deepStrictEqual(listHelper.mostLikes([]), undefined));

  test('is the author of the single blog, when the list has only one blog', () =>
    assert.deepStrictEqual(listHelper.mostLikes(listWithOneBlog), {
      author: listWithOneBlog[0].author,
      likes: listWithOneBlog[0].likes,
    }));

  test('is calculated correctly for a bigger list', () =>
    assert.deepStrictEqual(listHelper.mostLikes(listWithManyBlogs), {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    }));
});
