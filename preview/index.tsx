import { createRoot } from 'react-dom/client';
import { App } from './App';
import { LocaleManager } from '../src/LocaleManager';
import nl from '../src/locale/nl';

LocaleManager.setLocale('nl', nl);

createRoot(document.getElementById('root')).render(<App />);
