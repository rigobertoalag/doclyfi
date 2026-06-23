import { ROUTES } from '@/lib/routes';

export type Category = {
    id: string;
    index: number;
    label: string;
    image: string;
    bg: string;
    border: string;
    shadow: string;
    route: string | { pathname: string; params?: Record<string, any> };
    onPress?: () => void;
};

export const CATEGORIES: Category[] = [
    {
        id: 'invoice', index: 1, label: 'Gastos y Facturación',
        image: require('/home/rigoalag/doclyfi-app/assets/doclyfi_images/purchase.png'), bg: '#FFF7ED', border: '#FED7AA',
        shadow: 'rgba(249,115,22,0.15)',
        route: ROUTES.PURCHASE('no_warranty'),
    },
    {
        id: 'warranty', index: 2, label: 'Compras con Garantía',
        image: require('/home/rigoalag/doclyfi-app/assets/doclyfi_images/warranty.png'), bg: '#EFF6FF', border: '#BFDBFE',
        shadow: 'rgba(59,130,246,0.15)',
        route: ROUTES.PURCHASE('warranty'),
    },
    {
        id: 'services', index: 3, label: 'Pago de Servicios',
        image: require('/home/rigoalag/doclyfi-app/assets/doclyfi_images/services.png'), bg: '#F0F9FF', border: '#BAE6FD',
        shadow: 'rgba(14,165,233,0.15)',
        route: ROUTES.SERVICES,
    },
    {
        id: 'income', index: 4, label: 'Depositos e Ingresos',
        image: require('/home/rigoalag/doclyfi-app/assets/doclyfi_images/income.png'), bg: '#F0FDF4', border: '#BBF7D0',
        shadow: 'rgba(34,197,94,0.15)',
        route: ROUTES.DEPOSITS,
    },
    {
        id: 'contracts', index: 5, label: 'Contratos',
        image: require('/home/rigoalag/doclyfi-app/assets/doclyfi_images/contracts.png'), bg: '#FDF4FF', border: '#E9D5FF',
        route: ROUTES.CONTRACTS,
        shadow: 'rgba(168,85,247,0.15)',
    },
];
