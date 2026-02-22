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
         {/* Background elements for left side ambiance */}
         <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-600/20 blur-[120px]" />
            <div className="absolute bottom-[-10%] right-[10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px]" />
         </div>

         <div className="relative z-20 w-full max-w-[420px] mx-auto">
            <div className="backdrop-blur-xl bg-white/[0.02] border border-white/[0.06] rounded-[2rem] p-6 sm:p-8 shadow-2xl overflow-hidden">
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
                    <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight mb-2">
                      {step === 'email' ? (role === 'admin' ? 'Admin Portal' : 'Manager Portal') : 'Verify Identity'}
                    </h1>
                    <p className="text-gray-400 text-sm leading-relaxed">
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
                        <div className="grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setRole('admin')}
                            className={`relative overflow-hidden flex flex-col items-center justify-center gap-2 py-3 sm:py-4 rounded-xl border transition-all duration-300 group ${
                              role === 'admin'
                                ? 'bg-blue-600/10 border-blue-500/50 text-blue-400'
                                : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:border-white/10 hover:text-gray-300'
                            }`}
                          >
                            {role === 'admin' && (
                              <motion.div layoutId="activeRole" className="absolute inset-0 bg-blue-500/5 z-0" />
                            )}
                            <ShieldCheck className={`w-5 h-5 sm:w-6 sm:h-6 z-10 transition-transform duration-300 ${role === 'admin' ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}`} />
                            <span className="font-medium text-[10px] sm:text-xs tracking-wide uppercase z-10">Admin</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => setRole('manager')}
                            className={`relative overflow-hidden flex flex-col items-center justify-center gap-2 py-3 sm:py-4 rounded-xl border transition-all duration-300 group ${
                              role === 'manager'
                                ? 'bg-indigo-600/10 border-indigo-500/50 text-indigo-400'
                                : 'bg-white/5 border-white/5 text-gray-500 hover:bg-white/10 hover:border-white/10 hover:text-gray-300'
                            }`}
                          >
                             {role === 'manager' && (
                              <motion.div layoutId="activeRole" className="absolute inset-0 bg-indigo-500/5 z-0" />
                            )}
                            <Shield className={`w-5 h-5 sm:w-6 sm:h-6 z-10 transition-transform duration-300 ${role === 'manager' ? 'scale-110 drop-shadow-md' : 'group-hover:scale-110'}`} />
                            <span className="font-medium text-[10px] sm:text-xs tracking-wide uppercase z-10">Manager</span>
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
                          <label className="text-xs font-semibold text-gray-400 ml-1">Email Address</label>
                          <div className="relative group">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-medium pr-3 border-r border-white/10 flex items-center gap-2 pointer-events-none transition-colors group-focus-within:text-blue-400 group-focus-within:border-blue-500/30">
                               <Mail className="w-4 h-4" />
                            </div>
                            <Input
                              type="email"
                              placeholder="admin@example.com"
                              className="pl-12 h-12 bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-transparent rounded-xl transition-all text-lg tracking-wide hover:bg-white/[0.05]"
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
                          <label className="text-xs font-semibold text-gray-400 ml-1">Verification Code</label>
                          <div className="relative group">
                            <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-blue-400 transition-colors pointer-events-none" />
                            <Input
                              type="password"
                              placeholder="• • • • • •"
                              maxLength={6}
                              className="pl-12 h-12 bg-white/[0.03] border-white/10 text-white placeholder:text-gray-600 focus-visible:ring-2 focus-visible:ring-blue-500/30 focus-visible:border-transparent rounded-xl transition-all font-mono tracking-[0.5em] text-center text-xl hover:bg-white/[0.05]"
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
                          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center gap-3">
                             <div className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                             <span className="text-red-300 text-xs font-medium">{error}</span>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                      <Button 
                        type="submit" 
                        className={`w-full h-12 text-base font-semibold rounded-xl transition-all duration-300 ${
                          role === 'admin' 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/20' 
                            : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20'
                        }`}
                        disabled={isLoading || (step === 'email' ? !email || !email.includes('@') : otp.length !== 6)}
                      >
                        {isLoading ? (
                          <span className="flex items-center gap-2">
                             <Loader2 className="w-4 h-4 animate-spin" />
                             Processing...
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            {step === 'email' ? 'Request OTP' : 'Verify & Login'} <ArrowRight className="w-4 h-4" />
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
                        className="w-full text-xs text-gray-500 hover:text-gray-300 transition-colors py-2 flex items-center justify-center gap-1 group"
                      >
                        Not {email}? <span className="text-blue-400 group-hover:underline">Change email</span>
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

            {/* Overlay Content on Image */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6 }}
              className="absolute bottom-12 left-12 z-20 max-w-xl p-8 bg-black/30 backdrop-blur-md rounded-3xl border border-white/10"
            >
                <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                  {role === 'admin' 
                    ? "Performances analytics and management at your fingertips." 
                    : "Streamline operations and manage teams effortlessly."}
                </h2>
                <p className="text-lg text-blue-100/90 leading-relaxed">
                  {role === 'admin'
                    ? "Seamlessly manage your turf operations, track booking limits, and optimize resource allocation with our advanced admin portal."
                    : "Empower your managers with real-time insights, scheduling tools, and simplified communication to keep things running smooth."}
                </p>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}