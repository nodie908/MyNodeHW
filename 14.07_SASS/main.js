import './block.sass'
import javascriptLogo from './javascript.svg'
import viteLogo from '/vite.svg'
import { setupCounter } from './counter.js'

document.querySelector('#app').innerHTML = `
<div class="cont">

<div class="header">
    <div class="logo">
        <div><i class="fa-solid fa-cubes"></i> kayoko</div>
    </div>

    <div class="button-bar">
        <span class="bars">products <i class="fa-solid fa-chevron-down"></i></span>
        <span class="bars">pricing</span>
        <span class="bars">customers</span>
        <span class="bars">blog</span>
        <span class="bars">more <i class="fa-solid fa-chevron-down"></i></span>
        <span class="orange bars">Start your free trial</span>
    </div>

</div>

<div class="body">

    <div class="back">
        <img src="back.gif" alt="">
    </div>

    <div class="info">
        <h1 class="keep">Keep customers.<br>
            Win customers.<br>
            Be a hero.</h1>

        <p class="keep-txt">Grow your business through better customers service with Kayako, the unifed customer
            service platform</p>

        <span class="keep-btn orange">Free trial</span>
        <span class="keep-btn">Take the tour</span>

        <div class="sponsor">
            <img src="sponsors.JPG">
        </div>
    </div>

</div>

<div class="clearfix"></div>

<div class="footer">
    <div class="icon"><i class="fa-solid fa-comments"></i></div>
    <div class="icon"><i class="fa-solid fa-ferry"></i></div>
    <div class="icon"><i class="fa-solid fa-rocket"></i></div>
    <div class="icon"><i class="fa-solid fa-phone-volume"></i></div>
</div>
</div>
`

setupCounter(document.querySelector('#counter'))
