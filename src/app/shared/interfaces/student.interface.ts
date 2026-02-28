
export interface PagedResult {
    totalCount: number;
    pageNumber: number;
    pageSize: number;
    students: StudentResponse[];
}

export interface StudentResponse {
    id: number;
    name: string;
    surname: string;
    subjects: SubjectResponse[];
}

export interface StudentCreate {
    name: string;
    surname: string;
    subjectIds: number[];
}

export interface ClassmateGroup {
    subjectId: number;
    subjectName: string;
    classmateNames: string[];
}

export interface SubjectResponse {
    id: number;
    name: string;
    credits: number;
}