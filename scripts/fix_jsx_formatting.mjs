import fs from 'fs';
import path from 'path';

const filePath = path.resolve('c:/Users/Asus/Desktop/Nandankanan1/Nandankanan-Wildlife/frontend/src/components/LiveCameraPlayer.jsx');
let src = fs.readFileSync(filePath, 'utf8');

// 1. Remove space after opening angle bracket: < div -> <div, < main -> <main, < span -> <span, etc.
src = src.replace(/< ([a-zA-Z0-9_]+)/g, '<$1');

// 2. Fix closing tags with spaces: </ header > -> </header>
src = src.replace(/<\/ ([a-zA-Z0-9_]+) >/g, '</$1>');

// 3. Fix aria-label with spaces: aria - label -> aria-label
src = src.replace(/aria\s*-\s*label/g, 'aria-label');

// 4. Fix attribute spacing: className = "..." -> className="..." and attribute = {...} -> attribute={...}
src = src.replace(/([a-zA-Z0-9_-]+)\s+=\s+([{"'`])/g, '$1=$2');

// 5. Fix closing brackets like </header > or </div >
src = src.replace(/<\/([a-zA-Z0-9_]+)\s+>/g, '</$1>');

fs.writeFileSync(filePath, src, 'utf8');
console.log('Successfully formatted JSX tags in LiveCameraPlayer.jsx');
