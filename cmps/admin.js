import surveyService from '../services/surveyService.js' 

export default {
    template: `
    <section>
        <h2>מסך אדמין</h2>
        <router-link to='/?secret=true' tag="button" class="admin-btn btn-grey">נבדק חדש</router-link>
        <button @click="saveData" class="admin-btn btn-green">שמור מידע למחשב</button>
        <button @click="clearStorage" class="admin-btn btn-red">מחק מידע local storage</button>
    </section>
    `,
    data() {
        return {
        }
    },
    methods: {
        clearStorage() {
            if (confirm('האם את/ה בטוח/ה? פעולה זו בילתי הפיכה.\nאנא וודא/י גיבוי של המידע לפני אישור.')) {
                surveyService.clearLocalStorage()
            } else {
                return;
            }
        },
        saveData() {
            var fileName = new Date().toLocaleString('en-GB') + ' export.csv'
            // console.log('file name:', fileName)
            surveyService.exportToCsv(fileName)
        }
    }
}