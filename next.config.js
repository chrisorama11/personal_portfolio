// next.config.js
const withMDX = require('@next/mdx')({
    extension: /\.mdx?$/
  })
  
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    pageExtensions: ['ts', 'tsx', 'mdx'], // so Next can treat .mdx files as pages
  }
  
  module.exports = withMDX(nextConfig)
  