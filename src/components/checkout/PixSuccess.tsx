import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, Check, Clock } from "lucide-react";
import { toast } from "sonner";

interface PixSuccessProps {
  pixCode: string;
  expirationDate: string;
  amount: number;
}

const PixSuccess = ({ pixCode, expirationDate, amount }: PixSuccessProps) => {
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const expiration = new Date(expirationDate);
      const now = new Date();
      const diff = expiration.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft("Expirado");
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

      if (days > 0) {
        setTimeLeft(`${days}d ${hours}h ${minutes}m`);
      } else if (hours > 0) {
        setTimeLeft(`${hours}h ${minutes}m`);
      } else {
        setTimeLeft(`${minutes}m`);
      }
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [expirationDate]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(pixCode);
      setCopied(true);
      toast.success("Código PIX copiado!");
      setTimeout(() => setCopied(false), 3000);
    } catch (error) {
      toast.error("Erro ao copiar código");
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mx-4 text-center">
      <div className="mb-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          PIX gerado com sucesso!
        </h2>
        <p className="text-gray-600 text-sm">
          Escaneie o QR Code abaixo para realizar o pagamento
        </p>
      </div>

      {/* QR Code */}
      <div className="bg-white p-4 rounded-xl border-2 border-purple-200 inline-block mb-4">
        <QRCodeSVG
          value={pixCode}
          size={200}
          level="H"
          includeMargin={true}
        />
      </div>

      {/* Amount */}
      <div className="mb-4">
        <p className="text-sm text-gray-500">Valor a pagar</p>
        <p className="text-2xl font-bold text-green-600">
          R$ {amount.toFixed(2).replace(".", ",")}
        </p>
      </div>

      {/* Timer */}
      <div className="flex items-center justify-center gap-2 mb-4 text-orange-600 bg-orange-50 py-2 px-4 rounded-lg">
        <Clock className="w-4 h-4" />
        <span className="text-sm font-medium">
          Expira em: {timeLeft}
        </span>
      </div>

      {/* Copy Code Button */}
      <button
        onClick={handleCopy}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-medium transition-colors"
      >
        {copied ? (
          <>
            <Check className="w-5 h-5" />
            Código copiado!
          </>
        ) : (
          <>
            <Copy className="w-5 h-5" />
            Copiar código PIX
          </>
        )}
      </button>

      {/* PIX Code Display */}
      <div className="mt-4 p-3 bg-gray-50 rounded-lg">
        <p className="text-xs text-gray-500 mb-1">Código PIX (copia e cola)</p>
        <p className="text-xs text-gray-700 break-all font-mono">
          {pixCode.substring(0, 50)}...
        </p>
      </div>

      <p className="mt-4 text-xs text-gray-500">
        Após o pagamento, a confirmação será enviada automaticamente.
      </p>
    </div>
  );
};

export default PixSuccess;
