// Define os tipos de status possíveis
type Status = "green" | "yellow" | "red";

interface StatusIndicatorProps {
  status: Status;
}

// Mapeia cada status para uma cor e um texto correspondente
const statusConfig = {
  green: { color: "bg-green-500", text: "Na Meta" },
  yellow: { color: "bg-yellow-500", text: "Parcial" },
  red: { color: "bg-red-500", text: "Fora da Meta" },
};

/**
 * Componente de UI que renderiza um indicador visual (círculo colorido)
 * e um texto descritivo para o status nutricional do paciente.
 */
export function StatusIndicator({ status }: StatusIndicatorProps) {
  const { color, text } = statusConfig[status];

  return (
    <div className="flex items-center justify-center space-x-2">
      <span
        className={`h-3 w-3 shrink-0 rounded-full ${color}`}
        aria-label={`Status: ${text}`}
      />
      <span className="text-muted-foreground hidden text-xs capitalize md:inline">
        {text}
      </span>
    </div>
  );
}
