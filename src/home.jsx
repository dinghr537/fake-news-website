import React from 'react'
import ReactDom from 'react-dom'
import Header from './components/Header.jsx'
import HomePageContent from './components/HomePageContent.jsx'
import Footer from './components/Footer.jsx'

ReactDom.render(
    <>
        <Header />
        <HomePageContent />
        <Footer />
    </>,
    document.getElementById("root"),
)