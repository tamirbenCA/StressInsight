export default {
    template: `
    <section>
        <div id="timerProgress">
            <div id="timerBar"></div>
        </div>
    </section>
    `,
    props: ['timer'],
    methods: {
        move() {
            var elTimer = document.getElementById("timerBar");   
            var width = 1;
            var id = setInterval(frame, (this.timer / 100));
            
            function frame() {
                if (width >= 100) {
                    clearInterval(id);
                } else {
                    width++; 
                    elTimer.style.width = width + '%'; 
                }
            }
        },
        setTimer() {
            return surveyService.getTimer();
        }
    },
    mounted() {
        this.move();
    }
}