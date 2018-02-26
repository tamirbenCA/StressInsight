import homePage from './cmps/homePage.js'
import promo from './cmps/promo.js'
import coinsTask from './cmps/coinsTask.js'
import thankYou from './cmps/thankYou.js'
import admin from './cmps/admin.js'


const routes = [
    {
        path: '/',
        component: homePage
    },
    {
        path: '/promo',
        component: promo
    },
    {
        path: '/task',
        component: coinsTask
    },
    {
        path: '/thankyou',
        component: thankYou
    },
    {
        path: '/admin',
        component: admin
    },
    {
        path: '*',
        redirect: '/'
    }
];

export default routes;