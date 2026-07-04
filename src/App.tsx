import React, { useState, useEffect, useRef, useCallback } from "react";
import { 
  Upload, 
  ImageIcon, 
  SlidersHorizontal, 
  ArrowRight, 
  Sparkles, 
  RefreshCw, 
  Send, 
  Info, 
  ShoppingBag, 
  Check, 
  AlertCircle, 
  Trash2, 
  HelpCircle,
  Maximize2
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  DESIGN_STYLES, 
  SAMPLE_ROOMS, 
  DEMO_MAKEOVERS, 
  DesignStyle, 
  SampleRoom, 
  ShoppableItem 
} from "./constants";

interface ChatMessage {
  role: "user" | "model";
  text: string;
}

export default function App() {
  // App states
  const [hasApiKey, setHasApiKey] = useState<boolean | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(SAMPLE_ROOMS[0].url);
  const [reimaginedImage, setReimaginedImage] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string>("scandinavian");
  const [selectedSampleId, setSelectedSampleId] = useState<string>("sample-1");
  const [customPrompt, setCustomPrompt] = useState<string>("");
  
  // Interactive Slider state
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Loading and Generation States
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingText, setLoadingText] = useState<string>("Initializing design engine...");
  
  // Chat state
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      role: "model",
      text: "Welcome to your AI Interior Design Studio! Upload a photo of your room or click on one of our preloaded samples below. Then, choose a style and click 'Reimagine Space' to begin your transformation."
    }
  ]);
  const [chatInput, setChatInput] = useState<string>("");
  const [isChatting, setIsChatting] = useState<boolean>(false);
  
  // Recommendations state
  const [recommendations, setRecommendations] = useState<ShoppableItem[]>([]);
  
  // UI & Error States
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"samples" | "upload">("samples");
  const [dragActive, setDragActive] = useState<boolean>(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Check API health status on mount
  useEffect(() => {
    async function checkHealth() {
      try {
        const response = await fetch("/api/health");
        const data = await response.json();
        setHasApiKey(data.hasApiKey);
      } catch (e) {
        console.error("Health check failed:", e);
        setHasApiKey(false); // Fallback to demo mode if backend is starting
      }
    }
    checkHealth();
  }, []);

  // Update recommendations and chat on initial load or reset
  useEffect(() => {
    // Populate default state for Sample 1
    if (selectedSampleId === "sample-1" && !reimaginedImage) {
      const demoData = DEMO_MAKEOVERS["sample-1"]?.[selectedStyle];
      if (demoData) {
        setReimaginedImage(demoData.image);
        setRecommendations(demoData.items);
        setChatHistory([
          {
            role: "model",
            text: `Here is your Modern Loft reimagined in a **Scandinavian** design style! Drag the slider across the image to compare the before and after views.\n\nNotice how the light beechwood coffee table and soft cream linen sofa create an open, tranquil ambience. What would you like to refine next? Ask me to tweak colors, add features, or recommend shops.`
          }
        ]);
      }
    }
  }, [selectedSampleId]);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatHistory]);

  // Loading animation phrases cycling
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGenerating) {
      const phrases = [
        "Analyzing room geometry & boundaries...",
        "Drafting new spatial floor plans...",
        "Applying professional lighting mapping...",
        "Replacing structural design textures...",
        "Sourcing curated furnishings and rugs...",
        "Refining materials and surface finishes...",
        "Finalizing high-fidelity interior render..."
      ];
      let counter = 0;
      setLoadingText(phrases[0]);
      interval = setInterval(() => {
        counter = (counter + 1) % phrases.length;
        setLoadingText(phrases[counter]);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Drag Slider Event Handlers
  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(percentage);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    handleMove(e.clientX);
  };

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 0) return;
    handleMove(e.touches[0].clientX);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  // Convert image URL to Base64 (needed for samples)
  const fetchImageAsBase64 = async (url: string): Promise<string> => {
    try {
      const response = await fetch(url, { referrerPolicy: "no-referrer" });
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (e) {
      console.error("Failed to convert image to base64", e);
      throw new Error("Unable to fetch sample image. Check your internet connection.");
    }
  };

  // Select a pre-loaded sample room
  const handleSelectSample = async (sample: SampleRoom) => {
    if (isGenerating) return;
    setSelectedSampleId(sample.id);
    setError(null);
    try {
      setOriginalImage(sample.url);
      setReimaginedImage(null);
      setRecommendations([]);
      setSliderPosition(50);
      
      // Load fallback makeover if Demo Mode
      if (!hasApiKey) {
        const defaultStyle = sample.id === "sample-3" ? "industrial" : "midcentury";
        setSelectedStyle(defaultStyle);
        const demoData = DEMO_MAKEOVERS[sample.id]?.[defaultStyle];
        if (demoData) {
          setReimaginedImage(demoData.image);
          setRecommendations(demoData.items);
          setChatHistory([
            {
              role: "model",
              text: `Here is the ${sample.name} reimagined in **${defaultStyle.toUpperCase()}** style. Feel free to drag the comparison slider! Since Demo Mode is active, you can explore preloaded makeovers or configure your Gemini API Key in the Settings panel to unleash live custom makeovers.`
            }
          ]);
        }
      } else {
        setChatHistory([
          {
            role: "model",
            text: `Selected ${sample.name}. Choose a design style from the carousel below, and click 'Reimagine Space' to generate a bespoke AI makeover!`
          }
        ]);
      }
    } catch (err: any) {
      setError(err.message || "Failed to load sample room.");
    }
  };

  // Upload custom room photo
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file (PNG, JPG, or JPEG).");
      return;
    }
    setError(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      setOriginalImage(reader.result as string);
      setReimaginedImage(null);
      setRecommendations([]);
      setSelectedSampleId("custom");
      setSliderPosition(50);
      setChatHistory([
        {
          role: "model",
          text: "Excellent upload! Your original space is ready. Select an interior design style from the carousel below and click 'Reimagine Space' to let the AI create your makeover."
        }
      ]);
    };
    reader.onerror = () => {
      setError("Failed to read the uploaded file.");
    };
    reader.readAsDataURL(file);
  };

  // Drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  // Handle live style generation
  const handleReimagine = async () => {
    if (!originalImage || isGenerating) return;
    setError(null);
    setIsGenerating(true);

    const styleObj = DESIGN_STYLES.find(s => s.id === selectedStyle);
    const styleName = styleObj ? styleObj.name : selectedStyle;

    // 1. If Demo Mode is active and we have preloaded makeover, use it
    if (!hasApiKey) {
      setTimeout(() => {
        const demoData = DEMO_MAKEOVERS[selectedSampleId]?.[selectedStyle];
        if (demoData) {
          setReimaginedImage(demoData.image);
          setRecommendations(demoData.items);
          setChatHistory(prev => [
            ...prev,
            { role: "user", text: `Reimagine this room as ${styleName}` },
            { 
              role: "model", 
              text: `I have loaded a pre-rendered **${styleName}** makeover for this sample room! Use the compare slider to see the design. To create live, dynamic custom makeovers on your uploaded room photos, configure your Gemini API Key in the Settings menu.`
            }
          ]);
          setSliderPosition(50);
        } else {
          // If no specific demo style exists for this sample/upload, show a prompt
          setChatHistory(prev => [
            ...prev,
            { role: "user", text: `Reimagine this room as ${styleName}` },
            {
              role: "model",
              text: `⚠️ **API Key Required**: Custom uploaded makeovers and this specific style combination require a Gemini API Key. Please add your key under **Settings > Secrets** in the AI Studio UI to unlock live room makeovers for any photo and style!`
            }
          ]);
        }
        setIsGenerating(false);
      }, 3000);
      return;
    }

    // 2. Otherwise, run real server-side AI generation
    try {
      let imageBase64ToSubmit = originalImage;
      
      // If original image is an external Unsplash URL, convert to Base64 first
      if (originalImage.startsWith("http")) {
        setLoadingText("Downloading sample room photo...");
        imageBase64ToSubmit = await fetchImageAsBase64(originalImage);
      }

      setLoadingText("Initializing design model...");
      const response = await fetch("/api/reimagine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          image: imageBase64ToSubmit,
          style: styleName,
          customPrompt: customPrompt
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Generation request failed.");
      }

      const data = await response.json();
      setReimaginedImage(data.imageUrl);
      setRecommendations(data.recommendations || []);
      setSliderPosition(50);
      
      setChatHistory(prev => [
        ...prev,
        { role: "user", text: `Reimagine this room in the ${styleName} style.` },
        { 
          role: "model", 
          text: `Your room has been transformed into a gorgeous **${styleName}** style! I kept your structural lines but completely updated the space.\n\nTake a look at the curated shoppable items below the image. Let me know if you want to refine specific elements, e.g. "make the rug dark blue" or "add a potted fiddle-leaf fig in the corner".`
        }
      ]);
      setCustomPrompt("");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred while reimagining the room.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Submit chat assistant message
  const handleSendChatMessage = async (e?: React.FormEvent, suggestionText?: string) => {
    if (e) e.preventDefault();
    const textToSend = suggestionText || chatInput;
    if (!textToSend.trim() || isChatting) return;

    setError(null);
    setChatInput("");
    setChatHistory(prev => [...prev, { role: "user", text: textToSend }]);
    setIsChatting(true);

    // 1. If in Demo Mode, write a rich simulated response
    if (!hasApiKey) {
      setTimeout(() => {
        setIsChatting(false);
        const lowerText = textToSend.toLowerCase();
        let reply = "That's an interesting design idea! To make actual design adjustments on the room model, please configure your Gemini API Key in the Settings menu.";
        
        if (lowerText.includes("blue") || lowerText.includes("color")) {
          reply = "Adjusting the color accent is a wonderful idea! Introducing deep cobalt or teal accents would add elegant contrast. Simply connect your Gemini API Key, and I will instantly edit this room's visual render for you!";
        } else if (lowerText.includes("plant") || lowerText.includes("green")) {
          reply = "Indoor vegetation elevates any design! I would suggest adding a lush potted Fiddle-Leaf Fig or a cascading Golden Pothos on a shelving unit. Connect your Gemini API Key to see this updated in real-time!";
        } else if (lowerText.includes("link") || lowerText.includes("where to buy") || lowerText.includes("shop")) {
          reply = "You can view the curated list of shoppable recommendations right below the slider comparison! Each card lists direct search query shortcuts for Wayfair to make finding similar items effortless.";
        }

        setChatHistory(prev => [
          ...prev,
          { role: "model", text: reply }
        ]);
      }, 1500);
      return;
    }

    // 2. Real server-side chat execution
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: textToSend,
          history: chatHistory.slice(-10), // Limit history context
          originalImage: originalImage,
          currentStyledImage: reimaginedImage || originalImage,
          style: selectedStyle
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Chat server error");
      }

      const data = await response.json();
      
      // If the model modified the visual design
      if (data.newImageUrl) {
        setReimaginedImage(data.newImageUrl);
        setSliderPosition(100); // Shift slider to show the edit fully
        if (data.newRecommendations && data.newRecommendations.length > 0) {
          // Append or replace recommendations
          setRecommendations(prev => [...data.newRecommendations, ...prev].slice(0, 5));
        }
      }

      setChatHistory(prev => [
        ...prev,
        { role: "model", text: data.text }
      ]);

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to communicate with AI Advisor.");
      setChatHistory(prev => [
        ...prev,
        { role: "model", text: "I'm having trouble connecting to the design models right now. Please verify your internet connection or check your Gemini API key." }
      ]);
    } finally {
      setIsChatting(false);
    }
  };

  // Parse markdown links like [Text](Url) into beautiful HTML elements
  const parseMarkdownLinks = (text: string) => {
    const regex = /\[([^\]]+)\]\(([^)]+)\)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noopener noreferrer"
          referrerPolicy="no-referrer"
          className="inline-flex items-center gap-1 text-amber-700 font-semibold underline decoration-amber-400 hover:text-amber-900 transition-colors"
        >
          {match[1]}
          <ShoppingBag className="w-3.5 h-3.5 inline" />
        </a>
      );
      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts.length > 0 ? parts : text;
  };

  return (
    <div id="main_app" className="min-h-screen bg-[#FBFBFA] text-[#2C2A29] flex flex-col font-sans selection:bg-amber-100 selection:text-amber-900">
      
      {/* Top Banner Notice for Missing Keys */}
      {hasApiKey === false && (
        <div id="demo_banner" className="bg-amber-50 border-b border-amber-200 text-amber-900 px-4 py-2 text-center text-sm font-medium flex items-center justify-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>Demo Mode Active:</strong> Add your <strong>GEMINI_API_KEY</strong> under the <strong>Settings &gt; Secrets</strong> panel in the AI Studio UI to unlock live custom makeovers!
          </span>
        </div>
      )}

      {/* Elegant Header */}
      <header id="header" className="bg-white border-b border-stone-200 px-6 py-4 shadow-xs sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-[#8B5A2B] text-white p-2.5 rounded-xl shadow-xs flex items-center justify-center">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-[#2C2A29]">
                AI Interior Design Consultant
              </h1>
              <p className="text-xs text-[#7A746F]">
                Reimagine your home with state-of-the-art vision models
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-stone-500 font-mono bg-stone-100 px-2 py-1 rounded-md">
              UTC: {new Date().toISOString().substring(11, 19)}
            </span>
            <span className="h-4 w-[1px] bg-stone-200" />
            <div className="flex items-center gap-1.5 text-xs text-stone-500">
              <span className={`w-2.5 h-2.5 rounded-full ${hasApiKey ? "bg-emerald-500 animate-ping" : "bg-amber-400"}`} />
              <span className="font-medium">{hasApiKey ? "AI Connected" : "Demo Offline"}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container Layout */}
      <main id="main_content" className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Side: Visualizer & Selection - 7 Columns */}
        <div id="col_visualizer" className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Main Visualizer Card */}
          <div className="bg-white border border-[#E8E6E0] rounded-2xl p-4 shadow-sm flex flex-col gap-4">
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold tracking-wider uppercase text-[#8B5A2B] bg-amber-50 px-2 py-1 rounded">
                  Comparison Stage
                </span>
                <span className="text-xs text-[#7A746F]">
                  Drag the center slider to compare before / after
                </span>
              </div>
              <div className="flex items-center gap-2">
                {reimaginedImage && (
                  <button 
                    onClick={() => setSliderPosition(sliderPosition === 0 ? 100 : 0)} 
                    className="text-xs font-medium text-[#8B5A2B] hover:underline flex items-center gap-1"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" /> Toggle Full
                  </button>
                )}
              </div>
            </div>

            {/* Slider Comparison Display Frame */}
            <div 
              id="slider_container"
              ref={containerRef}
              className="relative w-full aspect-[4/3] rounded-xl overflow-hidden border border-stone-200 bg-stone-50 shadow-inner select-none cursor-ew-resize group"
              onMouseDown={handleMouseDown}
              onTouchStart={handleMouseDown}
              onTouchMove={handleTouchMove}
            >
              {originalImage ? (
                <>
                  {/* Original Image Background */}
                  <img
                    src={originalImage}
                    alt="Original room"
                    className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute bottom-3 right-3 bg-stone-900/75 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs shadow-xs">
                    Before
                  </div>

                  {/* Reimagined Image Overlay (clipped width-wise) */}
                  {reimaginedImage && (
                    <div 
                      className="absolute inset-0 overflow-hidden pointer-events-none"
                      style={{ width: `${sliderPosition}%` }}
                    >
                      <img
                        src={reimaginedImage}
                        alt="Reimagined room"
                        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                        style={{ width: containerRef.current?.getBoundingClientRect().width }}
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute bottom-3 left-3 bg-[#8B5A2B]/90 text-white text-xs font-semibold px-2.5 py-1 rounded-full backdrop-blur-xs shadow-xs">
                        {DESIGN_STYLES.find(s => s.id === selectedStyle)?.name} Style
                      </div>
                    </div>
                  )}

                  {/* Drag Line and Center Circle Handle */}
                  {reimaginedImage && (
                    <div 
                      className="absolute inset-y-0 w-1 bg-white cursor-ew-resize flex items-center justify-center shadow-lg pointer-events-none"
                      style={{ left: `${sliderPosition}%` }}
                    >
                      <div className="absolute -translate-x-1/2 w-9 h-9 rounded-full bg-white border-2 border-amber-600 text-[#8B5A2B] flex items-center justify-center shadow-md active:scale-115 transition-transform">
                        <SlidersHorizontal className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-stone-400 p-6 text-center">
                  <ImageIcon className="w-16 h-16 stroke-1.5 mb-2 text-stone-300" />
                  <p className="font-medium text-stone-600">No Image Selected</p>
                  <p className="text-xs max-w-sm mt-1">Please select an elegant sample space or upload your room photo below to start your design journey.</p>
                </div>
              )}

              {/* Progressive Fullscreen Loader Overlay */}
              <AnimatePresence>
                {isGenerating && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 bg-[#FBFBFA]/95 flex flex-col items-center justify-center p-6 text-center z-30"
                  >
                    <div className="relative mb-6">
                      <div className="w-16 h-16 border-4 border-[#E8E6E0] border-t-[#8B5A2B] rounded-full animate-spin" />
                      <Sparkles className="w-6 h-6 text-[#8B5A2B] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                    </div>
                    <motion.h3 
                      key={loadingText}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-lg font-semibold text-[#2C2A29]"
                    >
                      {loadingText}
                    </motion.h3>
                    <p className="text-xs text-[#7A746F] max-w-md mt-2">
                      Our advanced AI architecture is rendering custom textiles, lighting, and textures for your space.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Source Input Panels: Select Sample or Upload Photo */}
          <div className="bg-white border border-[#E8E6E0] rounded-2xl p-4 shadow-sm">
            <div className="flex border-b border-stone-200 mb-4">
              <button
                onClick={() => setActiveTab("samples")}
                className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === "samples" ? "border-[#8B5A2B] text-[#8B5A2B]" : "border-transparent text-stone-500 hover:text-stone-800"}`}
              >
                <ImageIcon className="w-4 h-4" /> Pick a Sample Space
              </button>
              <button
                onClick={() => setActiveTab("upload")}
                className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition-colors flex items-center gap-2 ${activeTab === "upload" ? "border-[#8B5A2B] text-[#8B5A2B]" : "border-transparent text-stone-500 hover:text-stone-800"}`}
              >
                <Upload className="w-4 h-4" /> Upload Custom Photo
              </button>
            </div>

            {/* Tab: Pre-loaded Samples */}
            {activeTab === "samples" && (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SAMPLE_ROOMS.map((sample) => (
                  <button
                    key={sample.id}
                    onClick={() => handleSelectSample(sample)}
                    disabled={isGenerating}
                    className={`group text-left border rounded-xl overflow-hidden transition-all duration-300 bg-stone-50 hover:bg-white hover:shadow-xs ${selectedSampleId === sample.id ? "ring-2 ring-[#8B5A2B] border-transparent" : "border-stone-200"}`}
                  >
                    <div className="aspect-[4/3] w-full overflow-hidden relative">
                      <img
                        src={sample.url}
                        alt={sample.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="p-2.5">
                      <h4 className="text-xs font-bold text-[#2C2A29] line-clamp-1">{sample.name}</h4>
                      <p className="text-[10px] text-[#7A746F] line-clamp-1 mt-0.5">{sample.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Tab: File Drag-and-Drop Area */}
            {activeTab === "upload" && (
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                onClick={() => document.getElementById("file-input")?.click()}
                className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${dragActive ? "border-[#8B5A2B] bg-amber-50/10" : "border-stone-200 hover:border-stone-400 bg-stone-50"}`}
              >
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0])}
                  className="hidden"
                />
                <div className="flex flex-col items-center justify-center gap-2">
                  <div className="bg-stone-100 p-3 rounded-full text-[#8B5A2B] group-hover:scale-110 transition-transform">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-[#2C2A29]">
                    Click to browse or drop your room image here
                  </p>
                  <p className="text-xs text-[#7A746F]">
                    Supports PNG, JPG, or JPEG up to 10MB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Design Style Carousel */}
          <div className="bg-white border border-[#E8E6E0] rounded-2xl p-4 shadow-sm flex flex-col gap-4">
            <div>
              <h3 className="text-sm font-bold text-[#2C2A29]">
                Step 2: Choose Interior Design Style
              </h3>
              <p className="text-xs text-[#7A746F] mt-0.5">
                Our model transforms the materials, shapes, and color tones to match your chosen style
              </p>
            </div>

            {/* Carousel Horizontal Row */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin snap-x">
              {DESIGN_STYLES.map((style) => (
                <button
                  key={style.id}
                  onClick={() => setSelectedStyle(style.id)}
                  disabled={isGenerating}
                  className={`snap-start shrink-0 w-[180px] p-3 text-left border rounded-xl bg-gradient-to-br ${style.color} transition-all ${selectedStyle === style.id ? "border-[#8B5A2B] ring-1 ring-[#8B5A2B] shadow-xs" : "border-stone-200 hover:border-stone-300"}`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.textStyle}`}>
                      {style.name}
                    </span>
                    {selectedStyle === style.id && (
                      <Check className="w-4 h-4 text-[#8B5A2B]" />
                    )}
                  </div>
                  <h4 className="text-xs font-semibold text-stone-800 line-clamp-1">
                    {style.tagline}
                  </h4>
                  <p className="text-[10px] text-stone-500 line-clamp-2 leading-relaxed mt-1">
                    {style.description}
                  </p>
                </button>
              ))}
            </div>

            {/* Prompt customization and Reimagine button */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-stone-100">
              <input
                type="text"
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                placeholder="Optional: Add custom instructions (e.g. 'with blue velvet couch', 'add ceiling light')"
                disabled={isGenerating}
                className="flex-1 bg-[#FBFBFA] border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#8B5A2B] transition-colors"
              />
              <button
                onClick={handleReimagine}
                disabled={isGenerating || !originalImage}
                className="bg-[#8B5A2B] hover:bg-[#72481E] disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-semibold text-xs px-5 py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>Reimagine Space</span>
              </button>
            </div>
          </div>

        </div>

        {/* Right Side: Design Chat & Shoppable Links - 5 Columns */}
        <div id="col_assistant" className="lg:col-span-5 flex flex-col gap-6">
          
          {/* AI Chat Assistant Container */}
          <div className="bg-white border border-[#E8E6E0] rounded-2xl shadow-sm flex flex-col h-[400px] md:h-[480px]">
            
            {/* Assistant Header */}
            <div className="border-b border-[#E8E6E0] px-4 py-3 bg-[#FAF9F6] rounded-t-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
                <div>
                  <h3 className="text-xs font-bold text-[#2C2A29]">
                    AI Design Advisor
                  </h3>
                  <p className="text-[10px] text-[#7A746F]">
                    Chat to refine colors, materials, or furniture layouts
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setChatHistory([
                  {
                    role: "model",
                    text: "Reset successfully! How can I help you refine or choose furniture for this room design today?"
                  }
                ])}
                className="text-stone-400 hover:text-stone-600 p-1"
                title="Clear Chat"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Chat Messages Scrolling Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-[#FAF9F6]/20">
              {chatHistory.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-xl px-3.5 py-2 text-xs leading-relaxed ${msg.role === "user" ? "bg-[#8B5A2B] text-white rounded-br-none" : "bg-white border border-stone-200 text-stone-800 rounded-bl-none shadow-2xs"}`}>
                    <p className="font-semibold text-[10px] uppercase tracking-wider mb-1 opacity-80">
                      {msg.role === "user" ? "You" : "Advisor"}
                    </p>
                    <div className="whitespace-pre-wrap">
                      {parseMarkdownLinks(msg.text)}
                    </div>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Prompt Suggesion Pills (Refinement Shortcuts) */}
            {reimaginedImage && (
              <div className="px-3 py-2 border-t border-stone-100 flex gap-2 overflow-x-auto bg-[#FBFBFA]">
                <button
                  onClick={() => handleSendChatMessage(undefined, "Add some lush green houseplants in terracotta pots")}
                  disabled={isChatting}
                  className="shrink-0 text-[10px] font-medium bg-stone-100 border border-stone-200 hover:bg-stone-200 px-2.5 py-1 rounded-full transition-colors"
                >
                  🌿 Add Plants
                </button>
                <button
                  onClick={() => handleSendChatMessage(undefined, "Keep this layout but make the rug navy blue")}
                  disabled={isChatting}
                  className="shrink-0 text-[10px] font-medium bg-stone-100 border border-stone-200 hover:bg-stone-200 px-2.5 py-1 rounded-full transition-colors"
                >
                  🛋️ Blue Rug
                </button>
                <button
                  onClick={() => handleSendChatMessage(undefined, "Replace the lamp with a gold brass floor lamp")}
                  disabled={isChatting}
                  className="shrink-0 text-[10px] font-medium bg-stone-100 border border-stone-200 hover:bg-stone-200 px-2.5 py-1 rounded-full transition-colors"
                >
                  💡 Brass Lamp
                </button>
              </div>
            )}

            {/* Chat Input Bar */}
            <form onSubmit={handleSendChatMessage} className="border-t border-[#E8E6E0] p-3 flex gap-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder={reimaginedImage ? "Ask design advice or request edits (e.g. 'make the rug blue')" : "Ask about styles, pricing, or layouts..."}
                disabled={isChatting}
                className="flex-1 bg-[#FBFBFA] border border-stone-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-[#8B5A2B] transition-colors"
              />
              <button
                type="submit"
                disabled={isChatting || !chatInput.trim()}
                className="bg-[#8B5A2B] disabled:bg-stone-200 disabled:cursor-not-allowed text-white p-2 rounded-lg transition-colors"
              >
                {isChatting ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
          </div>

          {/* Shoppable Products Card section */}
          <div className="bg-white border border-[#E8E6E0] rounded-2xl p-4 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-1.5">
                <ShoppingBag className="w-4.5 h-4.5 text-[#8B5A2B]" />
                <h3 className="text-xs font-bold text-[#2C2A29]">
                  Shoppable Recommendations
                </h3>
              </div>
              <span className="text-[10px] text-[#7A746F] font-mono bg-stone-100 px-2 py-0.5 rounded">
                {recommendations.length} items spotted
              </span>
            </div>

            {recommendations.length > 0 ? (
              <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                {recommendations.map((item) => (
                  <div 
                    key={item.id}
                    className="border border-stone-150 rounded-xl p-3 bg-[#FAF9F6]/30 hover:bg-white hover:border-[#8B5A2B]/40 hover:shadow-xs transition-all flex items-start justify-between gap-3"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] font-bold tracking-wider uppercase bg-[#2C2A29]/5 text-stone-700 px-1.5 py-0.5 rounded">
                          {item.category}
                        </span>
                        <span className="text-[9px] text-[#8B5A2B] font-semibold">{item.priceRange}</span>
                      </div>
                      <h4 className="text-xs font-bold text-[#2C2A29] mt-1">{item.name}</h4>
                      <p className="text-[10px] text-[#7A746F] leading-normal mt-0.5">{item.description}</p>
                    </div>

                    <a
                      href={item.searchUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      referrerPolicy="no-referrer"
                      className="bg-amber-50 hover:bg-amber-100 text-[#8B5A2B] hover:text-[#72481E] p-2.5 rounded-lg border border-amber-200/50 flex items-center justify-center shrink-0 self-center transition-colors"
                      title="Shop Similar on Wayfair"
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-stone-400">
                <ShoppingBag className="w-10 h-10 stroke-1.5 mx-auto mb-2 text-stone-300" />
                <p className="text-xs font-medium">No design makeovers loaded yet.</p>
                <p className="text-[10px] max-w-xs mx-auto mt-0.5">Click 'Reimagine Space' to let the AI populate beautiful design items tailored to your new space.</p>
              </div>
            )}
          </div>

        </div>

      </main>

      {/* Footer credits and information */}
      <footer id="footer" className="bg-white border-t border-stone-200 px-6 py-4 text-center mt-auto">
        <p className="text-[10px] text-[#7A746F]">
          © {new Date().getFullYear()} AI Interior Design Studio • Utilizes advanced Google Gemini Vision & Generation Models.
        </p>
      </footer>
    </div>
  );
}
