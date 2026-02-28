import { Component, computed, inject, signal } from '@angular/core';
import { StudentService } from '../../../../core/services/student.service';
import { rxResource } from '@angular/core/rxjs-interop';
import { PaginationService } from '../../../../core/services/pagination.service';
import { PaginationComponent } from "../../../../shared/components/pagination/pagination.component";
import { ActivatedRoute, Router } from '@angular/router';
import { ClassmatesComponent } from "../../components/classmates/classmates.component";
import { UiService } from '../../../../core/services/ui.service';

@Component({
  selector: 'app-student-list',
  imports: [PaginationComponent, ClassmatesComponent],
  templateUrl: './student-list.component.html',
  styleUrl: './student-list.component.css'
})
export class StudentListComponent {
  protected studentService = inject(StudentService);
  protected paginationService = inject(PaginationService);

  pageSize = signal(12);
  private readonly _router = inject(Router);
  private readonly _activatedRoute = inject(ActivatedRoute);
  private readonly _uiService = inject(UiService);
  private searchTimer?: ReturnType<typeof setTimeout>;
  selectedStudentId = signal<number | null>(null);
  pendingDeleteId = signal<number | null>(null);

  studentResource = rxResource({
    request: () => ({
      pageNumber: this.paginationService.currentPage(),
      pageSize: this.pageSize(),
      query: this.studentService.searchTerm()
    }),
    loader: ({ request }) => this.studentService.getAll(request),
  });

  totalPages = computed(() => {
    const total = this.studentResource.value()?.totalCount ?? 0;
    const size = this.pageSize();
    return Math.ceil(total / size);
  });

  onSearch(event: Event) {
    const value = (event.target as HTMLInputElement).value;

    clearTimeout(this.searchTimer);

    this.searchTimer = setTimeout(() => {
      this.studentService.searchTerm.set(value);
      this._router.navigate([], {
        relativeTo: this._activatedRoute,
        queryParams: { page: 1 },
        queryParamsHandling: 'merge',
      });
    }, 500);
  }

  onEdit(id: number) {
    this._router.navigate(['/students/edit', id]);
  }

  onDelete(id: number) {
    this.pendingDeleteId.set(id);
  }

  confirmDelete() {
    const id = this.pendingDeleteId();
    if (id === null) return;
    this.pendingDeleteId.set(null);

    this.studentService.delete(id).subscribe({
      next: () => {
        this._uiService.showToast('Estudiante eliminado con éxito', 'success');
        this._router.navigate(['/students']);
      },
      error: (err) => {
        const msg = err.error?.message || 'Error al eliminar';
        this._uiService.showToast(msg, 'error');
      }
    });
  }

  cancelDelete() {
    this.pendingDeleteId.set(null);
  }
}
