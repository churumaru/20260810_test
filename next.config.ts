import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // スマホ実機（同一Wi-Fi）から開発サーバーへアクセスする場合の許可
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*", "*.local"],
};

export default nextConfig;
