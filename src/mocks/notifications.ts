type NotificationItem = {
  id: string;
  type: 'alert' | 'document' | 'success' | 'system';
  title: string;
  description: string;
  time: string;
  unread: boolean;
};

type SectionData = {
  title: string;
  data: NotificationItem[];
};

export const NOTIFICATIONS_DATA: SectionData[] = [
  {
    title: 'HOY',
    data: [
      {
        id: '1',
        type: 'alert',
        title: "Tu garantía de 'Laptop Pro' vence hoy",
        description: 'Recuerda renovar o revisar el estado del producto antes de que expire la cobertura.',
        time: 'Hace 15 min',
        unread: true,
      },
      {
        id: '2',
        type: 'document',
        title: "Has recibido una nueva factura de 'CFE'",
        description: 'El monto es de $1,450.00 MXN con fecha de vencimiento el 25 de Octubre.',
        time: 'Hace 2 hours',
        unread: true,
      },
    ],
  },
  {
    title: 'AYER',
    data: [
      {
        id: '3',
        type: 'success',
        title: 'Vinculación exitosa',
        description: 'Se han vinculado 3 archivos al ticket de Liverpool automáticamente.',
        time: 'Ayer, 4:30 PM',
        unread: false,
      },
    ],
  },
  {
    title: 'ESTA SEMANA',
    data: [
      {
        id: '4',
        type: 'system',
        title: 'Actualización del sistema',
        description: 'Hemos optimizado la lectura de códigos QR para tus facturas.',
        time: 'Lunes, 10:15 AM',
        unread: false,
      },
    ],
  },
];
