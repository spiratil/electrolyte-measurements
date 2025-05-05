import adapter from '@sveltejs/adapter-static';

const dev = process.env.NODE_ENV === 'development';

const config = {
	kit: {
		adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html', // important for SPAs
      precompress: false
    }),
		paths: {
      base: dev ? '' : '/electrolyte-measurements',
    },
		prerender: {
      crawl: true,
      entries: ['*']
    }
	}
};

export default config;
