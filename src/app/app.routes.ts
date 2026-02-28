import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'students',
        // Se usa Lazy Loading para cargar el archivo de rutas de la feature
        loadChildren: () => import('./features/students/students.routes').then(m => m.STUDENT_ROUTES)
    },
    {
        path: '',
        redirectTo: 'students',
        pathMatch: 'full'
    },
    {
        path: '**',
        redirectTo: 'students'
    }
];
