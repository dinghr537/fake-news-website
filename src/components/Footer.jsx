import FooterStyle from './../style/Footer.module.scss'
import React from 'react'
import logoImage from './../res/image/logo2.png'

export default function Footer() {
    return (
         <div className={FooterStyle['footerbackground']}>
          <img  className={FooterStyle['logo']}
                src={logoImage}/>
         </div>
    )
}