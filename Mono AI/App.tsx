import React, { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { generateWallpaper } from './services/geminiService';
import ImageDisplay from './components/ImageDisplay';
import DownloadIcon from './components/icons/DownloadIcon';
import InstagramIcon from './components/icons/InstagramIcon';
import SendIcon from './components/icons/SendIcon';

const STYLE_SUGGESTIONS = [
  "abstract waves",
  "geometric",
  "gradient",
  "solitary mountain",
  "serene forest",
  "minimalist city",
];

const App: React.FC = () => {
  const [prompt, setPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() && !isLoading) {
      setError("Please enter a description for your wallpaper.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const generatedUrl = await generateWallpaper(prompt);
      setImageUrl(generatedUrl);
    } catch (e) {
      setError(e instanceof Error ? e.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading]);

  const handleSuggestionClick = (suggestion: string) => {
    setPrompt(prev => prev ? `${prev}, ${suggestion}`.trim() : suggestion);
  };
  
  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    },
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } },
  };

  return (
    <motion.div 
      className="min-h-screen text-slate-200 font-sans flex flex-col w-full antialiased"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.header variants={itemVariants} className="w-full max-w-7xl mx-auto p-4 flex justify-start items-center text-slate-300">
          <div className="font-bold text-xl tracking-wider">MonoAI</div>
      </motion.header>

      <main className="w-full flex-grow flex flex-col items-center justify-center p-4 gap-8">
        <motion.div variants={itemVariants} className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold tracking-tight animated-gradient-text text-transparent bg-clip-text">
                Generate Your Wallpaper
            </h1>
            <p className="mt-3 text-lg text-slate-400 max-w-2xl mx-auto">
                Bring your imagination to life. Describe an idea, and let our AI create a unique wallpaper for you.
            </p>
        </motion.div>
        
        <motion.div variants={itemVariants} className="w-full max-w-3xl">
          <div className="relative bg-gray-950/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl shadow-2xl shadow-black/30">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleGenerate(); }}}
              placeholder="A minimalist city skyline at dusk, in synthwave colors..."
              className="w-full p-6 bg-transparent text-lg text-slate-200 placeholder-slate-500 focus:outline-none resize-none"
              rows={4}
              disabled={isLoading}
            />
            <div className="flex justify-between items-center p-3 border-t border-gray-800/60">
                <div className="flex flex-wrap items-center gap-2">
                    {STYLE_SUGGESTIONS.map((suggestion) => (
                        <motion.button
                            key={suggestion}
                            onClick={() => handleSuggestionClick(suggestion)}
                            disabled={isLoading}
                            className="px-3 py-1 text-sm bg-slate-800/70 text-slate-300 rounded-full hover:bg-violet-600/50 hover:text-white transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}
                        >
                        {suggestion}
                        </motion.button>
                    ))}
                </div>
                <motion.button
                    onClick={handleGenerate}
                    disabled={isLoading}
                    className="w-10 h-10 flex items-center justify-center animated-gradient-button text-white font-semibold rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-950 focus:ring-violet-500 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
                    aria-label="Generate Wallpaper"
                    whileHover={{scale: 1.1}} whileTap={{scale: 0.9}}
                >
                    <SendIcon className="w-5 h-5" />
                </motion.button>
            </div>
          </div>
        </motion.div>

        <AnimatePresence>
            {(imageUrl || isLoading || error) && 
                <motion.div 
                    variants={itemVariants} 
                    className="w-full max-w-3xl"
                    initial={{opacity: 0, height: 0}}
                    animate={{opacity: 1, height: 'auto'}}
                    exit={{opacity: 0, height: 0}}
                    transition={{duration: 0.5, ease: 'easeInOut'}}
                >
                    <ImageDisplay isLoading={isLoading} error={error} imageUrl={imageUrl} />
                </motion.div>
            }
        </AnimatePresence>
        
        <AnimatePresence>
        {imageUrl && !isLoading && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="flex justify-center"
            >
                <a
                    href={imageUrl}
                    download="ai-minimalist-wallpaper.jpeg"
                    className="flex items-center justify-center gap-2 px-8 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:bg-green-700 hover:shadow-green-500/40 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-green-500 transition-all duration-300"
                    aria-label="Download Wallpaper"
                >
                    <DownloadIcon className="w-5 h-5" />
                    Download Now
                </a>
            </motion.div>
        )}
        </AnimatePresence>
      </main>

      <motion.footer variants={itemVariants} className="w-full max-w-7xl mx-auto text-center py-8 flex justify-center items-center gap-6 flex-wrap">
        <a href="https://www.instagram.com/mstf.ah1" target="_blank" rel="noopener noreferrer" className="text-slate-500 hover:text-violet-400 transition-colors" aria-label="Instagram">
            <InstagramIcon className="w-6 h-6" />
        </a>
        <a href="https://buymeacoffee.com/mstf.ah1?status=1" target="_blank" rel="noopener noreferrer" className="text-sm text-slate-500 hover:text-violet-400 transition-colors">
            Buy me a coffee
        </a>
      </motion.footer>
    </motion.div>
  );
};

export default App;