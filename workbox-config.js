module.exports = {
  globDirectory: 'public/',
  globPatterns: ['**/*.{ico,html,json,css,,js}', 'src/images/*.{jpg,png}'],
  swSrc: 'public/sw-base.js',
  swDest: 'public/service-worker.js',
  globIgnores: ['help/**']
};

// * means only inside a folder not in a subfolder
// ** means cache inside folder as well as subfolder
