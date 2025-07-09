const blog = require('../models/blog');

const dummy = blogs => 1;

const totalLikes = blogs => blogs.reduce((sum, { likes }) => sum + likes, 0);

const favoriteBlog = blogs =>
  blogs.reduce((max, blog) => (max.likes < blog.likes ? blog : max), blogs[0]);

const mostBlogs = blogs =>
  Object.entries(
    blogs.reduce(
      (dict, { author }) => ((dict[author] = (dict[author] || 0) + 1), dict),
      {}
    )
  ).reduce(
    (max, [author, blogs]) =>
      blogs > (max?.blogs ?? 0) ? { author, blogs } : max,
    undefined
  );

/*const mostBlogs = blogs => {
  if (blogs.length === 0) return undefined

  let authors = {}
  let max = { author: '', blogs: 0 }

  blogs.forEach(blog => {
    let newValue = (authors[blog.author] || 0) + 1
    authors[blog.author] = newValue

    if (newValue > max.blogs) {
      max.blogs = newValue
      max.author = blog.author
    }
  })

  return max
}*/

const mostLikes = blogs =>
  Object.entries(
    blogs.reduce(
      (dict, { author, likes }) => (
        (dict[author] = (dict[author] || 0) + likes), dict
      ),
      {}
    )
  ).reduce(
    (max, [author, likes]) =>
      likes > (max?.likes ?? 0) ? { author, likes } : max,
    undefined
  );

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
