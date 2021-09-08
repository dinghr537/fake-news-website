import React from 'react'
import DemoStyle from './../style/Demo.module.scss'
import FakeNews from './FakeNews.js'

export default function Demo1Content() {
    return (
        <>
            <h1 className={DemoStyle['demo-title']} >
                假新聞生成 Demo
            </h1>
            <FakeNews />
        </>
    )
}
