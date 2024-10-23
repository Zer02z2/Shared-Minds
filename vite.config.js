/** @type {import('vite').UserConfig} */

export default {
  server: {
    port: 2222,
  },
  root: "./src",
  publicDir: "../public",
  base: "/shared-minds/",
  build: {
    outDir: "../docs",
    rollupOptions: {
      input: {
        main: "/index.html",
        week1: "/week1/index.html",
        week2: "/week2/index.html",
        week3: "/week3/index.html",
        week4: "/week4/index.html",
        week7: "/week7/index.html",
      },
    },
  },
}
