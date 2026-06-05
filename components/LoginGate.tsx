import React, { useState } from 'react';
import { Shield, KeyRound, User, UserCheck, ArrowRight, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Logo } from './Logo';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInAnonymously 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from '../services/firebase';

interface LoginGateProps {
  onLoginSuccess: (user: { nickname: string; email?: string; isAnonymous: boolean }) => void;
}

export const LoginGate: React.FC<LoginGateProps> = ({ onLoginSuccess }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nickname, setNickname] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  const validateEmail = (val: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAuthorizing) return;
    setError('');
    setSuccess('');

    if (!email.trim() || !password.trim()) {
      setError('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!validateEmail(email)) {
      setError('Por favor, insira um e-mail válido.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve conter pelo menos 6 caracteres.');
      return;
    }

    setIsAuthorizing(true);

    try {
      if (isRegistering) {
        if (!nickname.trim()) {
          setError('Por favor, escolha um codinome/apelido para sua privacidade.');
          setIsAuthorizing(false);
          return;
        }

        // Create Firebase Authentication account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // Save customized profile details to Firestore under the Zero-Trust guidelines
        const userProfile = {
          uid: uid,
          nickname: nickname.trim(),
          email: email.toLowerCase(),
          isAnonymous: false,
          createdAt: serverTimestamp()
        };

        try {
          await setDoc(doc(db, 'users', uid), userProfile);
        } catch (dbErr) {
          handleFirestoreError(dbErr, OperationType.WRITE, `users/${uid}`);
        }

        setSuccess('Cadastro realizado com sucesso! Conectando...');
        setTimeout(() => {
          onLoginSuccess({ nickname: userProfile.nickname, email: userProfile.email, isAnonymous: false });
        }, 1200);

      } else {
        // Sign in using standard Firebase credentials
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;

        // Fetch custom user profile info
        let fetchedNickname = 'Membro Previne+';
        try {
          const userSnap = await getDoc(doc(db, 'users', uid));
          if (userSnap.exists()) {
            fetchedNickname = userSnap.data().nickname;
          }
        } catch (dbErr) {
          console.error("Erro ao carregar perfil do Firestore:", dbErr);
        }

        setSuccess(`Bem-vindo de volta, ${fetchedNickname}!`);
        setTimeout(() => {
          onLoginSuccess({ nickname: fetchedNickname, email: email.toLowerCase(), isAnonymous: false });
        }, 1200);
      }
    } catch (authErr: any) {
      console.error("Auth error details:", authErr);
      const errorCode = authErr.code;
      if (errorCode === 'auth/email-already-in-use') {
        setError('Este e-mail já está cadastrado. Que tal fazer login?');
      } else if (errorCode === 'auth/wrong-password' || errorCode === 'auth/invalid-credential' || errorCode === 'auth/user-not-found') {
        setError('E-mail ou senha incorretos. Verifique suas credenciais.');
      } else if (errorCode === 'auth/weak-password') {
        setError('A senha deve ser mais forte (mínimo de 6 caracteres).');
      } else {
        setError('Ocorreu um erro ao realizar a autenticação. Verifique sua conexão.');
      }
    } finally {
      setIsAuthorizing(false);
    }
  };

  const handleAnonymous = async () => {
    if (isAuthorizing) return;
    setIsAuthorizing(true);
    setError('');
    setSuccess('');

    try {
      await signInAnonymously(auth);
      setSuccess('Conectando como visitante anônimo...');
      setTimeout(() => {
        onLoginSuccess({ nickname: 'Visitante Anônimo', isAnonymous: true });
      }, 1000);
    } catch (authErr: any) {
      console.error("Anonymous signin error:", authErr);
      setError('Ocorreu um erro ao conectar anonimamente.');
    } finally {
      setIsAuthorizing(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl p-8 md:p-10 space-y-8 animate-in fade-in duration-500 relative overflow-hidden">
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -translate-x-12 -translate-y-12"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl translate-x-12 translate-y-12"></div>

        {/* Brand Logo Header */}
        <div className="text-center relative z-10 flex flex-col items-center justify-center">
          <Logo size="lg" centered={true} />
          <div className="h-[2px] w-12 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 mx-auto mt-5 rounded-full"></div>
          <p className="text-slate-500 text-sm mt-4 leading-relaxed max-w-xs mx-auto">
            Orientação científica e acolhimento sobre ISTs com segurança e discrição total.
          </p>
        </div>

        {/* Message Banner for Errors and Success */}
        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-3.5 rounded-2xl border border-red-100 font-medium">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-emerald-50 text-emerald-700 text-xs p-3.5 rounded-2xl border border-emerald-100 font-medium">
            {success}
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-4 relative z-10">
          {isRegistering && (
            <div className="space-y-1.5 animate-in fade-in slide-in-from-top-2 duration-300">
              <label className="text-xs font-bold text-slate-700 block ml-2">Codinome / Apelido Privado</label>
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400" />
                <input
                  type="text"
                  placeholder="Ex: Flor de Lotus, SegredoCuidado"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all"
                  required
                  disabled={isAuthorizing}
                />
              </div>
              <span className="text-[10px] text-slate-400 block ml-2 leading-normal">
                Para sua segurança, evite usar seu nome completo real como codinome.
              </span>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block ml-2">E-mail</label>
            <div className="relative">
              <Shield size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-pink-400" />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-pink-500 focus:bg-white transition-all"
                required
                disabled={isAuthorizing}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 block ml-2">Senha</label>
            <div className="relative">
              <KeyRound size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl py-3.5 pl-11 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all"
                required
                disabled={isAuthorizing}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 focus:outline-none"
                disabled={isAuthorizing}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full previne-gradient-bg text-white py-4 rounded-2xl font-black text-sm tracking-wide shadow-lg hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2 disabled:bg-slate-300 disabled:from-slate-400 disabled:to-slate-400"
            disabled={isAuthorizing}
          >
            {isAuthorizing ? (
              <>
                <Loader2 size={16} className="animate-spin text-white" />
                <span>Processando...</span>
              </>
            ) : (
              <>
                <span>{isRegistering ? 'Criar Conta de Cuidado' : 'Acessar com Perfil'}</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* Alternative anonymous route */}
        <div className="space-y-4 pt-2 relative z-10">
          <div className="flex items-center gap-3">
            <div className="h-[1px] bg-slate-100 flex-1"></div>
            <span className="text-[10px] uppercase font-black text-slate-400 tracking-wider">ou se preferir</span>
            <div className="h-[1px] bg-slate-100 flex-1"></div>
          </div>

          <button
            onClick={handleAnonymous}
            className="w-full bg-slate-50 border border-slate-200 text-slate-600 hover:bg-slate-100 py-3.5 rounded-2xl font-bold text-sm transition-all focus:outline-none active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50"
            disabled={isAuthorizing}
          >
            {isAuthorizing ? (
              <Loader2 size={16} className="animate-spin text-slate-400" />
            ) : (
              <UserCheck size={16} className="text-slate-500" />
            )}
            Entrar de forma Anônima
          </button>

          <div className="text-center pt-2">
            <button
              onClick={() => {
                if (isAuthorizing) return;
                setIsRegistering(!isRegistering);
                setError('');
                setSuccess('');
              }}
              className="text-xs text-purple-600 font-bold hover:underline focus:outline-none transition-colors disabled:opacity-50"
              disabled={isAuthorizing}
            >
              {isRegistering ? 'Já tem um perfil de cuidado? Entre aqui' : 'Novo por aqui? Crie uma conta segura'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginGate;

