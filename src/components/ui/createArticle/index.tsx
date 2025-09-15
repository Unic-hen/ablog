import { useCurrentModal, useModal } from '@/components/ui/modal'
import React, { useEffect } from 'react'

export function isFileNameSafe(fileName:string) {
  return /^[a-z0-9]+(-[a-z0-9]+)*$/.test(fileName)
}

export default function CreateArticleButton({docNames}:{docNames:string[]}) {
    const { present } = useModal()
    const openModal = () => {
        present({
            content: <CreateArticleModal docNames={docNames} />,
        })
    }
  return (
  <span 
  className='cursor-pointer'
  onClick={openModal}>
    创建文章
  </span>
  )
}
function CreateArticleModal({docNames}:{docNames:string[]}) {
    const [docName, setDocName] = React.useState<string>('')
    const [title, setTitle] = React.useState<string>('')
    const [notice, setNotice] = React.useState<string>('')
    useEffect(()=>{
       if(!isFileNameSafe(docName)){
        setNotice('文档名称只能包含字母、数字和连字符')
       }
       if(title.length<1){
        setNotice('文章标题不能为空')
       }
       if(docNames.includes(docName)){
        setNotice('文档名称已存在')
       }
       else{
        setNotice('')
       }
    },[setDocName,setTitle,title,docName,docNames])
    return (
        <>
        <h1>
            创建文章
        </h1>
        <div>
            <label htmlFor="docName">文档名称</label>
            <input type="text" 
            className='w-full'
            value={docName}
            onChange={(e) => setDocName(e.target.value)}
            />
            <p className='text-red-500'>
                {notice}
            </p>
            </div>
            <div>
            <label htmlFor="title">文章标题</label>
            <input type="text" 
            className='w-full'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />
        </div>
        </>
    )
}