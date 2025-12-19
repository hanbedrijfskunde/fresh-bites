
import { WelcomeScreen } from './components/screens/WelcomeScreen';
import { SimulationScreen } from './components/screens/SimulationScreen';
import { EndScreen } from './components/screens/EndScreen';
import { useSimulationStore } from './store/useSimulationStore';

function App() {
  const { currentScreen } = useSimulationStore();

  return (
    <>
      {currentScreen === 'welcome' && <WelcomeScreen />}
      {currentScreen === 'simulation' && <SimulationScreen />}
      {currentScreen === 'end' && <EndScreen />}
    </>
  );
}

export default App;
