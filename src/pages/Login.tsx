import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { useSession, useSupabaseClient } from '@supabase/auth-helpers-react';
import { motion } from 'framer-motion';

const Login = () => {
  const session = useSession();
  const supabase = useSupabaseClient();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (session) {
      navigate('/');
    }
  }, [session, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-900 to-charcoal-800 relative overflow-hidden">
      {/* Ambient light effects */}
      <div className="fixed top-0 right-0 w-1/2 h-screen bg-gradient-to-l from-purple-500/5 to-transparent pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-1/2 h-screen bg-gradient-to-r from-pink-500/5 to-transparent pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container max-w-md mx-auto pt-20"
      >
        <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-2xl p-8 shadow-xl">
          <h1 className="text-3xl font-bold text-white text-center mb-8">Welcome Back</h1>
          <Auth
            supabaseClient={supabase}
            appearance={{
              theme: ThemeSupa,
              variables: {
                default: {
                  colors: {
                    brand: '#9b87f5',
                    brandAccent: '#7E69AB',
                    inputBackground: 'rgba(255, 255, 255, 0.05)',
                    inputText: 'white',
                    inputPlaceholder: 'rgba(255, 255, 255, 0.5)',
                  },
                },
              },
              className: {
                container: 'auth-container',
                button: 'auth-button',
                input: 'auth-input',
                label: 'auth-label',
              },
            }}
            theme="dark"
            providers={['google', 'github']}
          />
        </div>
      </motion.div>
    </div>
  );
};

export default Login;