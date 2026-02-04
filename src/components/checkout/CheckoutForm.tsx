import { useState } from "react";
import nubankProduct from "@/assets/nubank-product.png";
import pixLogo from "@/assets/pix-logo.png";

interface FormData {
  name: string;
  email: string;
  cpf: string;
  phone: string;
  cep: string;
  paymentMethod: "card" | "pix";
}

interface CheckoutFormProps {
  onSubmit: (data: FormData) => void;
  isLoading: boolean;
}

const CheckoutForm = ({ onSubmit, isLoading }: CheckoutFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    cpf: "",
    phone: "",
    cep: "",
    paymentMethod: "pix",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const formatCPF = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})/, "$1-$2")
      .slice(0, 14);
  };

  const formatPhone = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "($1) $2")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 15);
  };

  const formatCEP = (value: string) => {
    return value
      .replace(/\D/g, "")
      .replace(/(\d{5})(\d)/, "$1-$2")
      .slice(0, 9);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 px-4 pt-3 pb-6">
      {/* Identificação Section */}
      <div className="checkout-section">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Identificação
        </h2>

        <div className="space-y-4">
          <div>
            <label className="checkout-label">Nome completo</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Seu nome completo"
              className="checkout-input"
              required
            />
          </div>

          <div>
            <label className="checkout-label">E-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Seu e-mail"
              className="checkout-input"
              required
            />
          </div>

          <div>
            <label className="checkout-label">CPF/CNPJ</label>
            <input
              type="text"
              name="cpf"
              value={formData.cpf}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  cpf: formatCPF(e.target.value),
                }))
              }
              placeholder="Digite seu CPF ou CNPJ"
              className="checkout-input"
              required
            />
          </div>

          <div>
            <label className="checkout-label">Celular</label>
            <div className="flex gap-2">
              <div className="flex items-center gap-2 px-3 py-3 rounded-lg border border-gray-200 bg-white">
                <span className="text-lg">🇧🇷</span>
                <span className="text-sm text-gray-600">+55</span>
              </div>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    phone: formatPhone(e.target.value),
                  }))
                }
                placeholder="(00) 00000-0000"
                className="checkout-input flex-1"
                required
              />
            </div>
          </div>
        </div>
      </div>
      {/* Pagamento Section */}
      <div className="checkout-section">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Pagamento
        </h2>

        <div className="flex items-center gap-3 mb-4 p-3 bg-white rounded-lg border border-gray-200">
          <img src={pixLogo} alt="Pix" className="h-12 w-auto" />
          <span className="text-sm font-medium text-gray-700">Pagamento via PIX</span>
        </div>

        <div className="bg-purple-50 rounded-lg p-4 text-sm text-gray-700">
          <p className="flex items-start gap-2">
            <span className="text-green-500">🔒</span>
            <span>
              <strong>Pagamento seguro da taxa de empréstimo</strong><br/>
              Seu pagamento é processado em ambiente 100% seguro.
              A taxa de liberação será confirmada instantaneamente
              após a leitura do QR Code PIX.
            </span>
          </p>
        </div>

        {/* Parcelas */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-green-500">💰</span>
          <span className="text-sm text-gray-700">
            <strong>Valor à vista:</strong> R$ 28,63
          </span>
        </div>
      </div>

      {/* Resumo */}
      <div className="checkout-section">
        <div className="flex justify-between items-center mb-3 gap-2">
          <h3 className="font-bold text-gray-800 text-sm sm:text-base">Taxa de empréstimo</h3>
          <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
            <span className="text-xs sm:text-sm text-gray-500 whitespace-nowrap">1 item(s)</span>
            <span className="text-xs sm:text-sm text-gray-400">•</span>
            <span className="text-base sm:text-lg font-bold text-green-500 whitespace-nowrap">R$ 28,63</span>
          </div>
        </div>

        <div className="flex items-center gap-3 py-3 border-t border-gray-200">
          <img 
            src={nubankProduct}
            alt="Produto"
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <p className="text-sm text-gray-700">
              Pagamento taxa do empréstimo
            </p>
          </div>
        </div>

        {/* Submit Button inside card */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 py-3 rounded-xl font-bold text-white uppercase tracking-wide transition-all duration-300 bg-[#8506b7] hover:bg-[#9a18d0] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processando..." : "FINALIZAR PAGAMENTO"}
        </button>

        <p className="text-xs text-gray-500 text-center mt-3">
          Ao finalizar o pagamento da taxa você receberá um e-mail para confirmação da conta bancária ou PIX para receber o valor contratado.
        </p>
      </div>
    </form>
  );
};

export default CheckoutForm;
