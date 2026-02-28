import { Component, inject, OnInit } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { StudentService } from '../../../../core/services/student.service';
import { UiService } from '../../../../core/services/ui.service';
import { ActivatedRoute, Router } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';



/**
 * Componente reutilizado para crear y/o editar estudiantes.
 * El modo se determina en ngOnInit según la presencia del parámetro :id en la ruta.
 */
@Component({
  selector: 'app-students-form',
  imports: [ReactiveFormsModule],
  templateUrl: './students-form.component.html',
})
export class StudentsFormComponent implements OnInit {
  private readonly _fb = inject(NonNullableFormBuilder);
  private readonly _studentService = inject(StudentService);
  private readonly _uiService = inject(UiService);
  private readonly _router = inject(Router);
  private readonly _route = inject(ActivatedRoute);
  private isEditMode = false;
  private studentId: number | undefined;

  subjectsResource = rxResource({
    loader: () => this._studentService.getSubjects()
  });

  studentForm = this._fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    surname: ['', [Validators.required, Validators.minLength(3)]],
    subjectIds: [[] as number[], [Validators.required]]
  });

  ngOnInit() {
    const id = this._route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.studentId = +id;
      this.loadStudent(this.studentId);
    }
  }
  loadStudent(id: number) {
    this._studentService.getStudentById(id).subscribe(student => {
      this.studentForm.patchValue({
        name: student.name,
        surname: student.surname,
        subjectIds: student.subjects.map(s => s.id)
      });
    });
  }
  onSubjectToggle(id: number) {
    const control = this.studentForm.controls.subjectIds;
    const currentIds = [...control.value];
    const index = currentIds.indexOf(id);

    if (index > -1) {
      currentIds.splice(index, 1);
    } else {
      if (currentIds.length < 3) {
        currentIds.push(id);
      } else {
        this._uiService.showToast('Máximo 3 materias permitidas', 'error');
      }
    }

    control.setValue(currentIds);
    control.markAsTouched();
  }

  onSubmit() {
    if (this.studentForm.invalid) return;

    const payload = this.studentForm.getRawValue();
    const request$ = this.isEditMode && this.studentId
      ? this._studentService.update(this.studentId, payload)
      : this._studentService.create(payload);

    request$.subscribe({
      next: (res) => {
        const action = this.isEditMode ? 'actualizado' : 'registrado';
        this._uiService.showToast(
          `¡Estudiante ${res.name} ${action} con éxito!`,
          'success'
        );

        if (!this.isEditMode) {
          this.studentForm.reset();
        }

        this._router.navigate(['/students']);
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al conectar con el servidor';
        this._uiService.showToast(msg, 'error');
      }
    });
  }
}
