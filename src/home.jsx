import React from 'react'
import ReactDom from 'react-dom'
import Header from './components/Header.js'
import HomePageContent from './components/HomePageContent.js'
import Footer from './components/Footer.js'

ReactDom.render(
    <>
        <Header />
        <HomePageContent />
        <Footer />
    </>,
    document.getElementById("root"),
)