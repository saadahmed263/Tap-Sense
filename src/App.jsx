import React, { useState, useEffect, useRef } from 'react';
import { 
  Printer, MousePointer2, Smile, AlertTriangle, Zap, HelpCircle
} from 'lucide-react';

const App = () => {
  // STATE
  const [step, setStep] = useState('setup');
  const [longImg, setLongImg] = useState(null);
  const [status, setStatus] = useState("Initializing Engine...");
  
  // LIVE METRICS
  const [faceDetected, setFaceDetected] = useState(false);
  const [emotions, setEmotions] = useState({ happy: 0, angry: 0, surprised: 0, confused: 0 });
  const [scrollDepth, setScrollDepth] = useState(0);

  // REFS (Permanent Memory)
  const eventsRef = useRef([]); 
  const pointsRef = useRef([]);
  const isTestingRef = useRef(false);
  const videoRef = useRef(null);
  const landmarkerRef = useRef(null);
  const startTimeRef = useRef(0);

  const styles = {
    mainContainer: {
        width: '100vw', minHeight: '100vh', background: '#f8f9fa', 
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        fontFamily: 'Inter, sans-serif', overflowX: 'hidden'
    },
    hiddenVideo: { position: 'absolute', top: '-9999px', left: '-9999px', opacity: 0 },
    card: {
        background: 'white', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
        padding: '40px', width: '640px', maxWidth: '95%', textAlign: 'center',
        display: 'flex', flexDirection: 'column', alignItems: 'center'
    },
    mirrorBox: {
        width: '480px', height: '360px', background: '#000', borderRadius: '12px',
        position: 'relative', overflow: 'hidden', marginBottom: '20px',
        border: faceDetected ? '4px solid #22c55e' : '4px solid #ef4444'
    },
    phoneView: {
        width: '375px', height: '667px', background: 'white', border: '10px solid #222', 
        borderRadius: '35px', overflowY: 'scroll', overflowX: 'hidden', position: 'relative',
        boxShadow: '0 30px 60px rgba(0,0,0,0.3)', margin: '20px 0'
    },
    camPreview: { 
        position: 'fixed', bottom: 30, right: 30, width: 160, height: 120, 
        borderRadius: 12, overflow: 'hidden', border: '4px solid #fff', 
        zIndex: 9999, background: '#000', boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    },
    barRow: { display: 'flex', alignItems: 'center', gap: '10px', width: '100%', marginBottom: '8px', fontSize: '12px' },
    barTrack: { flex: 1, height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }
  };

  useEffect(() => {
    const initAI = async () => {
      try {
          setStatus("Downloading AI...");
          const vision = await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/+esm");
          const filesetResolver = await vision.FilesetResolver.forVisionTasks(
            "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.3/wasm"
          );
          landmarkerRef.current = await vision.FaceLandmarker.createFromOptions(filesetResolver, {
            baseOptions: {
              modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
              delegate: "GPU"
            },
            outputFaceBlendshapes: true, runningMode: "VIDEO", numFaces: 1
          });
          setStatus("AI Ready.");
      } catch (e) { setStatus("AI Error: " + e.message); }
    };
    initAI();
  }, []);

  const startCamera = async () => {
      if (!videoRef.current) return;
      try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } });
          videoRef.current.srcObject = stream;
          videoRef.current.addEventListener("loadeddata", () => {
              videoRef.current.play();
              runDetectionLoop();
          });
      } catch (e) { setStatus("Camera Denied."); }
  };

  const runDetectionLoop = () => {
      setInterval(() => {
          if (videoRef.current && videoRef.current.currentTime > 0 && landmarkerRef.current) {
              const result = landmarkerRef.current.detectForVideo(videoRef.current, performance.now());
              drawToCanvas('setup-canvas', 480, 360);
              drawToCanvas('preview-canvas', 160, 120);

              if (result.faceBlendshapes && result.faceBlendshapes.length > 0) {
                  setFaceDetected(true);
                  const shapes = result.faceBlendshapes[0].categories;
                  const getScore = (name) => shapes.find(s => s.categoryName === name)?.score || 0;
                  
                  const happy = (getScore('mouthSmileLeft') + getScore('mouthSmileRight')) / 2;
                  const angry = (getScore('browDownLeft') + getScore('browDownRight')) / 2;
                  const surprised = (getScore('browOuterUpLeft') + getScore('browOuterUpRight')) / 2;
                  const confused = (getScore('eyeSquintLeft') + getScore('eyeSquintRight')) / 2;

                  setEmotions({ happy, angry, surprised, confused });

                  if (isTestingRef.current) {
                      if (happy > 0.2) logEvent('DELIGHT', 'Smile', <Smile size={14}/>, '#dcfce7', '#166534');
                      if (angry > 0.2) logEvent('FRUSTRATION', 'Brow Furrow', <AlertTriangle size={14}/>, '#fee2e2', '#991b1b');
                      if (surprised > 0.3) logEvent('SURPRISE', 'Eyebrow Raise', <Zap size={14}/>, '#fef9c3', '#854d0e');
                      if (confused > 0.3) logEvent('CONFUSION', 'Squinting', <HelpCircle size={14}/>, '#e0f2fe', '#075985');
                  }
              } else { setFaceDetected(false); }
          }
      }, 100);
  };

  const drawToCanvas = (id, w, h) => {
      const canvas = document.getElementById(id);
      if (canvas && videoRef.current) {
          const ctx = canvas.getContext('2d');
          ctx.save(); ctx.scale(-1, 1); ctx.drawImage(videoRef.current, -w, 0, w, h); ctx.restore();
      }
  };

  const logEvent = (type, detail, icon, bg, color) => {
      const now = Date.now();
      const timeOffset = ((now - startTimeRef.current) / 1000).toFixed(1);
      const last = eventsRef.current[eventsRef.current.length - 1];
      if (last && last.type === type && (now - last.timestamp) < 1500) return;
      eventsRef.current.push({ time: timeOffset, timestamp: now, type, detail, icon, bg, color });
  };

  const handleImageClick = (e) => {
      if (!isTestingRef.current) return;
      const rect = e.target.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      pointsRef.current.push({ x, y, id: pointsRef.current.length + 1 });
      logEvent('INTERACTION', `Click #${pointsRef.current.length}`, <MousePointer2 size={14}/>, '#f3f4f6', '#111');
      setScrollDepth(prev => prev); // Force render
  };

  const val = (v) => (v || 0) * 100;

  return (
    <div style={styles.mainContainer}>
      <video ref={videoRef} autoPlay muted playsInline style={styles.hiddenVideo} />

      {step === 'setup' && (
        <div style={styles.card}>
            <h1 style={{fontSize: '28px', fontWeight: '900', marginBottom: 10}}>UX Emotion Lab</h1>
            <p style={{marginBottom: 20, color: '#666'}}>{status}</p>
            <div style={styles.mirrorBox}>
                <canvas id="setup-canvas" width="480" height="360" style={{width: '100%', height: '100%'}}/>
                <div style={{position: 'absolute', bottom: 10, left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.8)', color: 'white', padding: '5px 15px', borderRadius: 20, fontSize: 12}}>
                    {faceDetected ? "FACE DETECTED" : "SEARCHING..."}
                </div>
            </div>
            <div style={{width: '100%', background: '#f8f9fa', padding: 20, borderRadius: 12, marginBottom: 20}}>
                <div style={styles.barRow}><span style={{width: 60}}>Happy</span><div style={styles.barTrack}><div style={{width: `${val(emotions.happy)}%`, height: '100%', background: '#22c55e'}}/></div></div>
                <div style={styles.barRow}><span style={{width: 60}}>Frust.</span><div style={styles.barTrack}><div style={{width: `${val(emotions.angry)}%`, height: '100%', background: '#ef4444'}}/></div></div>
                <div style={styles.barRow}><span style={{width: 60}}>Confused</span><div style={styles.barTrack}><div style={{width: `${val(emotions.confused)}%`, height: '100%', background: '#0ea5e9'}}/></div></div>
            </div>
            <div style={{display: 'flex', gap: 10, width: '100%'}}>
                 <button onClick={startCamera} style={{flex: 1, padding: 15, background: '#111', color: 'white', borderRadius: 8, border: 'none', cursor: 'pointer', fontWeight: 'bold'}}>1. ENABLE CAMERA</button>
                 <label style={{flex: 1, padding: 15, background: '#e5e7eb', borderRadius: 8, cursor: 'pointer', fontWeight: 'bold', color: '#333'}}>2. UPLOAD UI<input type="file" onChange={(e) => setLongImg(URL.createObjectURL(e.target.files[0]))} style={{display: 'none'}} /></label>
            </div>
            <button onClick={() => { startTimeRef.current = Date.now(); isTestingRef.current = true; setStep('testing'); }} disabled={!longImg || !faceDetected} style={{width: '100%', marginTop: 15, padding: 18, background: (longImg && faceDetected) ? '#22c55e' : '#ccc', color: 'white', border: 'none', borderRadius: 8, fontWeight: 'bold', cursor: 'pointer'}}>START TESTING</button>
        </div>
      )}

      {step === 'testing' && (
        <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
            <div style={styles.camPreview}><canvas id="preview-canvas" width="160" height="120" style={{width: '100%', height: '100%'}}/></div>
            <div style={styles.phoneView} onScroll={(e) => { const { scrollTop, scrollHeight, clientHeight } = e.target; setScrollDepth(Math.round(((scrollTop + clientHeight) / scrollHeight) * 100)); }}>
                <img src={longImg} style={{width: '100%', display: 'block'}} onClick={handleImageClick} />
            </div>
            <button onClick={() => { isTestingRef.current = false; setStep('report'); }} style={{padding: '15px 40px', background: '#dc2626', color: 'white', borderRadius: 30, border: 'none', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 5px 15px rgba(220,38,38,0.4)'}}>STOP & GENERATE REPORT</button>
        </div>
      )}

      {step === 'report' && (
        <div style={styles.card}>
            <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', marginBottom: 30, borderBottom: '2px solid #eee', paddingBottom: 20}}>
                <h1 style={{margin: 0}}>UX Report</h1>
                <button onClick={() => window.print()} style={{background: '#111', color: '#fff', padding: '8px 16px', borderRadius: 6, border: 'none', cursor: 'pointer'}}><Printer size={16}/></button>
            </div>
            <div style={{display: 'flex', gap: 10, marginBottom: 30, width: '100%', justifyContent: 'center'}}>
                <div style={{padding: 15, background: '#f0fdf4', borderRadius: 12, width: 100}}>
                    <div style={{fontSize: 20, fontWeight: 900, color: '#166534'}}>{eventsRef.current.filter(e => e.type === 'DELIGHT').length}</div>
                    <div style={{fontSize: 10, fontWeight: 'bold', color: '#166534'}}>DELIGHT</div>
                </div>
                <div style={{padding: 15, background: '#fef2f2', borderRadius: 12, width: 100}}>
                    <div style={{fontSize: 20, fontWeight: 900, color: '#991b1b'}}>{eventsRef.current.filter(e => e.type === 'FRUSTRATION').length}</div>
                    <div style={{fontSize: 10, fontWeight: 'bold', color: '#991b1b'}}>FRUSTRATION</div>
                </div>
                <div style={{padding: 15, background: '#f3f4f6', borderRadius: 12, width: 100}}>
                    <div style={{fontSize: 20, fontWeight: 900, color: '#374151'}}>{scrollDepth}%</div>
                    <div style={{fontSize: 10, fontWeight: 'bold', color: '#374151'}}>SCROLL</div>
                </div>
            </div>
            <div style={{position: 'relative', width: '100%', border: '2px solid #eee', borderRadius: 12, overflow: 'hidden', marginBottom: 30}}>
                <img src={longImg} style={{width: '100%', display: 'block', opacity: 0.6}} />
                {pointsRef.current.map((p, i) => (
                    <div key={i} style={{position: 'absolute', left: `${p.x}%`, top: `${p.y}%`, width: 32, height: 32, background: '#dc2626', borderRadius: '50%', transform: 'translate(-50%,-50%)', border: '3px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px', boxShadow: '0 4px 6px rgba(0,0,0,0.3)'}}>{p.id}</div>
                ))}
            </div>
            <div style={{width: '100%', border: '1px solid #eee', borderRadius: 12, overflow: 'hidden', textAlign: 'left'}}>
                {eventsRef.current.map((e, i) => (
                    <div key={i} style={{padding: 12, borderBottom: '1px solid #f8f9fa', display: 'flex', gap: 12, alignItems: 'center'}}>
                        <span style={{fontFamily: 'monospace', color: '#999', fontSize: 11, minWidth: 35}}>{e.time}s</span>
                        <div style={{background: e.bg, color: e.color, padding: 5, borderRadius: 6}}>{e.icon}</div>
                        <div><span style={{fontWeight: 'bold', marginRight: 8, fontSize: 13}}>{e.type}</span><span style={{color: '#666', fontSize: 12}}>{e.detail}</span></div>
                    </div>
                ))}
            </div>
        </div>
      )}
    </div>
  );
};
export default App;