import { useCallback, useState } from 'react';
import { useAuthContext } from '../../context/AuthContext';

// ─── Types ────────────────────────────────────────────────────────────────────
type AuthMethod = 'email' | 'phone';

type LoginPayload = {
    authMethod: AuthMethod;
    contact:    string;
    password:   string;
};

type LoginErrors = {
    contact?:  string;
    password?: string;
    general?:  string;
};

// ─── Validaciones locales (sin llamada a red) ─────────────────────────────────
const validateLoginForm = (payload: LoginPayload): LoginErrors => {
    const errors: LoginErrors = {};

    if (!payload.contact.trim()) {
        errors.contact = payload.authMethod === 'email'
            ? 'El correo es obligatorio'
            : 'El teléfono es obligatorio';
    } else if (payload.authMethod === 'email') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(payload.contact)) {
            errors.contact = 'Formato de correo inválido';
        }
    } else {
        const phoneRegex = /^\+?[\d\s\-()]{8,15}$/;
        if (!phoneRegex.test(payload.contact)) {
            errors.contact = 'Formato de teléfono inválido';
        }
    }

    if (!payload.password) {
        errors.password = 'La contraseña es obligatoria';
    } else if (payload.password.length < 6) {
        errors.password = 'Mínimo 6 caracteres';
    }

    return errors;
};

// ─── Hook ─────────────────────────────────────────────────────────────────────
export function useLogin() {
    const { login } = useAuthContext();

    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors]       = useState<LoginErrors>({});

    const clearErrors = useCallback(() => setErrors({}), []);

    const handleLogin = useCallback(async (payload: LoginPayload): Promise<boolean> => {
        // 1. Validar antes de llamar a la red
        const validationErrors = validateLoginForm(payload);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return false;
        }

        setIsLoading(true);
        setErrors({});

        try {
            const response = await fetch(
                `${process.env.EXPO_PUBLIC_N8N_URL}/webhook/auth/login`,
                {
                    method:  'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        authMethod: payload.authMethod,
                        // Normalizar antes de enviar
                        contact:  payload.authMethod === 'email'
                            ? payload.contact.toLowerCase().trim()
                            : payload.contact.replace(/[\s\-()]/g, '').trim(),
                        password: payload.password,
                    }),
                }
            );

            const data = await response.json();

            // 2. Manejar errores del servidor
            if (!response.ok || !data.success) {
                // Mapear códigos de error del backend a mensajes UI
                const errorMap: Record<string, LoginErrors> = {
                    INVALID_CREDENTIALS: { general: 'Correo/teléfono o contraseña incorrectos' },
                    TOO_MANY_ATTEMPTS:   { general: `Demasiados intentos. Espera ${Math.ceil((data.retryAfter ?? 900) / 60)} minutos` },
                    VALIDATION_ERROR:    { general: data.message ?? 'Datos inválidos' },
                };

                setErrors(errorMap[data.code] ?? { general: data.message ?? 'Error al iniciar sesión' });
                return false;
            }

            // 3. Guardar sesión y actualizar contexto
            await login(data.token, data.refreshToken, data.user);
            return true;

        } catch (err) {
            // Error de red (sin conexión, timeout, etc.)
            setErrors({ general: 'Sin conexión. Verifica tu internet e intenta de nuevo' });
            return false;
        } finally {
            setIsLoading(false);
        }
    }, [login]);

    return { handleLogin, isLoading, errors, clearErrors };
}