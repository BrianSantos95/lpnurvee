// Função responsável por chamar a sua API de Conversões segura do Vercel
export const trackServerEvent = async (eventName: string, customData = {}) => {
  try {
    // Pegando a URL atual na qual o evento aconteceu
    const eventURL = window.location.href;

    // Gerando um ID único para esse evento.
    // Dica de Ouro: Enviar o mesmo ID no fbq('track') e aqui no Server
    // diz ao Facebook que "eles são o mesmo evento", e o Facebook faz a desduplicação e evita contar 2x.
    const eventId = `evt_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    // 1. Disparando no frontend com o Pixel normal (que já deixamos no HTML)
    if ((window as any).fbq) {
      (window as any).fbq('track', eventName, customData, { eventID: eventId });
    }

    // 2. Disparando na nossa API de Conversões Serverless do Vercel
    const response = await fetch('/api/fb-tracking', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        eventName,
        eventId,
        eventURL,
        customData,
      }),
    });

    if (!response.ok) {
      console.warn("Aviso: disparo do evento da CAPI não faturou com sucesso", response.status);
    }
  } catch (error) {
    console.error("Falha ao registrar CAPI:", error);
  }
};
