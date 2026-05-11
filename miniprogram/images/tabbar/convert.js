const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const tabbarDir = path.join(__dirname);

// 定义图标映射
const icons = {
  normal: {
    'house.svg': 'home.png',
    'clock.svg': 'history.png',
    'circle-user.svg': 'profile.png'
  },
  active: {
    'house.svg': 'home-active.png',
    'clock.svg': 'history-active.png',
    'circle-user.svg': 'profile-active.png'
  }
};

const colors = {
  normal: '#9CA3AF',  // 灰色
  active: '#2563EB'   // 蓝色
};

async function convertSvgToPng() {
  for (const [state, iconMap] of Object.entries(icons)) {
    const color = colors[state];
    
    for (const [svgFile, pngFile] of Object.entries(iconMap)) {
      const svgPath = path.join(tabbarDir, svgFile);
      const pngPath = path.join(tabbarDir, pngFile);
      
      if (fs.existsSync(svgPath)) {
        // 读取 SVG 并替换颜色
        let svgContent = fs.readFileSync(svgPath, 'utf8');
        
        // 替换颜色
        svgContent = svgContent.replace(/stroke="currentColor"/g, `stroke="${color}"`);
        svgContent = svgContent.replace(/fill="currentColor"/g, `fill="${color}"`);
        
        // 转换为 PNG
        await sharp(Buffer.from(svgContent))
          .resize(96, 96)
          .png()
          .toFile(pngPath);
        
        console.log(`Created: ${pngPath}`);
      }
    }
  }
  console.log('All tabbar icons converted!');
}

convertSvgToPng().catch(console.error);
