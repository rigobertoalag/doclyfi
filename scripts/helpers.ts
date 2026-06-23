// scripts/helpers.ts
export function validateEmail(email: string): string | null {
    if (!email.trim()) return 'El correo es obligatorio';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return 'Formato de correo inválido';
    return null;
}

export function validatePassword(password: string): string | null {
    if (!password) return 'La contraseña es obligatoria';
    if (password.length < 6) return 'Mínimo 6 caracteres';
    return null;
}

export function validateName(name: string): string | null {
    if (!name.trim()) return 'El nombre es obligatorio';
    if (name.trim().length < 2) return 'Nombre demasiado corto';
    return null;
}

export function formatCurrency(value: number, currency = 'MXN'): string {
    return '$' + value.toLocaleString('es-MX', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }) + ' ' + currency;
}

export function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('es-ES', {
        day: '2-digit', month: 'short', year: 'numeric',
    });
}

export function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}