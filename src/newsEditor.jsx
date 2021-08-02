import React from 'react'
import ReactDom from 'react-dom'
import Header from './components/Header.jsx'
import EditorContent from './components/EditorContent.jsx'
import Footer from './components/Footer.jsx'

ReactDom.render(
    <>
        <Header />
        <EditorContent />
        <Footer />
    </>,
    document.getElementById("root"),
)