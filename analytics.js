/* Vercel Web Analytics bootstrap. Queues calls made before the CDN script
   loads. Kept in a file rather than inline so the CSP can stay free of
   'unsafe-inline' for scripts. */
window.va = window.va || function () {
  (window.vaq = window.vaq || []).push(arguments);
};
