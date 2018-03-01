import surveyService from '../services/surveyService.js' 

export default {
    template: `
    <section>
        <h2>מסך אדמין</h2>
        <div class="admin-control">
            <router-link to='/' tag="button" class="admin-btn btn-grey">נבדק חדש</router-link>
            <button @click="saveData" class="admin-btn btn-green">שמור מידע למחשב</button>
            <button @click = "setTimer" class="admin-btn btn-blue">קבע טיימר</button>
            <button @click="clearStorage" class="admin-btn btn-red">איתחול ניסוי</button>
        </div>
        </br>
        <div class="admin-statistics">
            <h2>נתונים סטטיסטיים</h2>
            <div v-if="!rawData">
                <p>אין נתונים להצגה</p>
            </div>
            <div v-else>
                <p>סך הכל נבדקים: {{rawData.length}}</p>
                <p>מספר נבדקים במסלול לחץ: {{numOfStress}}</p>
                <p>מספר נבדקים במסלול לא-לחץ: {{rawData.length - numOfStress}}</p>
                <p>אחוז הנבדקים שפתר בהצלחה את משימת המטבעות: {{successRate}}%</p>
                <p>זמן הפתרון הארוך ביותר: {{maxTime}}ms</p>
                <p>זמן הפתרון הקצר ביותר: {{minTime}}ms</p>
                <p>זמן הפתרון הממוצע: {{avgTime}}ms</p>
                <p></p>
                <p></p>
            </div>
        </div>
    </section>
    `,
    data() {
        return {
            // rawData: surveyService.getDataFromStorage()
            min: Infinity,
            max: 0,
            avg: 0
        }
    },
    methods: {
        clearStorage() {
            if (confirm('האם את/ה בטוח/ה? פעולה זו בילתי הפיכה.\nהמידע שימחק כולל את נתוני הניסוי וזמן טיימר.\nאנא וודא/י גיבוי של המידע לפני אישור.')) {
                surveyService.clearLocalStorage();
                location.reload();
            } else {
                return;
            }
        },
        saveData() {
            var fileName = new Date().toLocaleString('en-GB') + ' export.csv'
            // console.log('file name:', fileName)
            surveyService.exportToCsv(fileName)
        },
        setTimer() {
            surveyService.setTimer();
        },
        taskTimeStat() {
            var total = 0;
            this.rawData.forEach(subject => {
                if (subject.taskTimeToSolution < this.min) {
                    this.min = subject.taskTimeToSolution;
                };
                if (subject.taskTimeToSolution > this.max) {
                    this.max = subject.taskTimeToSolution;
                };
                total += subject.taskTimeToSolution;
            });
            this.avg = total / this.rawData.length;
        }
    },
    computed: {
        rawData() {
            return surveyService.getDataFromStorage();
        },
        numOfStress() {
            var count = 0;
            this.rawData.forEach(subject => {
                if (subject.shouldStress) count++;
            })
            return count;
        },
        successRate() {
            var count = 0;
            this.rawData.forEach(subject => {
                if (subject.taskSolved) count++;
            });
            return ((count / this.rawData.length) * 100)
        },
        maxTime() {
            return this.max;
        },
        minTime() {
            return this.min;
        },
        avgTime() {
            return this.avg;
        }
    },
    created() {
        surveyService.getAuth();
        // surveyService.initExp();
    },
    mounted() {
        if (this.rawData) {
            this.taskTimeStat();
        }
    }
}