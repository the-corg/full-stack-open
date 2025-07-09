const blog = require('../models/blog');

const dummy = blogs => 1;

const totalLikes = blogs => blogs.reduce((sum, blog) => sum + blog.likes, 0);

const favoriteBlog = blogs =>
  blogs.reduce((max, blog) => (max.likes < blog.likes ? blog : max), blogs[0]);

const mostBlogs = blogs =>
  Object.entries(
    blogs.reduce(
      (dict, blog) => (
        (dict[blog.author] = (dict[blog.author] || 0) + 1), dict
      ),
      {}
    )
  ).reduce(
    (max, current) =>
      current[1] > (max?.blogs ?? 0)
        ? { author: current[0], blogs: current[1] }
        : max,
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
