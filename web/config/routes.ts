export default [{
    name: 'login',
    path: '/login',
    component: './authorization/login',
    layout: false
}, {
    path: '/',
    component: '@/layouts/MainLayout',
    isMenu: true,
    routes: []
}, {
    component: './404'
}];
