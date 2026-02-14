"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import WeekButton from "./WeekButton";
import { toast } from "sonner";
import { Loader2, Crown, Sparkles } from "lucide-react";
import confetti from "canvas-confetti";
import { playToc, playPo } from "@/utils/audio";
import PhaseCompletionModal from "./PhaseCompletionModal";
import PhaseInfoModal from "./PhaseInfoModal";
import { cn } from "@/lib/utils";

const PHASES = [
  { 
    start: 1, 
    end: 10, 
    name: "Pentateuco", 
    gem: "Jaspe", 
    color: "#E57373",
    info: "Gênesis, Êxodo, Levítico, Números e Deuteronômio formam a base de toda a Escritura, sendo conhecidos como a Torá ou a Lei. Esses cinco livros, tradicionalmente atribuídos a Moisés, revelam o coração de Deus desde a criação do mundo, a queda da humanidade e o chamado de Abraão. Neles encontramos o nascimento da nação de Israel, o êxodo do Egito, a entrega dos Dez Mandamentos e as instruções detalhadas para a adoração e a vida do povo escolhido, estabelecendo a aliança que percorre toda a Bíblia."
  },
  { 
    start: 11, 
    end: 20, 
    name: "Livros Históricos", 
    gem: "Sardônica", 
    color: "#FFB74D",
    info: "Josué, Juízes, Rute, 1 e 2 Samuel, 1 e 2 Reis, 1 e 2 Crônicas, Esdras, Neemias e Ester contam a emocionante história de Israel desde a conquista da Terra Prometida até o retorno do exílio babilônico. Atravessando batalhas, vitórias, derrotas, a monarquia com seus reis fiéis e infiéis, e o cativeiro, estes livros demonstram a fidelidade de Deus em cumprir suas promessas mesmo diante da infidelidade humana, preparando o cenário para a vinda do Messias."
  },
  { 
    start: 21, 
    end: 26, 
    name: "Livros Poéticos", 
    gem: "Sárdio", 
    color: "#D32F2F",
    info: "Jó, Salmos, Provérbios, Eclesiastes e Cantares de Salomão tocam a alma do crente ao expressarem a mais profunda experiência humana com Deus. Enquanto os Salmos nos ensinam a adorar e clamar em todos os momentos, Provérbios oferece sabedoria prática para o dia a dia, Jó nos mostra a confiança em meio ao sofrimento, Eclesiastes revela a vaidade das coisas terrenas e Cantares celebra o amor conjugal como reflexo do amor divino."
  },
  { 
    start: 27, 
    end: 32, 
    name: "Profetas Maiores", 
    gem: "Ametista", 
    color: "#9575CD",
    info: "Isaías, Jeremias, Lamentações, Ezequiel e Daniel carregam mensagens poderosas de julgamento e esperança. Estes profetas, chamados maiores pela extensão de seus escritos, alertaram Israel sobre o juízo vindouro por causa do pecado, mas também anunciaram com detalhes impressionantes a vinda do Messias, o Servo Sofredor, e a restauração futura do povo de Deus, apontando para um novo coração e um novo espírito."
  },
  { 
    start: 33, 
    end: 35, 
    name: "Profetas Menores", 
    gem: "Crisólito", 
    color: "#AED581",
    info: "Oseias, Joel, Amós, Obadias, Jonas, Miqueias, Naum, Habacuque, Sofonias, Ageu, Zacarias e Malaquias encerram o Antigo Testamento com doze vozes proféticas que, embora breves em extensão, são imensas em profundidade espiritual. Cada um à sua maneira clama por arrependimento, denuncia a injustiça social e a idolatria, e aponta para a vinda do Senhor, com Zacarias e Malaquias anunciando diretamente a chegada do mensageiro que prepararia o caminho para Cristo."
  },
  { 
    start: 36, 
    end: 39, 
    name: "Evangelhos", 
    gem: "Jacinto", 
    color: "#FF8A65",
    info: "Mateus, Marcos, Lucas e João ocupam o lugar mais precioso das Escrituras ao apresentarem a pessoa de Jesus Cristo, o Filho de Deus feito homem. Cada evangelista oferece uma perspectiva única: Mateus mostra Jesus como o Rei prometido aos judeus, Marcos apresenta o Servo perfeito em ação, Lucas destaca a compaixão pelo ser humano e João revela a divindade do Verbo que se fez carne, culminando todos no mesmo evento central: a morte e a ressurreição que garantem a salvação."
  },
  { 
    start: 40, 
    end: 40, 
    name: "Histórico", 
    gem: "Topázio", 
    color: "#FFD54F",
    info: "Atos dos Apóstolos funciona como a ponte indispensável entre os Evangelhos e as epístolas, narrando o nascimento e a expansão da igreja primitiva. Sob a ação do Espírito Santo, vemos Pedro pregando no Pentecostes, Estevão testemunhando com seu sangue, Filipe evangelizando Samaria e, especialmente, Paulo levando o evangelho aos gentios, demonstrando que a mensagem de Cristo realmente chegara até os confins da terra."
  },
  { 
    start: 41, 
    end: 46, 
    name: "Epístolas Apostólicas", 
    gem: "Berilo", 
    color: "#4DB6AC",
    info: "Romanos, 1 e 2 Coríntios, Gálatas, Efésios, Filipenses, Colossenses, 1 e 2 Tessalonicenses, 1 e 2 Timóteo, Tito, Filemom, Hebreus, Tiago, 1 e 2 Pedro, 1, 2 e 3 João e Judas formam o precioso corpo de instrução doutrinária e pastoral deixado pelos apóstolos às igrejas. Escritas por Paulo, Pedro, João, Tiago e outros líderes apostólicos, estas cartas abordam desde as mais elevadas verdade teológicas — como a justificação pela fé, a supremacia de Cristo e a segurança da salvação — até as orientações mais práticas para o viver diário, incluindo a organização da igreja, a vigilância contra falsos mestres, o exercício do amor fraternal e a perseverança em meio às tribulações, formando um manual completo para a maturidade cristã."
  },
  { 
    start: 47, 
    end: 47, 
    name: "Livro Profético", 
    gem: "Safira", 
    color: "#64B5F6",
    info: "Apocalipse encerra a Bíblia com a revelação de Jesus Cristo glorificado e a consumação de todas as coisas. Através de visões e símbolos impressionantes, João descreve os eventos finais da história, o juízo sobre os ímpios, a vitória definitiva de Cristo sobre Satanás e a esperança mais doce de todo crente: a criação de novos céus e nova terra, onde Deus habitará para sempre com seu povo e não haverá mais morte, nem pranto, nem dor."
  }
];

