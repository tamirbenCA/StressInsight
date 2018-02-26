import surveyService from '../services/surveyService.js'

export default {
    template: `
    <section>
        <form v-if="promoState === 'promo-show'" @submit.prevent="startPromo">
            <p>מיד יופיע מספר ממנו יש להחסיר {{numInterval}}.</p>
            <p>מהתוצאה יש להחסיר שוב {{numInterval}}.</p>
            <p>ומן התוצאה הזו יש להחסיר שוב {{numInterval}}.</p>
            <p>וכך הלאה...</p>
            <p>לאחר כל חיסור אתה מתבקש להקליד את התוצאה.</p>
            <p>מיד עם סיום ההקלדה התוצאה תעלם.</p>
            <p>עליך לזכור את התוצאה ולהמשיך להחסיר ממנה.</p>
            <p v-if="numInterval === 17"><b>במידה והתוצאה אינה נכונה יופיע <span class="span-x">X</span> ויש לחסר שוב מההתחלה (כלומר 1000).</b></p>
            <p><b>מטרת המשימה היא להתקדם עד לתוצאה הקטנה ביותר האפשרית לפני תום הזמן.</b></p>
            <input type="submit" value="המשך" />
        </form>
        <div v-else class="promo-main">
            <div :class="tryAgain" class="error-display">
                <img src="img/redx.png" class="x-img" />
                <h1 class="error-msg">חסר מחדש, החל מ-1000</h1>
                <!-- <p>המספר האחרון הינו {{currNum}}</p> -->
            </div>
            <h1 :class="showNumber">1000</h1>
            <form @submit.prevent="nextStep">
                <input type="number" v-model="userInput" required autofocus />
                <input type="submit" value="אישור" />
            </form>
        </div>
    </section>
    `,
    data() {
        return {
            promoState: 'promo-show',
            errorCount: 0,
            startTime: null,
            endTime: null,
            currNum: 1000,
            timer: this.setTimer(),
            numInterval: null,
            timeInterval: null,
            userInput: null
        }
    },
    created() {
        if (!surveyService.isCurrUser()) {
            this.$router.push('/?secret=true');
        }
        if (surveyService.isCurrUserStress()) {
            this.numInterval = 17;
        } else {
            this.numInterval = 1;
        }
    },
    computed: {
        showNumber() {
            if (this.promoState === 'promo-start') {
                return 'show-number'
            } else {
                return 'hide-number'
            }
        },
        tryAgain() {
            if (this.promoState === 'wrong') {
                return 'show-error'
            } else {
                return 'hide-error'
            }
        }
    },
    methods: {
        setTimer() {
            return surveyService.getTimer();
        },
        startPromo() {
            this.promoState = 'promo-start';
            this.startTime = Date.now();
            this.timeInterval = setTimeout(this.endPromo, this.timer)
        },
        nextStep() {
            if (this.currNum === (+this.userInput + this.numInterval)) {
                this.promoState = 'correct';
                this.currNum = +this.userInput;
                this.userInput = null;
            } else {
                if (this.numInterval === 17) {
                    this.errorCount++;
                    this.promoState = 'wrong';
                    this.userInput = null;
                    this.currNum = 1000;
                }
                else {
                    this.promoState = 'correct';
                    this.errorCount++;
                    this.currNum = +this.userInput;
                    this.userInput = null;
                }
            }
        },
        endPromo() {
            clearTimeout(this.timeInterval)
            this.endTime = Date.now();
            var promoRes = {
                startTime: this.startTime,
                endTime: this.endTime,
                errorCount: this.errorCount
            }
            surveyService.setPromo(promoRes);
            this.$router.push('/task')
        }
    }
}