import React, { useState, useEffect, useRef } from "react";
import { Play, Square, Cpu, Zap, Activity, Shield, Wifi, Eye, RefreshCw, Sliders } from "lucide-react";
import { Language } from "../types";
import { translations } from "../data/translations";

interface SimulatorProps {
  type: 'led' | 'servo' | 'ultrasonic' | 'iot-web' | 'code-only' | 'line-follower' | 'cv-grid';
  currentLanguage: Language;
  onCodeRun?: (code: string) => void;
  code?: string;
}

export default function SimulatorComponent({ type, currentLanguage, code }: SimulatorProps) {
  const [isRunning, setIsRunning] = useState(false);
  const t = (key: keyof typeof translations['en']) => translations[currentLanguage][key] || translations['en'][key];

  // LED State
  const [ledOn, setLedOn] = useState(false);
  const [ledDelay, setLedDelay] = useState(1000);

  // Servo State
  const [servoAngle, setServoAngle] = useState(90);

  // Ultrasonic State
  const [obstacleDistance, setObstacleDistance] = useState(25); // cm

  // IoT Web Server State
  const [temp, setTemp] = useState(24.5);
  const [relayState, setRelayState] = useState(false);

  // CV State
  const [cvDetectionClass, setCvDetectionClass] = useState<'Robot' | 'Obstacle' | 'Human'>('Robot');
  const [isDetecting, setIsDetecting] = useState(false);

  // Line Follower State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lfSpeed, setLfSpeed] = useState(2);
  const [lfStatus, setLfStatus] = useState<string>("");

  // Simulated Blink Loop
  useEffect(() => {
    let interval: any;
    if (type === "led" && isRunning) {
      // Analyze current code for blinking patterns
      let customDelay = 1000;
      if (code) {
        const delayMatch = code.match(/delay\((\d+)\)/);
        if (delayMatch && delayMatch[1]) {
          customDelay = parseInt(delayMatch[1]);
        }
      }
      setLedDelay(customDelay);

      interval = setInterval(() => {
        setLedOn(prev => !prev);
      }, customDelay);
    } else {
      setLedOn(false);
    }
    return () => clearInterval(interval);
  }, [type, isRunning, code]);

  // IoT Telemetry Noise
  useEffect(() => {
    let interval: any;
    if (type === "iot-web" && isRunning) {
      interval = setInterval(() => {
        setTemp(prev => +(prev + (Math.random() - 0.5) * 0.4).toFixed(1));
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [type, isRunning]);

  // Line Follower Simulation Engine
  useEffect(() => {
    if (type !== "line-follower") return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    
    // Track path (Infinity loop pattern)
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const rx = 100;
    const ry = 50;

    let tVal = 0; // parameter for trajectory
    let robotX = centerX;
    let robotY = centerY;
    let robotAngle = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw track
      ctx.beginPath();
      ctx.lineWidth = 12;
      ctx.strokeStyle = "#1e293b"; // dark track line
      ctx.lineJoin = "round";
      for (let i = 0; i <= 360; i += 2) {
        const angleRad = (i * Math.PI) / 180;
        // Lemniscate of Bernoulli or figure 8
        const scale = 2 / (3 - Math.cos(2 * angleRad));
        const tx = centerX + rx * scale * Math.cos(angleRad);
        const ty = centerY + ry * scale * Math.sin(2 * angleRad) / 2;
        if (i === 0) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
      ctx.closePath();
      ctx.stroke();

      // Simple inner dashed line for reference
      ctx.beginPath();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "#475569";
      ctx.setLineDash([4, 4]);
      for (let i = 0; i <= 360; i += 4) {
        const angleRad = (i * Math.PI) / 180;
        const scale = 2 / (3 - Math.cos(2 * angleRad));
        const tx = centerX + rx * scale * Math.cos(angleRad);
        const ty = centerY + ry * scale * Math.sin(2 * angleRad) / 2;
        if (i === 0) ctx.moveTo(tx, ty);
        else ctx.lineTo(tx, ty);
      }
      ctx.stroke();
      ctx.setLineDash([]); // Reset

      if (isRunning) {
        // Calculate next positions
        tVal = (tVal + lfSpeed) % 360;
        const angleRad = (tVal * Math.PI) / 180;
        const scale = 2 / (3 - Math.cos(2 * angleRad));
        
        const nextX = centerX + rx * scale * Math.cos(angleRad);
        const nextY = centerY + ry * scale * Math.sin(2 * angleRad) / 2;

        robotAngle = Math.atan2(nextY - robotY, nextX - robotX);
        robotX = nextX;
        robotY = nextY;

        setLfStatus(`IR Left: ${Math.random() > 0.85 ? "BLACK" : "WHITE"} | IR Right: ${Math.random() > 0.85 ? "BLACK" : "WHITE"}`);
      } else {
        // Default start position
        const angleRad = 0;
        const scale = 2 / (3 - Math.cos(2 * angleRad));
        robotX = centerX + rx * scale * Math.cos(angleRad);
        robotY = centerY + ry * scale * Math.sin(2 * angleRad) / 2;
        robotAngle = Math.PI / 2;
      }

      // Draw Robot Chassis
      ctx.save();
      ctx.translate(robotX, robotY);
      ctx.rotate(robotAngle);

      // Aluminum plate chassis
      ctx.fillStyle = "#38bdf8"; // cyan metallic plate
      ctx.beginPath();
      ctx.roundRect(-20, -14, 40, 28, 4);
      ctx.fill();

      // Tires
      ctx.fillStyle = "#0f172a";
      ctx.fillRect(-12, -18, 10, 4); // Left wheel
      ctx.fillRect(-12, 14, 10, 4);  // Right wheel
      ctx.fillRect(12, -18, 10, 4);  // Rear wheels
      ctx.fillRect(12, 14, 10, 4);

      // MCU Chip illustration
      ctx.fillStyle = "#1e293b";
      ctx.fillRect(-6, -6, 12, 12);
      ctx.fillStyle = "#10b981"; // green LED on robot
      ctx.beginPath();
      ctx.arc(3, 3, 2, 0, Math.PI * 2);
      ctx.fill();

      // IR Sensors on nose
      ctx.fillStyle = "#ef4444"; // Infrared transmitter
      ctx.fillRect(-18, -8, 3, 3);
      ctx.fillRect(-18, 5, 3, 3);

      ctx.restore();

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => cancelAnimationFrame(animationId);
  }, [type, isRunning, lfSpeed]);

  const handleStart = () => {
    setIsRunning(true);
    if (type === "cv-grid") {
      setIsDetecting(true);
      setTimeout(() => setIsDetecting(false), 1500);
    }
  };

  const handleStop = () => {
    setIsRunning(false);
    setLedOn(false);
  };

  return (
    <div className="bg-[#080808] border-2 border-[#111] rounded-none overflow-hidden shadow-2xl h-full flex flex-col" id="robomaster-simulator">
      {/* Header bar */}
      <div className="bg-[#050505] px-5 py-4 border-b border-[#222] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Cpu className="text-[#00F0FF] w-5 h-5 animate-pulse" />
          <span className="font-mono text-xs uppercase tracking-wider text-gray-300">
            {t("simulatorTitle")}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isRunning ? (
            <button
              onClick={handleStop}
              className="bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/40 px-3 py-1 rounded-none text-xs font-medium font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              id="sim-btn-stop"
            >
              <Square className="w-3.5 h-3.5 fill-red-400" />
              {t("stopSimulation")}
            </button>
          ) : (
            <button
              onClick={handleStart}
              className="bg-[#00F0FF]/10 hover:bg-[#00F0FF]/20 text-[#00F0FF] border border-[#00F0FF]/40 px-3 py-1 rounded-none text-xs font-medium font-mono flex items-center gap-1.5 transition-all cursor-pointer"
              id="sim-btn-run"
            >
              <Play className="w-3.5 h-3.5 fill-[#00F0FF]" />
              {t("runSimulation")}
            </button>
          )}
        </div>
      </div>

      {/* Simulator view area */}
      <div className="flex-1 p-6 flex flex-col justify-center items-center min-h-[300px]">
        
        {/* TYPE: CODE ONLY (Generic placeholder) */}
        {type === "code-only" && (
          <div className="text-center max-w-sm space-y-4">
            <Cpu className="w-16 h-16 text-neutral-800 mx-auto" />
            <p className="text-gray-400 text-sm font-mono leading-relaxed">
              {currentLanguage === "uz" 
                ? "Dasturiy darslik simulyatori: kod muharriri orqali amaliy vazifani yozing va mentor orqali tekshiring!"
                : currentLanguage === "ru"
                ? "Программный урок: напишите код в редакторе и отправьте ИИ-ментору на проверку!"
                : "Software-only unit: edit your code template and submit to your EduAI Mentor for grading!"}
            </p>
          </div>
        )}

        {/* TYPE: LED Circuit */}
        {type === "led" && (
          <div className="w-full max-w-md bg-[#050505] p-6 rounded-none border border-[#222] flex flex-col items-center">
            <span className="font-mono text-xs text-gray-500 mb-6 flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#00F0FF]" /> 5V Breadboard Bus Line
            </span>
            
            {/* Visual breadboard layout */}
            <div className="relative w-full aspect-[2/1] bg-amber-50 rounded-sm border-2 border-amber-200 p-4 flex justify-between items-center shadow-lg">
              {/* Row dots */}
              <div className="absolute inset-x-0 top-2 flex justify-around px-2 opacity-30">
                {[...Array(12)].map((_, i) => (
                  <span key={i} className="w-1 h-1 bg-slate-900 rounded-full"></span>
                ))}
              </div>

              {/* Wiring */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                {/* 5V Wire */}
                <path d="M 20 20 L 50 40" stroke="#ef4444" strokeWidth="2.5" fill="none" />
                {/* GND Wire */}
                <path d="M 20 80 L 150 65" stroke="#1e3a8a" strokeWidth="2.5" fill="none" />
                {/* LED Pin jump wire */}
                <path d="M 190 40 L 260 40" stroke="#00F0FF" strokeWidth="2" fill="none" />
              </svg>

              {/* Pin identifiers */}
              <div className="font-mono text-[9px] text-slate-700 absolute left-2 top-4">5V</div>
              <div className="font-mono text-[9px] text-slate-700 absolute left-2 bottom-4">GND</div>

              {/* 150 Ohm Resistor */}
              <div className="w-24 h-4 bg-yellow-100 border border-yellow-300 rounded-none relative flex items-center justify-around px-1 z-10 shadow-sm ml-8">
                <span className="w-1.5 h-full bg-amber-700"></span>
                <span className="w-1.5 h-full bg-amber-700"></span>
                <span className="w-1.5 h-full bg-amber-500"></span>
                <span className="w-1.5 h-full bg-yellow-600"></span>
              </div>

              {/* LED Element */}
              <div className="relative flex flex-col items-center mr-8 z-10">
                <div 
                  className={`w-10 h-10 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                    ledOn 
                      ? "bg-red-500 border-red-300 shadow-[0_0_35px_rgba(239,68,68,0.8)] scale-110" 
                      : "bg-red-950 border-red-900"
                  }`}
                >
                  {ledOn && <div className="w-4 h-4 rounded-full bg-white opacity-80 animate-ping"></div>}
                </div>
                <div className="w-1.5 h-6 bg-slate-300 -mt-1 rounded-b"></div>
                <div className="w-1.5 h-4 bg-slate-400 -mt-5 ml-2.5 rounded-b"></div>
              </div>
            </div>

            <div className="mt-6 font-mono text-xs text-center space-y-1">
              <p className={ledOn ? "text-[#00F0FF] font-bold" : "text-gray-500"}>
                {ledOn ? `● ${t("simLedOn")}` : `○ ${t("simLedOff")}`}
              </p>
              {isRunning && <p className="text-gray-500 text-[10px]">Delay: {ledDelay}ms</p>}
            </div>
          </div>
        )}

        {/* TYPE: Servo Motor */}
        {type === "servo" && (
          <div className="w-full max-w-sm bg-[#050505] p-6 rounded-none border border-[#222] flex flex-col items-center">
            <span className="font-mono text-xs text-gray-500 mb-6 flex items-center gap-1">
              <Sliders className="w-3.5 h-3.5 text-[#00F0FF]" /> {t("simServoAngle")}: {servoAngle}°
            </span>

            {/* Circular Servo Dial */}
            <div className="relative w-48 h-48 bg-[#0a0a0a] border-4 border-neutral-800 rounded-full flex items-center justify-center shadow-lg">
              {/* Outer tick marks */}
              {[...Array(13)].map((_, i) => {
                const angle = i * 15 - 90;
                return (
                  <div 
                    key={i} 
                    className="absolute w-1.5 h-4 bg-neutral-800"
                    style={{ transform: `rotate(${angle}deg) translateY(-84px)` }}
                  ></div>
                );
              })}

              {/* Servo Shaft center */}
              <div className="w-12 h-12 rounded-full bg-[#050505] border-4 border-neutral-750 z-20 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-[#00F0FF]"></div>
              </div>

              {/* Moving Arm */}
              <div 
                className="absolute origin-bottom w-3 h-24 bg-[#00F0FF] rounded-none z-10 shadow-[0_0_15px_#00F0FF] transition-all duration-300"
                style={{ 
                  transform: `rotate(${servoAngle - 90}deg) translateY(-38px)`
                }}
              ></div>

              {/* Interactive angle slider */}
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-mono text-2xl font-bold text-[#00F0FF] mt-24">{servoAngle}°</span>
              </div>
            </div>

            <div className="w-full mt-6 space-y-3">
              <input 
                type="range" 
                min="0" 
                max="180" 
                value={servoAngle}
                onChange={(e) => setServoAngle(parseInt(e.target.value))}
                className="w-full h-1.5 bg-neutral-900 rounded-none appearance-none cursor-pointer accent-[#00F0FF]"
              />
              <div className="flex justify-between text-[10px] font-mono text-gray-500">
                <span>0°</span>
                <span>90° (PWM: 1.5ms)</span>
                <span>180°</span>
              </div>
            </div>
          </div>
        )}

        {/* TYPE: Ultrasonic Alarm */}
        {type === "ultrasonic" && (
          <div className="w-full max-w-md bg-[#050505] p-6 rounded-none border border-[#222] flex flex-col items-center">
            <span className="font-mono text-xs text-gray-500 mb-6 flex items-center gap-1">
              <Activity className="w-3 h-3 text-[#00F0FF]" /> {t("simUltrasonicDist")}: {obstacleDistance} cm
            </span>

            <div className="relative w-full h-32 bg-[#0a0a0a] border border-[#222] rounded-none overflow-hidden flex items-center px-4">
              {/* Sonar Sensor HC-SR04 */}
              <div className="w-16 h-20 bg-neutral-900 border border-neutral-800 rounded-none p-1.5 flex flex-col justify-around items-center shadow-lg">
                <div className="w-12 h-6 bg-neutral-800 rounded-none border border-neutral-700 flex justify-around items-center">
                  <div className="w-4 h-4 rounded-full bg-black border-2 border-neutral-600 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-[#00F0FF] rounded-full"></span>
                  </div>
                  <div className="w-4 h-4 rounded-full bg-black border-2 border-neutral-600 flex items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-[#00F0FF] rounded-full"></span>
                  </div>
                </div>
                <div className="font-mono text-[7px] text-gray-400">HC-SR04</div>
              </div>

              {/* Sound waves overlay */}
              {isRunning && (
                <div className="flex-1 h-full relative flex items-center justify-start ml-2 pointer-events-none">
                  <div className={`h-12 w-2 rounded-full border-r-2 border-[#00F0FF]/40 animate-ping absolute`} style={{ left: "10%" }}></div>
                  <div className={`h-16 w-3 rounded-full border-r-2 border-[#00F0FF]/40 animate-ping absolute`} style={{ left: "30%", animationDelay: "0.2s" }}></div>
                  <div className={`h-20 w-4 rounded-full border-r-2 border-[#00F0FF]/40 animate-ping absolute`} style={{ left: "55%", animationDelay: "0.4s" }}></div>
                </div>
              )}

              {/* Alarm light indicator */}
              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-black px-2 py-1 rounded-none border border-[#222]">
                <span className={`w-2.5 h-2.5 rounded-full ${obstacleDistance < 10 && isRunning ? "bg-red-500 animate-pulse" : "bg-[#00F0FF]"}`}></span>
                <span className="font-mono text-[9px] text-gray-400">ALARM</span>
              </div>

              {/* Drag obstacle block */}
              <div 
                className="absolute w-8 h-20 bg-neutral-800 hover:bg-neutral-750 active:bg-[#00F0FF] rounded-none cursor-ew-resize flex flex-col items-center justify-center border border-[#333] transition-all shadow-md"
                style={{ left: `calc(40px + ${obstacleDistance * 3}px)` }}
              >
                <Sliders className="w-4 h-4 text-gray-400" />
                <span className="font-mono text-[9px] text-gray-300 mt-2">G'ov</span>
              </div>
            </div>

            <div className="w-full mt-6 space-y-2">
              <input 
                type="range" 
                min="2" 
                max="100" 
                value={obstacleDistance}
                onChange={(e) => setObstacleDistance(parseInt(e.target.value))}
                className="w-full h-1.5 bg-neutral-900 rounded-none appearance-none cursor-pointer accent-[#00F0FF]"
              />
              <p className="text-[10px] font-mono text-gray-500 text-center">{t("simObstacleSlider")}</p>
            </div>
          </div>
        )}

        {/* TYPE: IoT Web Server */}
        {type === "iot-web" && (
          <div className="w-full max-w-sm bg-[#050505] p-6 rounded-none border border-[#222] flex flex-col items-center">
            {/* ESP32 Physical board model */}
            <div className="w-full bg-[#0a0a0a] border border-[#222] p-4 rounded-none flex items-center gap-4 mb-6 shadow-md">
              <div className="bg-[#050505] p-2.5 rounded-none border border-[#222]">
                <Wifi className={`w-8 h-8 ${isRunning ? "text-[#00F0FF] animate-pulse" : "text-gray-600"}`} />
              </div>
              <div className="flex-1 font-mono text-xs">
                <p className="text-gray-200 font-bold">ESP32-WROOM-32D</p>
                <p className="text-[10px] text-gray-500">IP: {isRunning ? "192.168.4.1" : "Disconnected"}</p>
                <p className="text-[10px] text-gray-500">WiFi SSID: {isRunning ? "EduSphere_AP" : "None"}</p>
              </div>
            </div>

            {/* Simulated Web Interface Client */}
            <div className="w-full bg-[#0a0a0a] rounded-none border border-[#222] overflow-hidden shadow-inner font-mono">
              <div className="bg-[#050505] px-3 py-1.5 text-[9px] text-gray-400 border-b border-[#222] flex justify-between items-center">
                <span>http://192.168.4.1/dashboard</span>
                <span className="text-[#00F0FF] text-[8px] flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-[#00F0FF] rounded-full"></span> LIVE
                </span>
              </div>
              
              <div className="p-4 space-y-4 bg-black">
                <div className="flex justify-between items-center bg-[#0a0a0a] p-3 rounded-none border border-[#222]">
                  <span className="text-xs text-gray-400">🌡️ Temperature Sensor</span>
                  <span className="text-sm font-bold text-[#00F0FF]">{isRunning ? `${temp} °C` : "--.- °C"}</span>
                </div>

                <div className="flex justify-between items-center bg-[#0a0a0a] p-3 rounded-none border border-[#222]">
                  <span className="text-xs text-gray-400">🔌 Relay Bulb Switch</span>
                  <button 
                    disabled={!isRunning}
                    onClick={() => setRelayState(!relayState)}
                    className={`px-3 py-1 rounded-none text-xs font-semibold cursor-pointer transition-all ${
                      relayState && isRunning
                        ? "bg-[#00F0FF]/10 text-[#00F0FF] border border-[#00F0FF]" 
                        : "bg-neutral-900 text-gray-400 border border-[#222]"
                    }`}
                  >
                    {relayState && isRunning ? "ON" : "OFF"}
                  </button>
                </div>

                {/* Light Bulb graphic */}
                <div className="flex justify-center py-2">
                  <div 
                    className={`w-12 h-12 rounded-full border flex items-center justify-center transition-all duration-300 ${
                      relayState && isRunning 
                        ? "bg-[#00F0FF]/10 border-[#00F0FF] text-[#00F0FF] shadow-[0_0_25px_rgba(0,255,65,0.5)]" 
                        : "bg-[#050505] border-[#222] text-neutral-700"
                    }`}
                  >
                    <Zap className="w-6 h-6" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TYPE: Line Follower */}
        {type === "line-follower" && (
          <div className="w-full flex flex-col items-center">
            <canvas 
              ref={canvasRef} 
              width={400} 
              height={220} 
              className="bg-[#050505] border border-[#222] rounded-none max-w-full shadow-inner"
            ></canvas>
            
            <div className="w-full max-w-sm mt-4 flex items-center justify-between font-mono text-xs text-gray-500">
              <div className="flex items-center gap-1">
                <Sliders className="w-3.5 h-3.5 text-gray-400" />
                <span>Speed:</span>
                <input 
                  type="range" 
                  min="1" 
                  max="6" 
                  value={lfSpeed}
                  onChange={(e) => setLfSpeed(parseInt(e.target.value))}
                  className="w-20 h-1.5 bg-neutral-900 rounded-none appearance-none cursor-pointer accent-[#00F0FF] mx-2"
                />
              </div>
              <span>{lfStatus || "IR: White/White"}</span>
            </div>
            {isRunning && (
              <p className="text-[10px] font-mono text-[#00F0FF] mt-2 flex items-center gap-1 animate-pulse">
                <RefreshCw className="w-3 h-3 animate-spin" /> {t("simLineFollowerRun")}
              </p>
            )}
          </div>
        )}

        {/* TYPE: CV Grid */}
        {type === "cv-grid" && (
          <div className="w-full max-w-sm bg-[#050505] p-6 rounded-none border border-[#222] flex flex-col items-center">
            <div className="w-full flex justify-between items-center mb-4 font-mono text-xs">
              <span className="text-gray-400">Class:</span>
              <select 
                value={cvDetectionClass} 
                onChange={(e: any) => {
                  setCvDetectionClass(e.target.value);
                  if (isRunning) {
                    setIsDetecting(true);
                    setTimeout(() => setIsDetecting(false), 1200);
                  }
                }}
                className="bg-[#0a0a0a] text-gray-300 border border-[#222] rounded-none px-2 py-1 outline-none font-mono"
              >
                <option value="Robot">Robot Chassis</option>
                <option value="Obstacle">Obstacle Box</option>
                <option value="Human">Human Hand</option>
              </select>
            </div>

            {/* Simulated webcam screen */}
            <div className="relative w-full aspect-[4/3] bg-[#0a0a0a] border border-[#222] rounded-none overflow-hidden flex items-center justify-center">
              
              {/* Mesh background mimicking real-time pixel grid */}
              <div className="absolute inset-0 bg-[radial-gradient(#1a1a1a_1px,transparent_1px)] [background-size:16px_16px] opacity-25"></div>

              {/* Mock camera view element */}
              {cvDetectionClass === "Robot" && (
                <Cpu className="w-24 h-24 text-[#00F0FF]/40 absolute animate-pulse" />
              )}
              {cvDetectionClass === "Obstacle" && (
                <Shield className="w-24 h-24 text-amber-500/30 absolute animate-pulse" />
              )}
              {cvDetectionClass === "Human" && (
                <Eye className="w-24 h-24 text-purple-500/30 absolute animate-pulse" />
              )}

              {/* Detecting Overlay */}
              {isDetecting && (
                <div className="absolute inset-0 bg-[#00F0FF]/5 flex items-center justify-center border border-[#00F0FF]/50 animate-pulse">
                  <span className="font-mono text-xs text-[#00F0FF] tracking-wider">COMPUTING INFERENCE...</span>
                </div>
              )}

              {/* Confidence Bounding Box */}
              {isRunning && !isDetecting && (
                <div className="absolute border-2 border-[#00F0FF] bg-[#00F0FF]/5 p-2 rounded-none flex flex-col justify-between" style={{ width: "160px", height: "160px" }}>
                  <span className="bg-[#00F0FF] text-black font-mono text-[9px] px-1 py-0.5 rounded-none font-bold self-start">
                    {cvDetectionClass} (98.4%)
                  </span>
                  <div className="border-r-2 border-b-2 border-[#00F0FF] w-3 h-3 self-end"></div>
                </div>
              )}

              <div className="absolute bottom-2 left-2 flex items-center gap-1 text-[9px] font-mono bg-black/80 px-2 py-0.5 rounded-none text-gray-400 border border-[#222]">
                <Eye className="w-3 h-3 text-[#00F0FF]" /> YOLOv8 Inference
              </div>
            </div>

            <div className="mt-4 text-center font-mono text-[10px] text-gray-500">
              <p>{t("simCvClass")}: {isRunning ? `1 Object [${cvDetectionClass}]` : "No target"}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
