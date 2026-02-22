import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Calendar, Mail, ArrowRight, ShieldCheck, Shield, KeyRound, Loader2 } from "lucide-react";
import { authApi } from "../api/authApi";
import { motion, AnimatePresence } from "motion/react";
import loginBg from "../assets/login-bg.png"; // Importing the local asset

interface LoginPageProps {
  onLogin: (role: 'admin' | 'manager') => void;
}

interface DecodedToken {
  sub: string;
  role: string;
  userId: number;
  name: string;
  iat: number;
  exp: number;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [role, setRole] = useState<'admin' | 'manager'>('admin');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  // Reset state when role changes
  useEffect(() => {
    setStep('email');
    setEmail("");
    setOtp("");
    setError("");
  }, [role]);

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    try {
      await authApi.requestOtp(email);
      setStep('otp');
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const parseJwt = (token: string): DecodedToken | null => {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error("Failed to parse JWT", e);
      return null;
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authApi.verifyOtp(email, otp);
      const token = response.token;
      
      if (token) {
        localStorage.setItem('accessToken', token);
        const decoded = parseJwt(token);

        if (decoded) {
            const expectedRole = role === 'admin' ? 'ROLE_ADMIN' : 'ROLE_MANAGER';
            if (decoded.role === expectedRole) {
                onLogin(role);
            } else {
                setError(`Access denied. You are logged in as ${decoded.role} but trying to access ${role} portal.`);
                localStorage.removeItem('accessToken');
            }
        } else {
            setError("Invalid token received.");
        }
      } else {
         setError("No token received from server.");
      }
    } catch (err: any) {
       setError(err.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030213] flex relative overflow-hidden">
      {/* Left Section - Form */}
     <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex flex-col justify-center px-4 sm:px-12 lg:px-24 z-10 bg-[#030213] relative border-r border-white/5"
      >
         {/* Background elements for left side ambiance - Brutalist Grid */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20 z-0">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]" />
         </div>

         <div className="relative z-20 w-full max-w-[420px] mx-auto">
            <div className="bg-[#030213] border-2 border-white/20 rounded-none p-6 sm:p-10 shadow-[8px_8px_0_0_rgba(255,255,255,0.1)] relative overflow-visible">
              {/* Aggressive corner accents */}
              <div className="absolute -top-2 -left-2 w-4 h-4 border-t-2 border-l-2 border-blue-500" />
              <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-blue-500" />
              <div className="absolute -bottom-2 -left-2 w-4 h-4 border-b-2 border-l-2 border-blue-500" />
              <div className="absolute -bottom-2 -right-2 w-4 h-4 border-b-2 border-r-2 border-blue-500" />
              <AnimatePresence mode="wait">
                <motion.div
                  key={role}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.5 }}
                    className="mb-8"
                  >
                    <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter mb-3 leading-none">
                      {step === 'email' ? (role === 'admin' ? 'Admin Portal' : 'Manager Portal') : 'Verify Identity'}
                    </h1>
                    <p className="text-gray-400 text-xs sm:text-sm font-bold uppercase tracking-widest leading-relaxed">
                      {step === 'email' 
                        ? `Secure access for ${role === 'admin' ? 'administrators' : 'operational managers'}.` 
                        : `Enter the code sent to ${email}`}
                    </p>
                  </motion.div>

                  <AnimatePresence>
                  {step === 'email' && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                      animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
                      exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                      className="overflow-hidden"
                    >
                        <div className="grid grid-cols-2 gap-4">
                          <button
                            type="button"
                            onClick={() => setRole('admin')}
                            className={`relative overflow-visible flex flex-col items-center justify-center gap-2 py-4 rounded-none border-2 transition-all duration-200 group ${
                              role === 'admin'
                                ? 'bg-blue-600/10 border-blue-500 text-blue-400 shadow-[4px_4px_0_0_rgba(59,130,246,0.5)] -translate-x-1 -translate-y-1'
                                : 'bg-transparent border-white/20 text-gray-500 hover:border-white/50 hover:text-gray-300'
                            }`}
                          >
                            <ShieldCheck className={`w-6 h-6 sm:w-8 sm:h-8 z-10 transition-transform duration-300 ${role === 'admin' ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}`} />
                            <span className="font-black text-[10px] sm:text-xs tracking-widest uppercase z-10">Admin</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setRole('manager')}
                            className={`relative overflow-visible flex flex-col items-center justify-center gap-2 py-4 rounded-none border-2 transition-all duration-200 group ${
                              role === 'manager'
                                ? 'bg-indigo-600/10 border-indigo-500 text-indigo-400 shadow-[4px_4px_0_0_rgba(99,102,241,0.5)] -translate-x-1 -translate-y-1'
                                : 'bg-transparent border-white/20 text-gray-500 hover:border-white/50 hover:text-gray-300'
                            }`}
                          >
                            <Shield className={`w-6 h-6 sm:w-8 sm:h-8 z-10 transition-transform duration-300 ${role === 'manager' ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}`} />
                            <span className="font-black text-[10px] sm:text-xs tracking-widest uppercase z-10">Manager</span>
                          </button>
                        </div>
                    </motion.div>
                  )}
                  </AnimatePresence>

