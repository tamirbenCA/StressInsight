import surveyService from '../services/surveyService.js' 

export default {
    template: `
    <section>
        <h2>מסך אדמין</h2>
        <router-link to='/' tag="button" class="admin-btn btn-grey">נבדק חדש</router-link>
        <button @click="saveData" class="admin-btn btn-green">שמור מידע למחשב</button>
        <button @click="clearStorage" class="admin-btn btn-red">איתחול ניסוי</button>
        <button @click = "setTimer" class="admin-btn btn-blue">קבע טיימר</button>
    </section>
    `,
    methods: {
        clearStorage() {
            if (confirm('האם את/ה בטוח/ה? פעולה זו בילתי הפיכה.\nהמידע שימחק כולל את נתוני הניסוי וזמן טיימר.\nאנא וודא/י גיבוי של המידע לפני אישור.')) {
                surveyService.clearLocalStorage()
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
        }
    },
    created() {
        surveyService.getAuth();
    }
}