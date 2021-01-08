TweenMax.to(".wrapper", 2, {
    top: "-100%",
    ease: Expo.easeInOut,
    delay: 3
})


var tl = new TimelineMax();
tl.from(".loader", 1, {
    scaleY: "0%",
    y: 80,
    ease: Expo.easeInOut,
    delay: 1,
    transformOrigin: "50% 100%"
})

tl.to(".loader", 1, {
    height: "20vh", //height of block before it leaves screen
    scaleY: "0%",
    ease: Expo.easeInOut,
    transformOrigin: "0% -100%" //to make it leave the screen from current point to -100% y-axis
})

// header animation
// var textWrapper = document.querySelector('.header-1');
// textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

anime.timeline()
    .add({
        targets: '.container',
        translateY: [200, 0],
        // translateZ: 0,
        opacity: [0, 1],
        easing: "easeOutExpo",
        // duration: 2000,
        // delay: (el, i) => 4800 + 50 * i
    });

// var textWrapper = document.querySelector('.header-2');
// textWrapper.innerHTML = textWrapper.textContent.replace(/\S/g, "<span class='letter'>$&</span>");

// anime.timeline()
//     .add({
//         targets: '.header-2 .letter',
//         translateY: [200, 0],
//         translateZ: 0,
//         opacity: [0, 1],
//         easing: "easeOutExpo",
//         duration: 2000,
//         delay: (el, i) => 4800 + 50 * i
//     });

// liquid animation
/**
 * demo.js
 * http://www.codrops.com
 *
 * Licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license.php
 * 
 * Copyright 2019, Codrops
 * http://www.codrops.com
 */
{
    const body = document.body;
    const docEl = document.documentElement;

    const MathUtils = {
        lineEq: (y2, y1, x2, x1, currentVal) => {
            // y = mx + b 
            var m = (y2 - y1) / (x2 - x1),
                b = y1 - m * x1;
            return m * currentVal + b;
        },
        lerp: (a, b, n) => (1 - n) * a + n * b,
        distance: (x1, x2, y1, y2) => {
            var a = x1 - x2;
            var b = y1 - y2;
            return Math.hypot(a, b);
        }
    };

    let winsize;
    const calcWinsize = () => winsize = { width: window.innerWidth, height: window.innerHeight };
    calcWinsize();
    window.addEventListener('resize', calcWinsize);

    const getMousePos = (ev) => {
        let posx = 0;
        let posy = 0;
        if (!ev) ev = window.event;
        if (ev.pageX || ev.pageY) {
            posx = ev.pageX;
            posy = ev.pageY;
        } else if (ev.clientX || ev.clientY) {
            posx = ev.clientX + body.scrollLeft + docEl.scrollLeft;
            posy = ev.clientY + body.scrollTop + docEl.scrollTop;
        }
        return { x: posx, y: posy };
    }

    let mousePos = { x: winsize.width / 2, y: winsize.height / 2 };
    window.addEventListener('mousemove', ev => mousePos = getMousePos(ev));

    // need this to move it
    const imgs = [...document.querySelectorAll('.content__img')];
    const imgsTotal = imgs.length;
    let imgTranslations = [...new Array(imgsTotal)].map(() => ({ x: 0, y: 0 }));

    const elem = document.querySelector('.content__text');
    // to get the innerHTML of this element which is the text
    const textEl = elem.querySelector('span.content__text-inner');

    const createBlotterText = () => {
        // Create the Blotter instance.
        const text = new Blotter.Text(textEl.innerHTML, {
            family: "'Playfair Display',serif",
            weight: 900,
            size: 200,
            paddingLeft: 100,
            paddingRight: 100,
            paddingTop: 100,
            paddingBottom: 100,
            fill: 'black'
        });
        elem.removeChild(textEl);

        const material = new Blotter.LiquidDistortMaterial();
        material.uniforms.uSpeed.value = 1;
        material.uniforms.uVolatility.value = 0;
        material.uniforms.uSeed.value = 0.1;
        const blotter = new Blotter(material, { texts: text });
        const scope = blotter.forText(text);
        scope.appendTo(elem);

        let lastMousePosition = { x: winsize.width / 2, y: winsize.height / 2 };
        let volatility = 0;

        const render = () => {
            const docScrolls = { left: body.scrollLeft + docEl.scrollLeft, top: body.scrollTop + docEl.scrollTop };
            const relmousepos = { x: mousePos.x - docScrolls.left, y: mousePos.y - docScrolls.top };
            const mouseDistance = MathUtils.distance(lastMousePosition.x, relmousepos.x, lastMousePosition.y, relmousepos.y);

            volatility = MathUtils.lerp(volatility, Math.min(MathUtils.lineEq(0.9, 0, 100, 0, mouseDistance), 0.9), 0.05);
            material.uniforms.uVolatility.value = volatility;

            for (let i = 0; i <= imgsTotal - 1; ++i) {
                imgTranslations[i].x = MathUtils.lerp(imgTranslations[i].x, MathUtils.lineEq(40, -40, winsize.width, 0, relmousepos.x), i === imgsTotal - 1 ? 0.15 : 0.03 * i + 0.03);
                imgTranslations[i].y = MathUtils.lerp(imgTranslations[i].y, MathUtils.lineEq(40, -40, winsize.height, 0, relmousepos.y), i === imgsTotal - 1 ? 0.15 : 0.03 * i + 0.03);
                imgs[i].style.transform = `translateX(${(imgTranslations[i].x)}px) translateY(${imgTranslations[i].y}px)`;
            };

            lastMousePosition = { x: relmousepos.x, y: relmousepos.y };
            requestAnimationFrame(render);
        }
        requestAnimationFrame(render);
    };

    WebFont.load({
        google: {
            families: ['Playfair+Display:900']
        },
        active: () => createBlotterText()
    });

    // Preload all the images in the page.
    // imagesLoaded(document.querySelectorAll('.content__img'), { background: true }, () => body.classList.remove('loading'));
}