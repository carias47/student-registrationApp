import { Routes } from '@angular/router';
import { StudentListComponent } from './pages/student-list/student-list.component';
import { StudentRegisterComponent } from './pages/student-register/student-register.component';

export const STUDENT_ROUTES: Routes = [
    { path: '', component: StudentListComponent },
    { path: 'register', component: StudentRegisterComponent },
    { path: 'edit/:id', component: StudentRegisterComponent }
];