const WeeklyProgress = ({ onProgressUpdate }: { onProgressUpdate: (count: number) => void }) => {
  const [completedWeeks, setCompletedWeeks] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState<number | null>(null);
  const [showPhaseModal, setShowPhaseModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(PHASES[0]);

  const totalWeeks = 47;
  const isAllCompleted = completedWeeks.size === totalWeeks;

  useEffect(() => {
    fetchProgress();
  }, []);

  useEffect(() => {
    if (isAllCompleted && !loading) {
      triggerConfetti();
    }
  }, [isAllCompleted, loading]);

  const triggerConfetti = () => {
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
      });
    }, 250);
  };

  const fetchProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("readings")
        .select("book_name")
        .eq("user_id", user.id);

      if (error) throw error;

      const weeks = new Set(
        data
          .filter(r => r.book_name.startsWith("Semana "))
          .map(r => parseInt(r.book_name.replace("Semana ", "").trim()))
      );

      setCompletedWeeks(weeks);
      onProgressUpdate(weeks.size);
    } catch (error) {
      console.error("Erro ao carregar progresso:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleWeek = async (week: number) => {
    setSyncing(week);
    const isAdding = !completedWeeks.has(week);
    const weekLabel = `Semana ${week}`;

    if (isAdding) {
      let lastCompleted = 0;
      for (let i = week - 1; i >= 1; i--) {
        if (completedWeeks.has(i)) {
          lastCompleted = i;
          break;
        }
      }

      if (lastCompleted < week - 1) {
        toast.error(`Você precisa concluir a semana ${week - 1} primeiro!`);
        setSyncing(null);
        return;
      }
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      if (isAdding) {
        const { error } = await supabase
          .from("readings")
          .upsert(
            {
              user_id: user.id,
              book_name: weekLabel
            },
            { onConflict: 'user_id,book_name' }
          );

        if (error) throw error;
        playToc();

        // Verificar se iniciou uma fase
        const infoPhase = PHASES.find(p => p.start === week);
        if (infoPhase) {
          setCurrentPhase(infoPhase);
          setShowInfoModal(true);
        }

        // Verificar se concluiu uma fase (apenas se não for a mesma que iniciou, ex: Atos/Apocalipse)
        const completionPhase = PHASES.find(p => p.end === week);
        if (completionPhase && !infoPhase) {
          setCurrentPhase(completionPhase);
          setShowPhaseModal(true);
        } else if (completionPhase && infoPhase) {
          // Se for uma fase de 1 semana (Atos/Apocalipse), mostramos a conclusão após fechar a info
          // Para simplificar, vamos priorizar a info e o usuário verá a conclusão na próxima interação ou podemos encadear
        }
      } else {
        const maxCompleted = Math.max(...Array.from(completedWeeks));
        if (week !== maxCompleted && completedWeeks.size > 0) {
          toast.error("Você só pode desmarcar a última semana concluída!");
          setSyncing(null);
          return;
        }

        const { error } = await supabase
          .from("readings")
          .delete()
          .eq("user_id", user.id)
          .eq("book_name", weekLabel);

        if (error) throw error;
        playPo();
      }

      setCompletedWeeks(prev => {
        const next = new Set(prev);
        if (isAdding) next.add(week);
        else next.delete(week);
        onProgressUpdate(next.size);
        return next;
      });

      toast.success(`${weekLabel} ${isAdding ? 'concluída!' : 'desmarcada.'}`);
    } catch (error: any) {
      if (error.code === '23505') {
        fetchProgress();
      } else {
        toast.error("Erro ao salvar: " + error.message);
      }
    } finally {
      setSyncing(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-slate-300" />
      </div>
    );
  }

  const gemPositions = [
    "top-[42%] left-[18%]",
    "top-[32%] left-[32%]",
    "top-[28%] left-[48%]",
    "top-[32%] right-[32%]",
    "top-[42%] right-[18%]",
    "bottom-[38%] left-[28%]",
    "bottom-[38%] left-[48%]",
    "bottom-[38%] right-[28%]",
    "bottom-[22%] left-[48%]"
  ];

  return (
    <div className="space-y-8">
      <PhaseInfoModal 
        isOpen={showInfoModal}
        onClose={() => {
          setShowInfoModal(false);
          // Se a fase tiver apenas 1 semana, mostramos a conclusão logo após
          if (currentPhase.start === currentPhase.end) {
            setShowPhaseModal(true);
          }
        }}
        title={currentPhase.name}
        description={currentPhase.info || ""}
        color={currentPhase.color}
      />

      <PhaseCompletionModal 
        isOpen={showPhaseModal} 
        onClose={() => setShowPhaseModal(false)} 
        phaseName={currentPhase.name}
        gemName={currentPhase.gem}
        gemColor={currentPhase.color}
      />

      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-10 gap-3 sm:gap-4">
        {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((week) => (
          <WeekButton 
            key={week} 
            week={week} 
            isCompleted={completedWeeks.has(week)} 
            onClick={toggleWeek} 
            disabled={syncing === week} 
          />
        ))}
      </div>

      {isAllCompleted && (
        <div className="flex flex-col items-center justify-center p-8 bg-gradient-to-b from-amber-50 to-white rounded-[2.5rem] border-2 border-amber-200 animate-in zoom-in duration-500 shadow-xl shadow-amber-100/50">
          <div className="relative">
            <Crown className="w-24 h-24 text-amber-500 animate-bounce" />
            
            {PHASES.map((phase, index) => (
              <div 
                key={phase.gem}
                className={cn(
                  "absolute w-2 h-2 rounded-full shadow-lg animate-pulse",
                  gemPositions[index]
                )}
                style={{ 
                  backgroundColor: phase.color,
                  boxShadow: `0 0 8px ${phase.color}cc`,
                  animationDelay: `${index * 150}ms`
                }}
              />
            ))}
            
            <Sparkles className="absolute -top-2 -right-2 w-8 h-8 text-amber-400 animate-pulse" />
            <Sparkles className="absolute -bottom-2 -left-2 w-6 h-6 text-amber-300 animate-pulse delay-75" />
          </div>
          <h3 className="text-2xl font-black text-amber-900 mt-4 text-center">Jornada Concluída!</h3>
          <p className="text-amber-700 font-medium text-center mt-2">
            Parabéns! Você completou todas as 47 semanas e coletou todas as pedras preciosas da Jornada Bíblica 2026.
          </p>
        </div>
      )}
    </div>
  );
};

export default WeeklyProgress;