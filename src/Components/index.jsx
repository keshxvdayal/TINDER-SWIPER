import React, { useEffect, useRef } from "react";
import Hammer from "hammerjs";
import "./index.css"

const Home = () => {
    const nopeButtonRef = useRef(null);
    const loveButtonRef = useRef(null);

    useEffect(() => {
        const tinderContainer = document.querySelector('.tinder');
        const allCards = document.querySelectorAll('.tinder--card');

        function initCards(card, index) {
            const newCards = document.querySelectorAll('.tinder--card:not(.removed)');

            newCards.forEach(function (card, index) {
                card.style.zIndex = allCards.length - index;
                card.style.transform = 'scale(' + (20 - index) / 20 + ') translateY(' + 30 * index + 'px)';
                card.style.opacity = (10 - index) / 10;
            });

            tinderContainer.classList.add('loaded');
        }

        initCards();

        allCards.forEach(function (el) {
            const hammertime = new Hammer(el);

            hammertime.on('pan', function (event) {
                el.classList.add('moving');
            });

            hammertime.on('pan', function (event) {
                if (event.deltaX === 0) return;
                if (event.center.x === 0 && event.center.y === 0) return;

                tinderContainer.classList.toggle('tinder_love', event.deltaX > 0);
                tinderContainer.classList.toggle('tinder_nope', event.deltaX < 0);

                const xMulti = event.deltaX * 0.03;
                const yMulti = event.deltaY / 80;
                const rotate = xMulti * yMulti;

                event.target.style.transform = 'translate(' + event.deltaX + 'px, ' + event.deltaY + 'px) rotate(' + rotate + 'deg)';

                el.classList.toggle('nope', event.deltaX < -80);
                el.classList.toggle('like', event.deltaX > 80);
            });

            hammertime.on('panend', function (event) {
                el.classList.remove('moving');
                tinderContainer.classList.remove('tinder_love');
                tinderContainer.classList.remove('tinder_nope');

                const moveOutWidth = document.body.clientWidth;
                const keep = Math.abs(event.deltaX) < 80 || Math.abs(event.velocityX) < 0.5;

                event.target.classList.toggle('removed', !keep);

                if (keep) {
                    event.target.style.transform = '';
                } else {
                    const endX = Math.max(Math.abs(event.velocityX) * moveOutWidth, moveOutWidth);
                    const toX = event.deltaX > 0 ? endX : -endX;
                    const endY = Math.abs(event.velocityY) * moveOutWidth;
                    const toY = event.deltaY > 0 ? endY : -endY;
                    const xMulti = event.deltaX * 0.03;
                    const yMulti = event.deltaY / 80;
                    const rotate = xMulti * yMulti;

                    event.target.style.transform = 'translate(' + toX + 'px, ' + (toY + event.deltaY) + 'px) rotate(' + rotate + 'deg)';
                    initCards();
                }
            });
        });

        function createButtonListener(love) {
            return function (event) {
                const cards = document.querySelectorAll('.tinder--card:not(.removed)');
                const moveOutWidth = document.body.clientWidth * 1.5;

                if (!cards.length) return false;

                const card = cards[0];

                card.classList.add('removed');

                if (love) {
                    card.style.transform = 'translate(' + moveOutWidth + 'px, -100px) rotate(-30deg)';
                } else {
                    card.style.transform = 'translate(-' + moveOutWidth + 'px, -100px) rotate(30deg)';
                }

                initCards();

                event.preventDefault();
            };
        }

        const nopeListener = createButtonListener(false);
        const loveListener = createButtonListener(true);

        nopeButtonRef.current?.addEventListener('click', nopeListener);
        loveButtonRef.current?.addEventListener('click', loveListener);

    }, []); // empty dependency array means this effect runs once after the initial render

    return (
        <div className="tinder">
            <div className="tinder--cards">
                <div className="tinder--card" style={{ backgroundColor: "rgb(158, 239, 255)" }}>
                    {/* Card content goes here */}
                </div>
                <div className="tinder--card" style={{ backgroundColor: "rgb(195, 255, 158)" }}>
                    {/* Card content goes here */}
                </div>
                <div className="tinder--card" style={{ backgroundColor: "rgb(255, 226, 158)" }}>
                    {/* Card content goes here */}
                </div>
                <div className="tinder--card" style={{ backgroundColor: "rgb(255, 102, 102)" }}>
                    {/* Card content goes here */}
                </div>
                <div className="tinder--card" style={{ backgroundColor: "rgb(179, 102, 255)" }}>
                    {/* Card content goes here */}
                </div>
            </div>
        </div>
    );
}

export default Home