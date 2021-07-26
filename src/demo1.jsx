import React from 'react'
import ReactDom from 'react-dom'
import Header from './components/Header.js'
import Demo1Content from './components/Demo1Content.js'
import DemoStyle from './style/Demo.module.scss'


ReactDom.render(
    <>
        <div className={DemoStyle['whole-page']}>
            <Header />
            <Demo1Content />
        </div>
    </>,
    document.getElementById("root"),
)