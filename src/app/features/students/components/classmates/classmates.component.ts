import { Component, inject, input } from '@angular/core';
import { StudentService } from '../../../../core/services/student.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';

@Component({
  selector: 'app-classmates',
  imports: [],
  templateUrl: './classmates.component.html',

})
export class ClassmatesComponent {
  private studentService = inject(StudentService);
  studentId = input.required<number | null>();

  classmatesResource = rxResource({
    request: () => this.studentId(),
    loader: ({ request: id }) => {
      // Evita la petición HTTP cuando no hay estudiante seleccionado.
      // El componente padre pasa null para indicar "sin selección".
      if (!id) return of([]);
      return this.studentService.getClassmates(id);
    }
  });
}
