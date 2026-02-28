import { Injectable, signal } from '@angular/core';

export type ToastType = 'success' | 'error' | 'info';

@Injectable({ providedIn: 'root' })
export class UiService {
    toastMessage = signal<string | null>(null);
    toastType = signal<ToastType>('info');
    private toastTimer?: ReturnType<typeof setTimeout>;

    showToast(message: string, type: ToastType = 'success') {
        clearTimeout(this.toastTimer);
        this.toastMessage.set(message);
        this.toastType.set(type);
        this.toastTimer = setTimeout(() => this.toastMessage.set(null), 3000);
    }
}