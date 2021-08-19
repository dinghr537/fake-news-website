import FooterStyle from './../style/Footer.module.scss'
import React from 'react'
import logoImage from './../res/image/logo.png'

export default function Footer() {
    return (
        <div className={FooterStyle['footer-background']}>
            <img className={FooterStyle['logo']}
                src={logoImage} />
        </div>
    )
}