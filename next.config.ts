import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

// Явно указываем путь до нашего файла i18n
const withNextIntl = createNextIntlPlugin('./src/i18n.ts');

const nextConfig: NextConfig = {
  reactCompiler: true,
};

export default withNextIntl(nextConfig);
