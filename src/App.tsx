import { GoalSetup } from './components/GoalSetup/GoalSetup';
import { Game } from './components/Game/Game';
import { VictoryScreen } from './components/Victory/VictoryScreen';
import { ScanlinesOverlay } from './components/ScanlinesOverlay';
import { GameProvider, useGame } from './context/GameContext';
import './styles/global.css';

function RouterView() {
  const { state } = useGame();

  if (state.isFirstLaunch) return <GoalSetup />;
  if (state.isVictory) return <VictoryScreen />;
  return <Game />;
}

export default function App() {
  return (
    <GameProvider>
      <ScanlinesOverlay />
      <div className="app">
        <RouterView />
      </div>
    </GameProvider>
  );
}
