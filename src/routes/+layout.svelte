<script lang="ts">
  import { themeChange } from 'theme-change'
  import { onMount } from 'svelte';
  import logo from '$lib/assets/images/logo.png'
  import { pageId } from './stores.ts'
  pageId.set('home');

  let { children } = $props();
  let themeCol = '';
  let isLoaded = $state(false);

  // Once the page has loaded, set the defaults
  onMount(() => {
    isLoaded = true;
    themeChange(false);
    
    // Update the theme color switcher to match the state of the current theme
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      themeCol = 'dark';
      document.querySelector('svg[data-set-theme="light"]')?.classList.remove('swap-on');
      document.querySelector('svg[data-set-theme="light"]')?.classList.add('swap-off');
      document.querySelector('svg[data-set-theme="dark"]')?.classList.remove('swap-off');
      document.querySelector('svg[data-set-theme="dark"]')?.classList.add('swap-on');
      (document.querySelector('svg[data-set-theme="light"]') as HTMLElement).style.zIndex = '900';
      (document.querySelector('svg[data-set-theme="dark"]') as HTMLElement).style.zIndex = '800';
    }
  })

  // Update the page selected and store to allow +page.svelte to update the displayed content
  function switchPage(newId: string) {
    document.querySelector(`#${newId}-button`)?.classList.toggle('inactive');
    pageId.set(newId);
  }

  function changeTheme() {
    if (themeCol == 'dark') {
      themeCol = 'light';
      document.querySelector('html')?.setAttribute('data-theme', 'light');
      (document.querySelector('svg[data-set-theme="dark"]') as HTMLElement).style.zIndex = '900';
      (document.querySelector('svg[data-set-theme="light"]') as HTMLElement).style.zIndex = '800';
    }
    else {
      themeCol = 'dark'
      document.querySelector('html')?.setAttribute('data-theme', 'dark');
      (document.querySelector('svg[data-set-theme="light"]') as HTMLElement).style.zIndex = '900';
      (document.querySelector('svg[data-set-theme="dark"]') as HTMLElement).style.zIndex = '800';
    }
  }
</script>

