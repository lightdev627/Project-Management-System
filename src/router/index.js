import { createRouter, createWebHistory } from 'vue-router'

let routes = [
	{
		// will match everything not previously matched
		path: '/:pathMatch(.*)*',
		name: 'NotFound',
		component: () => import('../views/404.vue')
	},
	{
		path: '/',
		name: 'Home',
		redirect: '/dashboard',
	},
	{
		path: '/dashboard',
		name: 'Dashboard',
		layout: "dashboard",
		component: () => import('../views/Dashboard.vue'),
	},
	{
		path: '/setup',
		name: 'Setup',
		layout: "dashboard",
		component: () => import('../views/Setup.vue'),
	},
	{
		path: '/timeline',
		name: 'Project Timeline',
		layout: "dashboard",
		component: () => import('../views/ProjectTimeline.vue'),
	},
	{
		path: '/list',
		name: 'Task List',
		layout: "dashboard",
		component: () => import('../views/TaskList.vue'),
	},
	{
		path: '/dailytasks',
		name: 'Daily Tasks',
		layout: "dashboard",
		component: () => import('../views/DailyTasks.vue'),
	},
	{
		path: '/schedule',
		name: 'Weekly/Monthly Schedule',
		layout: "dashboard",
		component: () => import('../views/Schedule.vue'),
	},
	{
		path: '/notes',
		name: 'Notes',
		layout: "dashboard",
		component: () => import('../views/Notes.vue'),
	},
	{
		path: '/sign-in',
		name: 'Sign-In',
		component: () => import('../views/Sign-In.vue'),
	},
	{
		path: '/sign-up',
		name: 'Sign-Up',
		meta: {
			layoutClass: 'layout-sign-up',
		},
		component: () => import('../views/Sign-Up.vue'),
	},
]

function addLayoutToRoute( route, parentLayout = "default" )
{
	route.meta = route.meta || {} ;
	route.meta.layout = route.layout || parentLayout ;
	
	if( route.children )
	{
		route.children = route.children.map( ( childRoute ) => addLayoutToRoute( childRoute, route.meta.layout ) ) ;
	}
	return route ;
}

routes = routes.map( ( route ) => addLayoutToRoute( route ) ) ;

const router = createRouter({
	mode: 'hash',
	base: process.env.BASE_URL,
	routes,
	scrollBehavior (to, from, savedPosition) {
		if ( to.hash ) {
			return {
				selector: to.hash,
				behavior: 'smooth',
			}
		}
		return {
			x: 0,
			y: 0,
			behavior: 'smooth',
		}
	},
  history: createWebHistory(),
  routes
})

export default router
