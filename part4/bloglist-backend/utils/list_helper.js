const dummy = blogs => 1

const totalLikes = blogs => blogs.reduce((sum, blog) => sum + blog.likes, 0)

const favoriteBlog = blogs =>
  blogs.reduce((max, blog) => (max.likes < blog.likes ? blog : max), blogs[0])

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