<!--Display the header-->
<div class="min-h-screen flex flex-col">
  <div class="navbar bg-base-300 shadow-xl sticky top-0 z-999">
    <!--Display the site logo and title-->
    <div class="navbar-start">
      <button class="flex items-center gap-1 cursor-pointer lg:transition transition-discrete transform hover:scale-y-105 hover:scale-x-105 lg:mx-5 font-bold text-5xl" onclick={() => switchPage('home')}>
        <img class="max-w-13 lg:max-w-10" src={logo} alt="Logo"/>
        <div class="lg:hidden"><span class="text-primary">E</span><span class="text-secondary">S</span><span class="text-accent">C</span></div>
        <h1 class="hidden lg:block text-3xl font-bold font-oswald"><span class="text-primary">Electrolyte</span> <span class="text-secondary">Solution</span> <span class="text-accent">Calculator</span></h1>
      </button>
    </div>
    <div class="navbar-center hidden lg:flex">
      
    <!--Display the theme color switcher and Github link-->
    </div>
    <div class="navbar-end flex lg:mr-3">
      <!--Github icon-->
      <div class="h-10 w-10 mr-3">
        <a class="" href="https://github.com/spiratil/electrolyte-measurements" aria-label="github">
          <svg class="fill-secondary hover:fill-accent lg:transition transition-discrete transform hover:scale-y-110 hover:scale-x-110" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 105 105"><path d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z"/></svg>
        </a>
      </div>
      <label class="swap swap-rotate lg:transition transition-discrete transform hover:scale-y-110 hover:scale-x-110">
        <input type="checkbox" name="theme-changer" onclick={changeTheme}/>
      
        <!--Sun icon-->
        <svg data-set-theme="light"
          class="swap-on h-10 w-10 fill-secondary hover:fill-accent"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
          <path
            d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
        </svg>
      
        <!--Moon icon-->
        <svg data-set-theme="dark"
          class="swap-off h-10 w-10 fill-secondary hover:fill-accent"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24">
          <path
            d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
        </svg>
      </label>
    </div>
  </div>

  <!--Display a loading ring until the data is available and then load all +page.svelte content-->
  {#if !isLoaded}
    <span class="loading loading-ring loading-3xl bg-base-100 flex flex-col justify-center items-center pb-15 flex-1"></span>
  {:else}
    <div id="page-container" class="bg-base-100 flex flex-col justify-center items-center pb-15 flex-1">
      {@render children()}
    </div>
  {/if}

  <!--Display the dock at the bottom of the page-->
  <div class="dock lg:dock-xl shadow-xl z-999 bg-base-300">
    <!--Home icon-->
    <button id="home-button" class="flex flex-col gap-1 items-center {$pageId == 'home' ? 'active-link' : ''}" onclick={() => switchPage('home')}>
      <svg class="fill-base-content scale-120" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="m16 2.672-5.331 5.331V5.87H6.404v6.398l-3.755 3.755.754.754L16 4.18l12.597 12.597.754-.754L16 2.672zM7.47 6.937h2.132v2.132l-2.133 2.133V6.937z"/><path d="M6.404 16.533v12.795h7.464v-7.464h4.265v7.464h7.464V16.533l-9.596-9.596-9.596 9.596zM24.53 28.262h-5.331v-7.464h-6.398v7.464H7.47V16.975L16 8.445l8.53 8.53v11.287z"/></svg>
      <span class="dock-label">Home</span>
    </button>
    
    <!--Nutrients icon-->
    <button id="nutrients-button" class="{$pageId == 'nutrients' ? 'active-link' : ''}" onclick={() => switchPage('nutrients')}>
      <svg class="fill-base-content" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 512 512"><path d="M437.016 74.979C388.663 26.628 324.377 0 256 0S123.337 26.628 74.984 74.979C26.63 123.331 0 187.619 0 256c0 68.37 26.63 132.653 74.984 181.01C123.34 485.368 187.626 512 256 512s132.66-26.632 181.016-74.99C485.37 388.653 512 324.37 512 256c0-68.381-26.63-132.669-74.984-181.021zM256 491.922C125.912 491.922 20.078 386.088 20.078 256S125.912 20.078 256 20.078 491.922 125.912 491.922 256 386.088 491.922 256 491.922z"/><path d="M396.549 189.742h-74.29v-74.291c0-5.545-4.495-10.039-10.039-10.039H199.78c-5.545 0-10.039 4.495-10.039 10.039v74.29h-74.29c-5.545 0-10.039 4.495-10.039 10.039v112.44c0 5.545 4.495 10.039 10.039 10.039h74.29v74.29c0 5.545 4.495 10.039 10.039 10.039h112.44c5.545 0 10.039-4.495 10.039-10.038v-74.29h74.29c5.545 0 10.039-4.495 10.039-10.039v-112.44c0-5.544-4.494-10.039-10.039-10.039zM386.51 302.18h-74.29c-5.545 0-10.039 4.495-10.039 10.039v74.29H209.82V312.22c0-5.545-4.495-10.039-10.039-10.039h-74.29V209.82h74.29c5.545 0 10.039-4.495 10.039-10.039V125.49h92.361v74.29c0 5.545 4.495 10.039 10.039 10.039h74.29v92.361zM339.162 55.675c-26.38-10.964-54.36-16.523-83.162-16.523-5.545 0-10.039 4.495-10.039 10.039 0 5.545 4.495 10.039 10.039 10.039 26.144 0 51.531 5.042 75.457 14.986a10.02 10.02 0 0 0 3.849.771c3.934 0 7.67-2.328 9.273-6.189 2.128-5.119-.297-10.994-5.417-13.123zM443.859 147.621c-18.393-31.814-44.766-58.643-76.268-77.585-4.752-2.857-10.919-1.322-13.777 3.429-2.857 4.752-1.321 10.92 3.43 13.777 59.815 35.966 95.524 99.053 95.524 168.758 0 5.545 4.495 10.039 10.039 10.039s10.039-4.495 10.039-10.039c.001-38.101-10.022-75.578-28.987-108.379z"/></svg>
      <span class="dock-label">Nutrients</span>
    </button>

    <!--Products icon-->
    <button id="products-button" class="{$pageId == 'products' ? 'active-link' : ''}" onclick={() => switchPage('products')}>
      <svg class="fill-base-content" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 512 512"><path d="M255.916 38.149c-5.545 0-10.039 4.496-10.039 10.039v63.247c0 5.544 4.495 10.039 10.039 10.039 5.545 0 10.039-4.496 10.039-10.039V48.188c0-5.543-4.495-10.039-10.039-10.039zM215.926 38.149c-5.545 0-10.039 4.496-10.039 10.039v63.247c0 5.544 4.495 10.039 10.039 10.039 5.545 0 10.039-4.496 10.039-10.039V48.188c.001-5.543-4.494-10.039-10.039-10.039zM175.936 38.149c-5.545 0-10.039 4.496-10.039 10.039v63.247c0 5.544 4.495 10.039 10.039 10.039 5.545 0 10.039-4.496 10.039-10.039V48.188c0-5.543-4.494-10.039-10.039-10.039zM335.895 38.149c-5.545 0-10.039 4.496-10.039 10.039v63.247c0 5.544 4.495 10.039 10.039 10.039s10.039-4.496 10.039-10.039V48.188c0-5.543-4.494-10.039-10.039-10.039zM295.905 38.149c-5.544 0-10.039 4.496-10.039 10.039v63.247c0 5.544 4.496 10.039 10.039 10.039 5.544 0 10.039-4.496 10.039-10.039V48.188c0-5.543-4.495-10.039-10.039-10.039z"/><path d="m396.201 149.206.026-107.134C396.228 18.874 377.354 0 354.154 0h-196.45c-23.199 0-42.072 18.874-42.072 42.069l-.026 107.248c-14.982 8.694-25.085 24.902-25.085 43.436v269.051c0 27.678 22.518 50.196 50.196 50.196h230.567c27.678 0 50.196-22.518 50.196-50.196V192.753c-.002-18.613-10.191-34.879-25.279-43.547zM135.71 42.072c0-12.127 9.867-21.994 21.994-21.994h196.451c12.127 0 21.994 9.867 21.994 21.991l-.024 100.466H135.686l.024-100.463zM401.4 201.816h-43.983c-5.545 0-10.039 4.496-10.039 10.039 0 5.544 4.495 10.039 10.039 10.039h43.827v180.678H237.611V221.895h67.372c5.544 0 10.039-4.496 10.039-10.039 0-5.544-4.496-10.039-10.039-10.039h-77.411c-5.544 0-10.039 4.496-10.039 10.039v200.756c0 5.544 4.496 10.039 10.039 10.039H401.4v39.153c0 16.607-13.511 30.118-30.118 30.118H140.716c-16.607 0-30.118-13.511-30.118-30.118V192.753c0-16.607 13.511-30.118 30.118-30.118h230.567c16.607 0 30.118 13.511 30.118 30.118v9.063z"/><path d="M355.569 302.194h-26.102v-26.102c0-5.544-4.496-10.039-10.039-10.039-5.545 0-10.039 4.495-10.039 10.039v26.102h-26.102c-5.544 0-10.039 4.496-10.039 10.039 0 5.544 4.496 10.039 10.039 10.039h26.102v26.102c0 5.544 4.496 10.039 10.039 10.039 5.544 0 10.039-4.496 10.039-10.039v-26.102h26.102c5.544 0 10.039-4.496 10.039-10.039 0-5.543-4.495-10.039-10.039-10.039zM151.513 181.71c-5.545 0-10.039 4.495-10.039 10.039v22.086c0 5.545 4.495 10.039 10.039 10.039s10.039-4.495 10.039-10.039v-22.086c0-5.545-4.496-10.039-10.039-10.039zM151.513 235.922c-5.545 0-10.039 4.495-10.039 10.039v132.518c0 5.544 4.495 10.039 10.039 10.039s10.039-4.496 10.039-10.039V245.961c0-5.545-4.496-10.039-10.039-10.039z"/></svg>
      <span class="dock-label">Products</span>
    </button>

    <!--Solutions icon-->
    <button id="solutions-button" class="{$pageId == 'solutions' ? 'active-link' : ''}" onclick={() => switchPage('solutions')}>
      <svg class="fill-base-content" xmlns="http://www.w3.org/2000/svg" xml:space="preserve" viewBox="0 0 512 512"><path d="M458.152 456.313a10.242 10.242 0 0 0-.713-1.289L326.341 254.426V58.227h11.981c5.545 0 10.039-4.495 10.039-10.039V10.039C348.361 4.495 343.866 0 338.322 0H173.679c-5.545 0-10.039 4.495-10.039 10.039v38.149c0 5.545 4.495 10.039 10.039 10.039h13.329v193.267L54.549 455.041c-.265.407-.5.833-.704 1.275-6.456 14.01-6.239 28.166.593 38.838C61.294 505.859 74.126 512 89.643 512h332.716c15.518 0 28.35-6.141 35.205-16.849 6.831-10.671 7.046-24.829.588-38.838zM183.718 38.149V20.078h144.565v18.071H183.718zm256.935 446.178c-3.136 4.898-9.633 7.595-18.294 7.595H89.643c-8.662 0-15.159-2.698-18.295-7.596-3.029-4.732-2.865-11.452.45-18.979l26.261-40.353h204.656c5.545 0 10.039-4.496 10.039-10.039 0-5.545-4.495-10.039-10.039-10.039h-191.59l94.338-144.965a10.042 10.042 0 0 0 1.625-5.475V58.227h99.175v199.188c0 1.951.568 3.859 1.635 5.492l132.307 202.447c3.312 7.525 3.476 14.243.448 18.973z"/><path d="M230.232 117.459c-5.545 0-10.039 4.495-10.039 10.039v112.439c0 5.545 4.495 10.039 10.039 10.039 5.545 0 10.039-4.495 10.039-10.039V127.498c.001-5.545-4.494-10.039-10.039-10.039zM230.232 64.42c-5.545 0-10.039 4.495-10.039 10.039v22.784c0 5.545 4.495 10.039 10.039 10.039 5.545 0 10.039-4.495 10.039-10.039V74.459c.001-5.545-4.494-10.039-10.039-10.039zM380.655 404.915h-47.686c-5.545 0-10.039 4.495-10.039 10.039s4.495 10.039 10.039 10.039h47.686c5.545 0 10.039-4.496 10.039-10.039 0-5.545-4.494-10.039-10.039-10.039z"/></svg>
      <span class="dock-label">Solution</span>
    </button>
  </div>
</div>

<style>
  .active-link, .active-link span {
    color: var(--color-secondary);
  }

  .active-link svg {
    fill: var(--color-secondary);
  }

  .dock button:not(.active-link):hover svg  {
    fill: var(--color-accent)
  }

  .dock button:not(.active-link):hover {
    color: var(--color-accent)
  }
</style>