"use client";

import { useEffect } from 'react';

const BrevoWidget = () => {
  useEffect(() => {
    // Configuração do Brevo
    (window as any).BrevoConversationsID = '69a0cc58813662e1b6024b13';
    (window as any).BrevoConversations = (window as any).BrevoConversations || function() {
      ((window as any).BrevoConversations.q = (window as any).BrevoConversations.q || []).push(arguments);
    };

    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://conversations-widget.brevo.com/brevo-conversations.js';
    document.head.appendChild(script);

    return () => {
      // Limpeza ao desmontar o componente
      const widget = document.getElementById('brevo-conversations-widget');
      if (widget) widget.remove();
      if (script.parentNode) script.parentNode.removeChild(script);
      delete (window as any).BrevoConversations;
      delete (window as any).BrevoConversationsID;
    };
  }, []);

  return null;
};

export default BrevoWidget;