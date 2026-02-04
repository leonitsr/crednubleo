import heroWoman from "@/assets/hero-woman.jpg";

const CheckoutHero = () => {
  return (
    <div className="checkout-hero-gradient px-4 pt-4">
      {/* Hero Image */}
      <div className="max-w-md mx-auto">
        <img
          src={heroWoman}
          alt="Mulher segurando cartão"
          className="w-full max-w-sm mx-auto object-contain rounded-xl"
        />
      </div>
    </div>
  );
};

export default CheckoutHero;
