import AuthForm from "@/components/auth/AuthForm";

export default function LoginPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#F6F3EE]">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, #0E1B33 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
      />
      
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#8F7AD1]/20 rounded-full blur-[100px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#C9A46A]/20 rounded-full blur-[100px]" />

      <div className="relative z-10 w-full flex flex-col items-center">
        <AuthForm />
        
        <div className="mt-8 text-center">
            <p className="mono text-[10px] text-[#A1A1AA] uppercase tracking-widest">
                QuizzMe • Astro Intelligence
            </p>
        </div>
      </div>
    </div>
  );
}
