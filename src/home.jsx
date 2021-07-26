import React from 'react'
import ReactDom from 'react-dom'
import Header from './components/Header.js'
import HomePageContent from './components/HomePageContent.js'


ReactDom.render(
    <>
        <Header />
        <HomePageContent />
    </>,
    document.getElementById("root"),
)