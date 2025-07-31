import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '/welcome' },
  { path: 'welcome', loadChildren: () => import('./pages/welcome/welcome.routes').then(m => m.WELCOME_ROUTES) },
  { path: 'productos', loadComponent: () => import('./pages/productos/productos.component').then(c => c.ProductosComponent) },
  { path: 'Transacciones', loadComponent: () => import('./pages/inventario/inventario.component').then(c => c.InventarioComponent) }
];
