import React, { useState } from 'react';
import { Star } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { PartnerService } from '@/types/subscription';

interface FeedbackDialogProps {
  subscription: PartnerService;
  isOpen: boolean;
  onClose: () => void;
}

export const FeedbackDialog = ({ subscription, isOpen, onClose }: FeedbackDialogProps) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({
        title: "Rating Required",
        description: "Please select a rating before submitting feedback.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Get the current user's session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) throw sessionError;
      if (!session?.user?.id) {
        throw new Error('User must be logged in to submit feedback');
      }

      const { error } = await supabase
        .from('recommendation_feedback')
        .upsert({
          service_id: subscription.id,
          user_id: session.user.id,
          rating,
          feedback_text: feedback || null
        });

      if (error) throw error;

      toast({
        title: "Feedback Submitted",
        description: "Thank you for your feedback! This helps us improve our recommendations.",
      });
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Rate this recommendation</DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-6 py-4">
          <div className="flex justify-center gap-2">
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                onClick={() => setRating(value)}
                className="focus:outline-none"
              >
                <Star
                  className={`w-8 h-8 ${
                    value <= rating
                      ? 'fill-[#ff3da6] text-[#ff3da6]'
                      : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>

          <Textarea
            placeholder="Tell us what you think about this recommendation (optional)"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
          />

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="bg-gradient-to-r from-[#662d91] to-[#bf0bad] hover:from-[#662d91]/90 hover:to-[#bf0bad]/90"
            >
              Submit Feedback
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};