import surveyService from '../services/surveyService.js' 

export default {
    template: `
    <section>
        <h1>תודה על השתתפותך בניסוי</h1>
        <router-link to='/?secret=true' tag="button">נבדק חדש</router-link>
    </section>
    `,
    data() {
        return {
        }
    },
    created() {
        surveyService.saveSubject();
        if (!surveyService.isCurrUser()) {
            this.$router.push('/?secret=true');
        }
    }
}