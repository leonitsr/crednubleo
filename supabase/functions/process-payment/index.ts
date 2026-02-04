import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface PaymentRequest {
  amount: number;
  name: string;
  email: string;
  cpf: string;
  phone: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const publicKey = Deno.env.get('pk_2gfDhNrmc7dlvpEQCQkRjlk5h3B7EsXzVdiapp_crFtrYxNO');
    const secretKey = Deno.env.get('sk_QO3i9mCLCu86Nr0rDC2uysMiYUdOR9A9Z5yVDixhxFlfNOr9');

    if (!publicKey || !secretKey) {
      throw new Error('Chaves de API não configuradas');
    }

    const { amount, name, email, cpf, phone }: PaymentRequest = await req.json();

    // Validação básica
    if (!amount || !name || !email || !cpf || !phone) {
      return new Response(
        JSON.stringify({ error: 'Dados incompletos' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Criar auth header em Base64
    const encoder = new TextEncoder();
    const credentials = encoder.encode(`${publicKey}:${secretKey}`);
    const base64Credentials = btoa(String.fromCharCode(...credentials));
    const auth = `Basic ${base64Credentials}`;

    const payload = {
      amount: Math.round(amount * 100), // Converter para centavos
      paymentMethod: 'pix',
      customer: {
        name,
        email,
        document: {
          type: cpf.replace(/\D/g, '').length > 11 ? 'cnpj' : 'cpf',
          number: cpf.replace(/\D/g, ''),
        },
        phone: phone.replace(/\D/g, ''),
      },
      items: [
        {
          title: 'Pagamento taxa do empréstimo',
          unitPrice: Math.round(amount * 100),
          quantity: 1,
          tangible: false,
        }
      ],
    };

    console.log('Enviando pagamento para GestaoPay:', JSON.stringify(payload));

    const response = await fetch('https://api.gestaopay.com.br/v1/transactions', {
      method: 'POST',
      headers: {
        'Authorization': auth,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    console.log('Resposta da GestaoPay:', JSON.stringify(data));

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: data.message || 'Erro ao processar pagamento', details: data }),
        { 
          status: response.status, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error: unknown) {
    console.error('Erro na requisição:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro interno do servidor';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
