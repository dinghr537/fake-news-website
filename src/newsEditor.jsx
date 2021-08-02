import React from 'react'
import ReactDom from 'react-dom'
import Header from './components/Header.js'
import EditorContent from './components/EditorContent.js'
import Footer from './components/Footer.js'

ReactDom.render(
    <>
        <Header />
        <EditorContent />
        <Footer />
    </>,
    document.getElementById("root"),
)