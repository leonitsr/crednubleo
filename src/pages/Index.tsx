import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import CheckoutHero from "@/components/checkout/CheckoutHero";
import CheckoutForm from "@/components/checkout/CheckoutForm";
import PixSuccess from "@/components/checkout/PixSuccess";

interface PixData {
  pixCode: string;
  expirationDate: string;
  amount: number;
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [pixData, setPixData] = useState<PixData | null>(null);

  const handleSubmit = async (formData: {
    name: string;
    email: string;
    cpf: string;
    phone: string;
    cep: string;
    paymentMethod: "card" | "pix";
  }) => {
    setIsLoading(true);

    try {
      console.log("Dados do formulário:", formData);

      const amount = 28.63;

      const { data, error } = await supabase.functions.invoke('process-payment', {
        body: {
          amount,
          name: formData.name,
          email: formData.email,
          cpf: formData.cpf,
          phone: formData.phone,
        },
      });

      if (error) {
        throw error;
      }

      console.log("Resposta do pagamento:", data);

      if (data.success && data.data?.pix?.qrcode) {
        setPixData({
          pixCode: data.data.pix.qrcode,
          expirationDate: data.data.pix.expirationDate,
          amount,
        });
      } else if (data.success) {
        toast.success("Pagamento processado com sucesso!", {
          description: "Você receberá um e-mail com os detalhes.",
        });
      } else {
        throw new Error(data.error || "Erro ao processar pagamento");
      }
    } catch (error) {
      console.error("Erro na requisição:", error);
      toast.error("Erro ao processar pagamento", {
        description: "Por favor, tente novamente.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Show PIX success screen if we have PIX data
  if (pixData) {
    return (
      <div className="min-h-screen checkout-hero-gradient flex items-center justify-center py-8">
        <PixSuccess
          pixCode={pixData.pixCode}
          expirationDate={pixData.expirationDate}
          amount={pixData.amount}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen checkout-hero-gradient">
      <div className="max-w-md mx-auto pb-8">
        <CheckoutHero />
        <CheckoutForm onSubmit={handleSubmit} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Index;
