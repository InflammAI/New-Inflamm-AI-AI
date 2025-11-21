import { motion } from 'framer-motion';

const blogPosts = [
  {
    id: 1,
    title: 'The Future of Digital Health: Trends to Watch in 2025',
    excerpt: 'Explore the latest advancements in digital health technology and how they\'re transforming patient care.',
    category: 'Digital Health',
    date: 'October 28, 2025',
    readTime: '5 min read',
    image: '/images/health-tech.jpg'
  },
  {
    id: 2,
    title: 'Understanding Inflammation: Causes and Natural Remedies',
    excerpt: 'Learn about the science behind inflammation and discover natural ways to reduce it through diet and lifestyle changes.',
    category: 'Wellness',
    date: 'October 25, 2025',
    readTime: '7 min read',
    image: '/images/inflammation.jpg'
  },
  {
    id: 3,
    title: 'The Role of AI in Personalized Medicine',
    excerpt: 'How artificial intelligence is revolutionizing the way we approach personalized treatment plans and healthcare delivery.',
    category: 'AI in Healthcare',
    date: 'October 20, 2025',
    readTime: '6 min read',
    image: '/images/ai-medicine.jpg'
  },
];

export function BlogSection() {
  return (
    <div className="py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Health & Wellness Blog
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-xl text-gray-500 sm:mt-4">
            Stay informed with the latest health tips, research, and news
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post, index) => (
            <motion.article
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex flex-col overflow-hidden rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex-shrink-0 h-48 bg-gray-200 overflow-hidden">
                <div className="h-full w-full bg-gradient-to-r from-orange-100 to-yellow-100 flex items-center justify-center text-gray-400">
                  <span className="text-sm">Featured Image: {post.image?.split('/').pop()?.split('.')[0]}</span>
                </div>
              </div>
              <div className="flex-1 p-6 flex flex-col justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-orange-600">
                    {post.category}
                  </p>
                  <a href="#" className="block mt-2">
                    <h3 className="text-xl font-semibold text-gray-900 hover:text-orange-500 transition-colors">
                      {post.title}
                    </h3>
                    <p className="mt-3 text-base text-gray-500">
                      {post.excerpt}
                    </p>
                  </a>
                </div>
                <div className="mt-6 flex items-center">
                  <div>
                    <div className="flex space-x-1 text-sm text-gray-500">
                      <time dateTime="2025-10-28">{post.date}</time>
                      <span aria-hidden="true">·</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        <div className="mt-12 text-center">
          <a
            href="#"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-orange-500 to-yellow-500 hover:from-orange-600 hover:to-yellow-600"
          >
            View All Articles
            <svg
              className="ml-3 -mr-1 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </a>
        </div>
      </div>
    </div>
  );
}
