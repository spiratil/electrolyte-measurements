import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

const config = {
	preprocess: vitePreprocess(),
	kit: {
		appDir: 'app', // Required as the default is _app
		adapter: adapter()
	}
};

export default config;
