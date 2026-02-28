import { inject, Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import {
    ClassmateGroup,
    PagedResult,
    StudentCreate,
    StudentResponse,
    SubjectResponse,
} from '../../shared/interfaces/student.interface';
import { environment } from '../../../environments/environment';

const baseUrl = environment.baseUrl;


interface Options {
    pageNumber?: number;
    pageSize?: number;
    query?: string
}

@Injectable({ providedIn: 'root' })
export class StudentService {

    // Dependencies
    private readonly _http = inject(HttpClient);

    // State 
    private studentsCache = new Map<string, PagedResult>();
    private studentCache = new Map<string, StudentResponse>();
    searchTerm = signal<string>('');

    // Methods

    getAll(options: Options): Observable<PagedResult> {
        const { pageNumber = 1, pageSize = 10, query = '' } = options;

        const key = `${pageSize}-${pageNumber}-${query}`;

        // la key es una combinación de los tres parámetros para que cada combinación
        // única de página/tamaño/búsqueda tenga su propia entrada en caché.

        if (this.studentsCache.has(key)) {
            return of(this.studentsCache.get(key)!);
        }

        return this._http
            .get<PagedResult>(`${baseUrl}/students`, {
                params: {
                    pageSize,
                    pageNumber,
                    query
                },
            })
            .pipe(
                tap((resp) => this.studentsCache.set(key, resp))
            );
    }

    getStudentById(id: number): Observable<StudentResponse> {
        return this._http.get<StudentResponse>(`${baseUrl}/students/${id}`);
    }

    getClassmates(id: number) {
        return this._http.get<ClassmateGroup[]>(`${baseUrl}/students/${id}/classmates`);
    }

    getSubjects(): Observable<SubjectResponse[]> {
        return this._http.get<SubjectResponse[]>(`${baseUrl}/Subjects`);
    }

    create(dto: StudentCreate): Observable<StudentResponse> {
        return this._http
            .post<StudentResponse>(`${baseUrl}/students`, dto)
            .pipe(
                tap((student) => {
                    this.updateStudentCache(student);
                    this.invalidateStudentsCache();
                })
            );
    }

    update(id: number, dto: StudentCreate): Observable<StudentResponse> {
        return this._http
            .put<StudentResponse>(`${baseUrl}/students/${id}`, dto)
            .pipe(
                tap((student) => this.updateStudentCache(student))
            );
    }

    delete(id: number): Observable<void> {
        return this._http
            .delete<void>(`${baseUrl}/students/${id}`)
            .pipe(
                tap(() => this.removeStudentFromCache(id))
            );
    }

    // Private Methods

    private invalidateStudentsCache() {
        this.studentsCache.clear();
    }

    private updateStudentCache(student: StudentResponse) {
        this.studentCache.set(student.id.toString(), student);
        let found = false;

        this.studentsCache.forEach((pagedResponse) => {
            const index = pagedResponse.students.findIndex(s => s.id === student.id);

            if (index !== -1) {
                pagedResponse.students[index] = student;
                found = true;
            }
        });
        if (!found && this.studentsCache.size > 0) {
            const iterator = this.studentsCache.keys().next();

            if (!iterator.done) {
                const firstPage = this.studentsCache.get(iterator.value);

                if (firstPage) {
                    firstPage.students.unshift(student);
                    firstPage.totalCount++;
                }
            }
        }

    }

    private removeStudentFromCache(id: number) {
        this.studentCache.delete(id.toString());

        this.studentsCache.forEach((pagedResponse) => {
            pagedResponse.students = pagedResponse.students.filter(
                s => s.id !== id
            );
        });

    }
}
