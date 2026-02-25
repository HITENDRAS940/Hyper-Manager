import { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Mail, ArrowRight, ShieldCheck, Shield, Loader2 } from "lucide-react";
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
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden font-sans">
      {/* Background Image - Full Screen coverage */}
      <div className="absolute inset-0 z-0">
        <motion.img 
          src={loginBg} 
          alt="Stadium Background" 
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="absolute inset-0 w-full h-full object-cover"
        />
        {/* Dynamic Dark Gradient Overlay for depth and readability */}
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/40 to-black/60 z-10" />
        
        {/* Pitch Green Glow Overlay */}
        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-emerald-500/20 to-transparent z-10" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-[440px] px-4 z-20"
      >
        <div className="backdrop-blur-2xl bg-black/40 border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl relative overflow-hidden">
          {/* Subtle Green Glass Glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/10 blur-[100px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-emerald-500/10 blur-[100px] pointer-events-none" />

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
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-2 h-8 bg-emerald-500 rounded-full" />
                      <h1 className="text-3xl sm:text-4xl font-black text-white uppercase tracking-tighter leading-none">
                        {step === 'email' ? (role === 'admin' ? 'Admin' : 'Manager') : 'Verify'}
                      </h1>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm font-medium uppercase tracking-[0.2em] leading-relaxed">
                      {step === 'email' 
                        ? `Secure gate for ${role === 'admin' ? 'administrators' : 'operational managers'}.` 
                        : `Verification code sent to ${email}`}
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
                            className={`relative overflow-visible flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border transition-all duration-300 group ${
                              role === 'admin'
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                                : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300'
                            }`}
                          >
                            <ShieldCheck className={`w-6 h-6 sm:w-8 sm:h-8 z-10 transition-transform duration-300 ${role === 'admin' ? 'scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'group-hover:scale-110'}`} />
                            <span className="font-black text-[10px] sm:text-xs tracking-widest uppercase z-10">Admin</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setRole('manager')}
                            className={`relative overflow-visible flex flex-col items-center justify-center gap-2 py-4 rounded-2xl border transition-all duration-300 group ${
                              role === 'manager'
                                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]'
                                : 'bg-white/5 border-white/10 text-gray-500 hover:border-white/30 hover:text-gray-300'
                            }`}
                          >
                            <Shield className={`w-6 h-6 sm:w-8 sm:h-8 z-10 transition-transform duration-300 ${role === 'manager' ? 'scale-110 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'group-hover:scale-110'}`} />
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
                           <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-1">Email Access</label>
                          <div className="relative group mt-1">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 border-r border-white/10 pr-3 flex items-center gap-2 pointer-events-none transition-colors group-focus-within:text-emerald-500">
                               <Mail className="w-5 h-5" />
                            </div>
                            <Input
                              type="email"
                              placeholder="operator@stadium.com"
                              className="pl-14 h-14 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-emerald-500 rounded-xl transition-all text-lg font-bold hover:bg-white/[0.08]"
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
                              className="h-16 bg-white/5 border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-0 focus-visible:border-emerald-500 rounded-xl transition-all font-mono tracking-[1em] text-center text-2xl font-black hover:bg-white/[0.08]"
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

                     <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button 
                        type="submit" 
                        className={`w-full h-14 text-sm font-black uppercase tracking-widest rounded-xl border-none transition-all duration-300 mt-2 bg-emerald-500 hover:bg-emerald-400 text-black shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_40px_rgba(16,185,129,0.5)]`}
                        disabled={isLoading || (step === 'email' ? !email || !email.includes('@') : otp.length !== 6)}
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-3">
                             <Loader2 className="w-5 h-5 animate-spin" />
                             PROCESSING...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-3">
                            {step === 'email' ? 'GET ACCESS CODE' : 'VERIFY IDENTITY'} <ArrowRight className="w-5 h-5" />
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
                        NOT {email}? <span className="text-emerald-500 group-hover:underline underline-offset-4">CHANGE EMAIL</span>
                      </motion.button>
                    )}
                  </form>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <p className="text-center text-gray-500 text-[10px] mt-8 font-medium tracking-[0.3em] uppercase opacity-50">
              Encrypted via SportBook Core
            </p>
          </motion.div>
        </div>
  );
}