                  <form onSubmit={step === 'email' ? handleSendOtp : handleVerifyOtp} className="space-y-5">
                    <AnimatePresence mode="wait">
                      {step === 'email' ? (
                        <motion.div 
                          key="email-input"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-1.5"
                        >
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Email Address</label>
                          <div className="relative group mt-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium pr-3 border-r-2 border-white/20 flex items-center gap-2 pointer-events-none transition-colors group-focus-within:text-blue-400 group-focus-within:border-blue-500">
                               <Mail className="w-5 h-5" />
                            </div>
                            <Input
                              type="email"
                              placeholder="admin@example.com"
                              className="pl-14 h-14 bg-transparent border-2 border-white/20 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-blue-500 rounded-none transition-all text-lg font-bold hover:border-white/50 focus-visible:shadow-[4px_4px_0_0_rgba(59,130,246,0.5)] focus-visible:-translate-y-1 focus-visible:-translate-x-1"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              autoFocus
                            />
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div 
                          key="otp-input"
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-1.5"
                        >
                          <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Verification Code</label>
                          <div className="relative group mt-1 flex justify-center">
                            {/* We replace the standard input with our new InputOTP component from input-otp.tsx, but since we didn't import it here, we'll style the standard input to match brutalist expectations for now */}
                            <Input
                              type="password"
                              placeholder="• • • • • •"
                              maxLength={6}
                              className="h-16 bg-transparent border-2 border-white/20 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-blue-500 rounded-none transition-all font-mono tracking-[1em] text-center text-2xl font-black hover:border-white/50 focus-visible:shadow-[4px_4px_0_0_rgba(59,130,246,0.5)] focus-visible:-translate-y-1 focus-visible:-translate-x-1"
                              value={otp}
                              onChange={(e) => setOtp(e.target.value)}
                              autoFocus
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <AnimatePresence>
                      {error && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: 'auto', marginTop: 12 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="p-4 rounded-none border-2 border-red-500 bg-[#030213] flex items-center gap-3 shadow-[4px_4px_0_0_rgba(239,68,68,0.3)]">
                             <div className="w-3 h-3 border-2 border-red-500 bg-red-500 flex items-center justify-center font-black text-[#030213] text-[8px]">!</div>
                             <span className="text-red-500 text-xs font-black uppercase tracking-widest">{error}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button 
                        type="submit" 
                        className={`w-full h-14 text-sm font-black uppercase tracking-widest rounded-none border-2 transition-all duration-200 mt-2 ${
                          role === 'admin' 
                            ? 'bg-blue-600 border-blue-600 hover:bg-transparent hover:text-blue-500 text-white shadow-[6px_6px_0_0_rgba(59,130,246,0.3)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5' 
                            : 'bg-indigo-600 border-indigo-600 hover:bg-transparent hover:text-indigo-500 text-white shadow-[6px_6px_0_0_rgba(99,102,241,0.3)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5'
                        }`}
                        disabled={isLoading || (step === 'email' ? !email || !email.includes('@') : otp.length !== 6)}
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-3">
                             <Loader2 className="w-5 h-5 animate-spin" />
                             PROCESSING...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-3">
                            {step === 'email' ? 'REQUEST OTP' : 'VERIFY & LOGIN'} <ArrowRight className="w-5 h-5" />
                          </span>
                        )}
                      </Button>
                    </motion.div>

                    {step === 'otp' && (
                      <motion.button 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        type="button"
                        onClick={() => setStep('email')}
                        className="w-full text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-white transition-colors py-4 flex items-center justify-center gap-2 group mt-2"
                      >
                        NOT {email}? <span className="text-blue-500 group-hover:underline underline-offset-4">CHANGE EMAIL</span>
                      </motion.button>
                    )}
                  </form>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <p className="text-center text-gray-600/50 text-[10px] mt-8 font-medium tracking-widest uppercase">
               Secured by SportBook Identity
            </p>
         </div>
      </motion.div>

      {/* Right Section - Hero Image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={role}
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 30 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0"
          >
            {/* Dynamic Gradient Overlay */}
            <div 
              className={`absolute inset-0 z-10 box-border border-l border-white/5 transition-colors duration-1000 ${
                role === 'admin' 
                  ? 'bg-gradient-to-br from-blue-900/40 to-indigo-900/60' 
                  : 'bg-gradient-to-br from-indigo-900/40 to-purple-900/60'
              }`} 
            />
            
            <motion.img 
              src={loginBg} 
              alt="Login Background" 
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className="absolute inset-0 w-full h-full object-cover"
            />

            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.6, type: "spring", stiffness: 100 }}
              className="absolute bottom-12 left-12 right-12 z-20 p-8 bg-[#030213]/90 border-4 border-white shadow-[12px_12px_0_0_rgba(255,255,255,0.2)] rounded-none"
            >
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-6 leading-[1.1] uppercase tracking-tighter">
                  {role === 'admin' 
                    ? "Performance analytics and master management." 
                    : "Streamline operations and manage squads."}
                </h2>
                <div className="w-16 h-2 bg-blue-500 mb-6" />
                <p className="text-sm sm:text-base text-gray-400 font-bold uppercase tracking-widest leading-loose">
                  {role === 'admin'
                    ? "Seamlessly manage turf operations, track booking limits, and force-optimize resource allocation completely via the Admin Command Center."
                    : "Command managers with real-time intelligence, rigorous scheduling tools, and highly efficient comms for bulletproof operations."}
                </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}