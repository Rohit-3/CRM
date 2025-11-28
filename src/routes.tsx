import { lazy } from 'react';
import type { ReactNode } from 'react';

const Dashboard = lazy(() => import('./pages/Dashboard'));
const Login = lazy(() => import('./pages/Login'));
const Leads = lazy(() => import('./pages/Leads'));
const Contacts = lazy(() => import('./pages/Contacts'));
const Accounts = lazy(() => import('./pages/Accounts'));
const Opportunities = lazy(() => import('./pages/Opportunities'));
const Pipeline = lazy(() => import('./pages/Pipeline'));
const Tasks = lazy(() => import('./pages/Tasks'));
const Reports = lazy(() => import('./pages/Reports'));
const AIInsights = lazy(() => import('./pages/AIInsights'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const NotFound = lazy(() => import('./pages/NotFound'));

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Dashboard',
    path: '/',
    element: <Dashboard />,
  },
  {
    name: 'Leads',
    path: '/leads',
    element: <Leads />,
  },
  {
    name: 'Contacts',
    path: '/contacts',
    element: <Contacts />,
  },
  {
    name: 'Accounts',
    path: '/accounts',
    element: <Accounts />,
  },
  {
    name: 'Opportunities',
    path: '/opportunities',
    element: <Opportunities />,
  },
  {
    name: 'Pipeline',
    path: '/pipeline',
    element: <Pipeline />,
  },
  {
    name: 'Tasks',
    path: '/tasks',
    element: <Tasks />,
  },
  {
    name: 'Reports',
    path: '/reports',
    element: <Reports />,
  },
  {
    name: 'AI Insights',
    path: '/ai-insights',
    element: <AIInsights />,
  },
  {
    name: 'Admin',
    path: '/admin',
    element: <AdminPanel />,
    visible: false,
  },
  {
    name: 'Login',
    path: '/login',
    element: <Login />,
    visible: false,
  },
  {
    name: 'Not Found',
    path: '*',
    element: <NotFound />,
    visible: false,
  },
];

export default routes;