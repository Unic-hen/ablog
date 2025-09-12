import { useEffect, useState } from 'react';
import { MdEditor } from 'md-editor-rt';
import 'md-editor-rt/lib/style.css';

export default () => {
  const [text, setText] = useState('hello md-editor-rt！');
  useEffect(()=>{
    setTimeout(()=>{
      // 打开点目录下的文件a.md,将text内容覆盖写入
      const fs = require('fs');
      fs.writeFileSync('./a.md', text);
    },5000)
  },[])
  return <>
  <MdEditor value={text} onChange={setText} />
  </>;
};