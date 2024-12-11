export default function decorateBlogs(container) {
  if (!container) {
    console.error("Blog container not found!");
    return;
  }

  const heading = document.createElement('h2');
  heading.textContent = "Related Blogs";
  heading.classList.add('blog-heading');
  container.parentElement.insertBefore(heading, container);

  const blogs = [...container.children];

  blogs.forEach((blog) => {
    const meta = blog.querySelector('p');
    const title = blog.querySelector('h3');

    if (meta && title) {
      blog.classList.add('styled-blog');
      meta.classList.add('blog-meta');
      title.classList.add('blog-title');
    } else {
      blog.remove();
    }
  });
}
