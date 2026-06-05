import React, { useState, useEffect } from 'react';
import { MessageSquare, Heart, ShieldAlert, Sparkles, Send, User, Calendar, Smile, AlertCircle } from 'lucide-react';
import { db, auth, handleFirestoreError, OperationType } from '../services/firebase';
import { collection, query, orderBy, onSnapshot, doc, setDoc, updateDoc, increment, serverTimestamp } from 'firebase/firestore';

interface Comment {
  id: string;
  nickname: string;
  text: string;
  tag: string;
  likes: number;
  createdAt: string;
  isAnonymous: boolean;
  userId: string;
}

const DEFAULT_COMMENTS: Comment[] = [
  {
    id: "1",
    nickname: "GirassolLilás",
    text: "Espaço incrivelmente acolhedor! Tirou todas as minhas dúvidas sobre a PEP de forma rápida sem que eu precisasse me expor. Agradeço imensamente aos desenvolvedores da Spark Tech.",
    tag: "Acolhimento",
    likes: 24,
    createdAt: "2026-05-24T12:00:00Z",
    isAnonymous: false,
    userId: "system"
  },
  {
    id: "2",
    nickname: "Visitante Anônimo",
    text: "Saber que o SUS oferece PrEP gratuita e exames rápidos sem julgamentos mudou totalmente minha forma de planejar minha prevenção. Esse site é utilidade pública!",
    tag: "Prevenção",
    likes: 18,
    createdAt: "2026-05-24T10:15:00Z",
    isAnonymous: true,
    userId: "system"
  },
  {
    id: "3",
    nickname: "ForçaCuidado",
    text: "Receber orientações científicas limpas, leves e com empatia tira um peso enorme das costas de qualquer pessoa passando por dúvidas imediatas. Se cuidem, pessoal!",
    tag: "Apoio Mútuo",
    likes: 31,
    createdAt: "2026-05-23T18:40:00Z",
    isAnonymous: false,
    userId: "system"
  }
];

