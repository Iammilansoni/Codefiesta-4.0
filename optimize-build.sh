# Performance Optimization Script for Hackathon Website

# Build with optimizations
echo "🚀 Building optimized production bundle..."
npm run build

# Check bundle size
echo "📊 Analyzing bundle size..."
npx vite-bundle-analyzer dist

# Run Lighthouse CI
echo "🔍 Running Lighthouse performance audit..."
npx @lhci/cli@latest autorun || echo "Lighthouse CI not configured - run manually"

# Check for large files
echo "📁 Checking for large assets..."
find dist -name "*.js" -size +500k -exec ls -lh {} \;
find dist -name "*.css" -size +100k -exec ls -lh {} \;
find dist -name "*.png" -size +1M -exec ls -lh {} \;
find dist -name "*.jpg" -size +1M -exec ls -lh {} \;

echo "✅ Build optimization complete!"
echo "🌐 Deploy to Vercel: vercel --prod"
echo "🏠 Local server: npm run preview"
