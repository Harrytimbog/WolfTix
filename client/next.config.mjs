/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { isServer }) => {
    // This check ensures the webpack configuration is only applied on the client side
    if (!isServer) {
      // Enable polling with a 300ms interval
      config.watchOptions = {
        ...config.watchOptions,
        poll: 300,
      };
    }

    return config;
  },
};

// module.exports = {
//   webpack: (config, { dev }) => {
//     if (dev) {
//       config.watchOptions = {
//         ignored: ["**/node_modules/"],
//         poll: 1000,
//       };
//     }

//     return config;
//   },
// };

export default nextConfig;