export const CommentsSection: React.FC<{ activeUser: { nickname: string; isAnonymous: boolean } | null }> = ({ activeUser }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [selectedTag, setSelectedTag] = useState('Apoio Mútuo');
  const [postAnonymously, setPostAnonymously] = useState(false);
  const [likedIds, setLikedIds] = useState<string[]>([]);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load comments in real-time from Firestore database
  useEffect(() => {
    const savedLikes = localStorage.getItem('previne_user_liked_ids');
    if (savedLikes) {
      setLikedIds(JSON.parse(savedLikes));
    }

    // Zero-Trust listener connection test & real-time update
    const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        // If Firestore is empty, seed comments or fall back to default comments
        setComments(DEFAULT_COMMENTS);
        return;
      }

      const loadedComments = snapshot.docs.map(doc => {
        const data = doc.data();
        let createdAtStr = new Date().toISOString();
        if (data.createdAt) {
          createdAtStr = typeof data.createdAt.toDate === 'function' 
            ? data.createdAt.toDate().toISOString()
            : data.createdAt;
        }
        return {
          id: doc.id,
          nickname: data.nickname || 'Anônimo',
          text: data.text || '',
          tag: data.tag || 'Geral',
          likes: data.likes || 0,
          createdAt: createdAtStr,
          isAnonymous: data.isAnonymous ?? true,
          userId: data.userId || ''
        };
      });
      setComments(loadedComments);
    }, (error) => {
      console.error("onSnapshot error:", error);
      // Fallback locally if network or permissions fail gracefully
      setComments(DEFAULT_COMMENTS);
      handleFirestoreError(error, OperationType.GET, 'comments');
    });

    return () => unsubscribe();
  }, []);

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const cleanText = newComment.trim();
    if (!cleanText) {
      setErrorMsg("O texto do comentário não pode estar vazio.");
      return;
    }

    if (cleanText.length < 10) {
      setErrorMsg("Sua mensagem deve conter pelo menos 10 caracteres para agregar valor ao mural.");
      return;
    }

    const authorName = postAnonymously || !activeUser 
      ? "Visitante Anônimo" 
      : activeUser.nickname;

    const commentId = 'c_' + Math.random().toString(36).substring(2, 11);
    const authorUid = auth.currentUser?.uid || 'anonymous_guest';

    const freshComment = {
      id: commentId,
      nickname: authorName,
      text: cleanText,
      tag: selectedTag,
      likes: 0,
      createdAt: serverTimestamp(), // Handled via Request Timestamp to prevent system spoofing
      isAnonymous: postAnonymously || (activeUser?.isAnonymous ?? true),
      userId: authorUid
    };

    try {
      await setDoc(doc(db, 'comments', commentId), freshComment);
      setNewComment('');
      setPostAnonymously(false);
    } catch (error) {
      console.error("Error creating comment:", error);
      setErrorMsg("Houve um problema de permissão no banco ao publicar seu comentário. Certifique-se de estar logado.");
      handleFirestoreError(error, OperationType.WRITE, `comments/${commentId}`);
    }
  };

  const handleLike = async (id: string) => {
    // If it's a seed system comment, handle locally or ignore
    if (id === '1' || id === '2' || id === '3') {
      const isLiked = likedIds.includes(id);
      let newLikes: string[];
      if (isLiked) {
        newLikes = likedIds.filter(x => x !== id);
      } else {
        newLikes = [...likedIds, id];
      }
      setLikedIds(newLikes);
      localStorage.setItem('previne_user_liked_ids', JSON.stringify(newLikes));
      setComments(prev => prev.map(c => {
        if (c.id === id) {
          return { ...c, likes: isLiked ? Math.max(0, c.likes - 1) : c.likes + 1 };
        }
        return c;
      }));
      return;
    }

    const isLiked = likedIds.includes(id);
    let newLikes: string[];

    if (isLiked) {
      newLikes = likedIds.filter(x => x !== id);
    } else {
      newLikes = [...likedIds, id];
    }

    setLikedIds(newLikes);
    localStorage.setItem('previne_user_liked_ids', JSON.stringify(newLikes));

    try {
      await updateDoc(doc(db, 'comments', id), {
        likes: increment(isLiked ? -1 : 1)
      });
    } catch (error) {
      console.error("Error supporting comment:", error);
      handleFirestoreError(error, OperationType.UPDATE, `comments/${id}`);
    }
  };

  const tagsList = ["Prevenção", "Apoio Mútuo", "Dúvida", "Agradecimento", "Acolhimento"];


  return (
    <div className="max-w-3xl mx-auto py-6 animate-in fade-in duration-500 space-y-8">
      {/* Visual Header */}
      <div className="text-center">
        <h2 className="text-3xl font-black text-slate-800 tracking-tight flex items-center justify-center gap-2">
          <MessageSquare className="text-purple-600" size={32} />
          Mural de Solidariedade & Comentários
        </h2>
        <p className="text-slate-500 mt-2 max-w-lg mx-auto text-sm leading-relaxed">
          Compartilhe sua experiência positiva, desabafos leves ou palavras de força com outros integrantes de nossa rede segura e discreta.
        </p>
      </div>

      {/* Post comment block */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl p-6 md:p-8 space-y-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-2xl"></div>

        <div className="flex items-center gap-2">
          <Smile className="text-orange-500" size={20} />
          <h4 className="font-extrabold text-slate-800">Enviar Mensagem ao Mural</h4>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-700 p-3.5 rounded-2xl border border-red-100 font-semibold text-xs flex items-center gap-2">
            <AlertCircle size={16} />
            {errorMsg}
          </div>
        )}

        <form onSubmit={handlePost} className="space-y-4">
          <div className="space-y-1.5">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Escreva algo construtivo, carinhoso ou de utilidade pública... Sua mensagem fará a diferença!"
              maxLength={280}
              rows={3}
              className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 rounded-2xl py-4 px-5 text-sm transition-all resize-none"
              required
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium px-1">
              <span>Evite nomes reais ou marcas identificáveis.</span>
              <span>{newComment.length}/280 Caracteres</span>
            </div>
          </div>

          {/* Tag selector */}
          <div className="space-y-2">
            <label className="text-[10px] uppercase font-black text-slate-400 block ml-1">Selecione uma Tag</label>
            <div className="flex flex-wrap gap-2">
              {tagsList.map(t => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setSelectedTag(t)}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    selectedTag === t
                      ? 'previne-gradient-bg text-white shadow-md'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-150'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Visibility Switch */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-2">
            {activeUser && !activeUser.isAnonymous ? (
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={postAnonymously}
                  onChange={(e) => setPostAnonymously(e.target.checked)}
                  className="rounded border-slate-350 text-purple-600 focus:ring-purple-500 w-4 h-4 cursor-pointer"
                />
                <span className="text-xs font-bold text-slate-600">Postar como "Anônimo" (ocultar meu apelido de cadastro)</span>
              </label>
            ) : (
              <span className="text-[10.5px] font-semibold text-slate-400">Mensagem postada como Visitante Anônimo para sua privacidade.</span>
            )}

            <button
              type="submit"
              className="previne-gradient-bg text-white px-8 py-3.5 rounded-xl font-black text-sm tracking-wide shadow-md hover:brightness-105 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              Postar no Mural
              <Send size={16} />
            </button>
          </div>
        </form>
      </div>

      {/* Community Comments Feed */}
      <div className="space-y-5">
        <h4 className="text-slate-400 text-xs font-black uppercase tracking-[0.25em] pl-2 flex items-center gap-2">
          <Sparkles size={14} className="text-purple-600" />
          Apoio Comunitário Recente
        </h4>

        <div className="grid gap-5">
          {comments.map((comment) => {
            const isLiked = likedIds.includes(comment.id);
            return (
              <div
                key={comment.id}
                className="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-md hover:shadow-lg transition-all duration-300 relative space-y-4"
              >
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  {/* User Profile Info representation */}
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-500">
                      <User size={16} />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-sm text-slate-800">
                        {comment.nickname}
                      </h5>
                      <span className="text-[9px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                        <Calendar size={10} />
                        {new Date(comment.createdAt).toLocaleDateString('pt-BR')} às {new Date(comment.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Comment context Tag */}
                  <span className="bg-purple-50 text-purple-700 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border border-purple-100/30">
                    {comment.tag}
                  </span>
                </div>

                <p className="text-slate-600 text-[14px] leading-relaxed font-medium">
                  "{comment.text}"
                </p>

                {/* Reaction Actions Bar */}
                <div className="pt-2 border-t border-slate-50 flex justify-between items-center text-xs">
                  <button
                    onClick={() => handleLike(comment.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full font-bold transition-all ${
                      isLiked 
                        ? 'bg-rose-50 text-rose-600'
                        : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50/80'
                    }`}
                  >
                    <Heart size={14} className={isLiked ? 'fill-current text-rose-500' : ''} />
                    <span>Apoiar ({comment.likes})</span>
                  </button>

                  <div className="text-[10px] text-slate-400 font-medium flex items-center gap-1 bg-slate-50 px-2.5 py-1 rounded-lg">
                    <ShieldAlert size={12} className="text-slate-400" />
                    Mural moderado de forma segura
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CommentsSection;
