/** @type {import('next').NextConfig} */
const { i18n } = require("./i18.config")

const nextConfig = {
  i18n,
  reactStrictMode: true,
}

module.exports = nextConfig
