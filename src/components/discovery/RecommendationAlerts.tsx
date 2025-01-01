import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BellRing, Gift } from 'lucide-react';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/hooks/use-toast";

interface RecommendationAlert {
  id: string;
  type: 'new_recommendation' | 'limited_offer';
  title: string;
  description: string;
  timestamp: Date;
}

interface RecommendationAlertsProps {
  alerts: RecommendationAlert[];
  onDismiss: (id: string) => void;
}

export const RecommendationAlerts = ({ alerts, onDismiss }: RecommendationAlertsProps) => {
  const { toast } = useToast();

  const handleAlertClick = (alert: RecommendationAlert) => {
    onDismiss(alert.id);
    toast({
      title: alert.title,
      description: alert.description,
    });
  };

  return (
    <AnimatePresence>
      {alerts.map((alert) => (
        <motion.div
          key={alert.id}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mb-4"
        >
          <Alert
            className="cursor-pointer bg-gradient-to-r from-[#662d91]/10 to-[#ff3da6]/10 border-[#ff3da6]/20 hover:from-[#662d91]/20 hover:to-[#ff3da6]/20 transition-all"
            onClick={() => handleAlertClick(alert)}
          >
            <div className="flex items-start gap-4">
              {alert.type === 'new_recommendation' ? (
                <BellRing className="h-5 w-5 text-[#ff3da6]" />
              ) : (
                <Gift className="h-5 w-5 text-[#ff3da6]" />
              )}
              <div>
                <AlertTitle className="text-[#ff3da6]">{alert.title}</AlertTitle>
                <AlertDescription className="text-white/70">
                  {alert.description}
                </AlertDescription>
              </div>
            </div>
          </Alert>
        </motion.div>
      ))}
    </AnimatePresence>
  );
};