import React from 'react'
import ReactDom from 'react-dom'
import Header from './components/Header.js'
import EditorContent from './components/EditorContent.js'


ReactDom.render(
    <>
        <Header />
        <EditorContent />
    </>,
    document.getElementById("root"),
)