import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Clock3, Heart, Play, RotateCcw, Star, Trash2, Trophy } from "lucide-react";

const foods = [
  { id: "broccoli", name: "Broccoli", icon: "🥦", type: "vegetable", color: "green" },
  { id: "carrot", name: "Carrot", icon: "🥕", type: "vegetable", color: "orange" },
  { id: "spinach", name: "Spinach", icon: "🥬", type: "vegetable", color: "green" },
  { id: "tomato", name: "Tomato", icon: "🍅", type: "vegetable", color: "red" },
  { id: "capsicum", name: "Capsicum", icon: "🫑", type: "vegetable", color: "green" },
  { id: "chicken", name: "Chicken", icon: "🍗", type: "protein", color: "amber", tag: "Animal-based" },
  { id: "fish", name: "Fish", icon: "🐟", type: "protein", color: "blue", tag: "Animal-based" },
  { id: "egg", name: "Egg", icon: "🥚", type: "protein", color: "cream", tag: "Animal-based" },
  { id: "tofu", name: "Tofu", icon: "◻️", type: "protein", color: "lime", tag: "Plant-based" },
  { id: "beans", name: "Beans", icon: "🫘", type: "protein", color: "rose", tag: "Plant-based" },
  { id: "rice", name: "White Rice", icon: "🍚", type: "carb", color: "cream" },
  { id: "brown-rice", name: "Brown Rice", icon: "🍛", type: "carb", color: "amber" },
  { id: "bread", name: "Wholemeal Bread", icon: "🍞", type: "carb", color: "amber" },
  { id: "potato", name: "Potato", icon: "🥔", type: "carb", color: "orange" },
  { id: "noodles", name: "Noodles", icon: "🍜", type: "carb", color: "red" },
];

const labels = { vegetable: "Vegetables", protein: "Protein", carb: "Carbohydrates" };
const goals = { vegetable: 2, protein: 1, carb: 1 };
const roundSeconds = 60;

