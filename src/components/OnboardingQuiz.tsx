import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GraduationCap, Heart, BookOpen, Brain, Briefcase, School } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const studentTypes = [
  { id: "saude", label: "Saúde", icon: Heart },
  { id: "ensino-medio", label: "Ensino Médio", icon: School },
  { id: "universitario", label: "Universitário", icon: GraduationCap },
  { id: "pos-graduado", label: "Pós-Graduado", icon: Brain },
  { id: "teacher", label: "Teacher", icon: BookOpen },
  { id: "outra-coisa", label: "Outra Coisa", icon: Briefcase },
];

export const OnboardingQuiz = () => {
  const { saveProfile } = useAuth();
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleSelection = (typeId: string) => {
    setSelectedType(typeId);
    // Save immediately after selection
    saveProfile(typeId);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <Card className="p-8 md:p-12 bg-card/95 backdrop-blur-sm shadow-2xl border-none">
        <div className="text-center space-y-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Que tipo de estudante você é?
            </h2>
            <p className="text-muted-foreground text-lg">
              Isso nos ajudará a personalizar sua experiência de aprendizado
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {studentTypes.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={selectedType === id ? "jungle" : "outline"}
                size="lg"
                className="h-32 flex flex-col gap-3 transition-all hover:scale-105"
                onClick={() => handleSelection(id)}
              >
                <Icon className="h-8 w-8" />
                <span className="text-lg font-semibold">{label}</span>
              </Button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};