function App() {
  const [gameState, setGameState] = useState("intro");
  const [plate, setPlate] = useState([]);
  const [score, setScore] = useState(0);
  const [served, setServed] = useState(0);
  const [time, setTime] = useState(roundSeconds);
  const [lives, setLives] = useState(3);
  const [message, setMessage] = useState("");
  const [streak, setStreak] = useState(0);

  const shuffledFoods = useMemo(() => [...foods].sort(() => Math.random() - 0.5), [served, gameState]);
  const counts = useMemo(() => plate.reduce((a, f) => ({ ...a, [f.type]: (a[f.type] || 0) + 1 }), {},), [plate]);

  useEffect(() => {
    if (gameState !== "playing") return;
    if (time <= 0 || lives <= 0) {
      setGameState("finished");
      return;
    }
    const timer = window.setTimeout(() => setTime((value) => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [gameState, time, lives]);

  const start = () => {
    setGameState("playing"); setPlate([]); setScore(0); setServed(0);
    setTime(roundSeconds); setLives(3); setStreak(0);
    setMessage("Choose four food cards to build the meal!");
  };

  const addFood = (food) => {
    if (plate.length >= 4) return setMessage("The plate is full. Serve it or remove a card.");
    setPlate((p) => [...p, { ...food, plateId: `${food.id}-${Date.now()}-${Math.random()}` }]);
    setMessage("");
  };

  const serve = () => {
    const correct = plate.length === 4 && Object.keys(goals).every((type) => counts[type] === goals[type]);
    if (correct) {
      const points = 100 + streak * 20;
      setScore((s) => s + points); setServed((s) => s + 1); setStreak((s) => s + 1);
      setTime((t) => Math.min(roundSeconds, t + 5)); setPlate([]);
      setMessage(`Excellent balanced meal! +${points} points and +5 seconds.`);
    } else {
      setLives((l) => l - 1); setStreak(0);
      setMessage("Not balanced yet. Use 2 vegetables, 1 protein and 1 carbohydrate.");
    }
  };

  if (gameState === "intro") return (
    <main className="page centre">
      <section className="intro-card">
        <div className="intro-hero"><div className="hero-icon">🍽️</div><small>NUTRITION GAME</small><h1>Balanced Plate Dash</h1><p>Race against the clock to prepare balanced meals for hungry customers.</p></div>
        <div className="intro-rules"><h2>Build every plate with:</h2><Rule icon="🥦" text="2 portions of vegetables"/><Rule icon="🐟" text="1 portion of protein" sub="Plant-based or animal-based"/><Rule icon="🍚" text="1 portion of carbohydrates"/><button className="primary" onClick={start}><Play/> Start Game</button></div>
      </section>
    </main>
  );

  if (gameState === "finished") return (
    <main className="page centre"><section className="finish-card"><Trophy className="trophy"/><h1>Great work, Chef!</h1><p>You served {served} balanced {served === 1 ? "meal" : "meals"}.</p><div className="final-score"><small>FINAL SCORE</small><strong>{score}</strong></div><p>Remember: fill half the plate with vegetables, then add one portion of protein and one portion of carbohydrates.</p><button className="primary" onClick={start}><RotateCcw/> Play Again</button></section></main>
  );

  return (
    <main className="page">
      <header><div><small>NUTRITION GAME</small><h1>Balanced Plate Dash</h1></div><div className="status-list"><Status icon={<Clock3/>} text={`${time}s`} kind={time <= 10 ? "danger" : "blue"}/><Status icon={<Star/>} text={score} kind="gold"/><Status icon={<Heart fill="currentColor"/>} text={lives} kind="rose"/></div></header>
      <div className="game-grid">
        <section className="panel counter"><div className="section-title"><div><h2>Food Counter</h2><p>Tap a food card to place it on the plate.</p></div><b>Meals served: {served}</b></div><div className="food-grid">{shuffledFoods.map((food) => <motion.button whileHover={{y:-4}} whileTap={{scale:.95}} key={food.id} className={`food-card ${food.color}`} onClick={() => addFood(food)}><span>{food.icon}</span><b>{food.name}</b><small>{labels[food.type]}</small>{food.tag && <em>{food.tag}</em>}</motion.button>)}</div></section>
        <aside><section className="panel order"><div className="section-title"><div><small>CUSTOMER ORDER</small><h2>One Balanced Meal</h2></div><span className="chef">🧑‍🍳</span></div><Goal icon="🥦" label="Vegetables" count={counts.vegetable || 0} goal={2}/><Goal icon="🐟" label="Protein" count={counts.protein || 0} goal={1}/><Goal icon="🍚" label="Carbohydrates" count={counts.carb || 0} goal={1}/></section>
          <section className="panel plate-panel"><div className="section-title"><h2>Your Plate</h2><button className="clear" onClick={() => {setPlate([]);setMessage("Plate cleared. Try again!");}}><Trash2/> Clear</button></div><div className="plate">{plate.length === 0 ? <p>Your plate is empty.<br/>Choose 4 cards.</p> : <div className="plate-grid"><AnimatePresence>{plate.map((food) => <motion.button initial={{scale:0}} animate={{scale:1}} exit={{scale:0}} key={food.plateId} className={`plate-food ${food.color}`} onClick={() => setPlate((p) => p.filter((x) => x.plateId !== food.plateId))}><span>{food.icon}</span><b>{food.name}</b></motion.button>)}</AnimatePresence></div>}</div><div className="message">{message}</div><button className="primary" disabled={plate.length !== 4} onClick={serve}>🔔 Serve Meal</button></section>
        </aside>
      </div>
    </main>
  );
}

const Rule = ({icon,text,sub}) => <div className="rule"><span>{icon}</span><div><b>{text}</b>{sub && <small>{sub}</small>}</div></div>;
const Status = ({icon,text,kind}) => <div className={`status ${kind}`}>{icon}<b>{text}</b></div>;
const Goal = ({icon,label,count,goal}) => { const width=Math.min(100,count/goal*100); return <div className="goal"><div><b>{icon} {label}</b><strong className={count===goal?"done":count>goal?"over":""}>{count}/{goal}</strong></div><span><i className={count>goal?"overbar":""} style={{width:`${width}%`}}/></span></div> };
export default App;
