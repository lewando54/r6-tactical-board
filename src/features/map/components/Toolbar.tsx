// src/features/map/components/Toolbar.tsx
import React, { useState, useCallback } from 'react'; // Import useState
import { useTranslation } from 'react-i18next';
import { useMapState, useMapDispatch } from '../contexts/MapStateContext';
import { Tool } from '../types';
import OperatorSelector from './OperatorSelector'; // Import the potentially modified component

import { FaMousePointer, FaMapMarkerAlt, FaUserPlus, FaLongArrowAltRight, FaFont, FaPaintBrush, FaEraser, FaDownload, FaUpload, FaTrash, FaUndo } from 'react-icons/fa';

// Nowy prop dla komponentu, aby wiedzieć, które piętro jest aktualnie wybrane
interface ToolbarProps {
  currentFloor: number;
}

const Toolbar: React.FC<ToolbarProps> = ({ currentFloor }) => {
  const { t } = useTranslation();
  const mapState = useMapState();
  const { currentTool, selectedColor, mapId } = mapState;
  const dispatch = useMapDispatch();

  // --- State for Modal Visibility ---
  const [isOperatorSelectorOpen, setIsOperatorSelectorOpen] = useState<boolean>(false);

  const setTool = useCallback((tool: Tool) => dispatch({ type: 'SET_TOOL', payload: tool }), [dispatch]);
  const setColor = useCallback((e: React.ChangeEvent<HTMLInputElement>) => dispatch({ type: 'SET_COLOR', payload: e.target.value }), [dispatch]);

  // --- Handlers for Export, Import, Clear --- 
   // Implementacja funkcji eksportu
   const handleExport = useCallback(() => {
     // Przygotuj dane do eksportu
     const exportData = {
       elementsByFloor: mapState.elementsByFloor,
       stageState: mapState.stageState,
     };
     
     // Konwertuj dane do formatu JSON
     const jsonString = JSON.stringify(exportData, null, 2);
     
     // Utwórz link do pobrania pliku
     const blob = new Blob([jsonString], { type: 'application/json' });
     const url = URL.createObjectURL(blob);
     
     // Przygotuj nazwę pliku z datą i ID mapy
     const fileName = `r6-tactical-map-${mapId || 'untitled'}-${new Date().toISOString().slice(0, 10)}.json`;
     
     // Utwórz link i wywołaj kliknięcie, aby rozpocząć pobieranie
     const a = document.createElement('a');
     a.href = url;
     a.download = fileName;
     document.body.appendChild(a);
     a.click();
     
     // Zwolnij zasoby
     setTimeout(() => {
       document.body.removeChild(a);
       URL.revokeObjectURL(url);
     }, 100);
   }, [mapState.elementsByFloor, mapState.stageState, mapId]);
   
   // Implementacja funkcji importu
   const handleImport = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
     const file = event.target.files?.[0];
     if (!file) return;
     
     const reader = new FileReader();
     reader.onload = (e) => {
       try {
         const json = JSON.parse(e.target?.result as string);
         dispatch({ type: 'LOAD_STATE', payload: json });
       } catch (error) {
         console.error('Błąd podczas importowania pliku:', error);
         alert(t('map.importError', 'Wystąpił błąd podczas importowania pliku.'));
       }
     };
     reader.readAsText(file);
     
     // Reset input field value to allow reimporting the same file
     event.target.value = '';
   }, [dispatch, t]);
   
   // --- Implementacja funkcji czyszczenia płótna ---
   const handleClear = useCallback(() => {
     // Wyświetl opcję czyszczenia tylko aktualnego piętra lub całej mapy
     const clearOption = window.confirm(
        t('map.confirmClearOptions', 'Czy chcesz wyczyścić TYLKO AKTUALNE PIĘTRO? Wybierz OK, aby wyczyścić tylko aktualne piętro, lub Anuluj, aby wyświetlić więcej opcji.')
     );
     
     if (clearOption) {
       // Wyczyść tylko aktualne piętro
       dispatch({ type: 'CLEAR_CANVAS', payload: { floor: currentFloor } });
     } else {
       // Pokaż drugi dialog o czyszczeniu całej mapy
       const clearAll = window.confirm(
          t('map.confirmClearAll', 'Czy chcesz wyczyścić WSZYSTKIE PIĘTRA? Ta operacja jest nieodwracalna.')
       );
       if (clearAll) {
         dispatch({ type: 'CLEAR_CANVAS' }); // Wyczyść wszystkie piętra
       }
     }
   }, [dispatch, t, currentFloor]);

   // --- Handler for Operator Button ---
   const handleOperatorButtonClick = useCallback(() => {
       setTool('operator'); // Set the tool when the button is clicked
       setIsOperatorSelectorOpen(true); // Open the modal
   }, [setTool]); // setTool is stable due to useCallback in its definition

   // --- Implementacja funkcji cofania (Undo) ---
   const handleUndo = useCallback(() => {
     dispatch({ type: 'UNDO' });
   }, [dispatch]);

   // --- Button Class Helper ---
   const getButtonClass = (tool: Tool): string =>
    `p-2 m-1 border rounded-md flex items-center justify-center transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 ${
      currentTool === tool
        ? 'bg-blue-600 text-white border-blue-700 shadow-inner'
        : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-white'
    }`;

  return (
    <> {/* Use Fragment to avoid adding an extra div */}
      <div className="toolbar flex flex-col p-2 bg-gray-800 shadow-lg w-16 md:w-20 flex-shrink-0 z-20"> {/* Ensure toolbar has z-index if needed */}
         {/* --- Tool Buttons --- */}
         <div className="flex flex-col items-center space-y-1 mb-4">
             <button className={getButtonClass('select')} onClick={() => setTool('select')} title={t('toolbar.select')}>
                 <FaMousePointer size={20} />
             </button>
             {/* ... other tool buttons ... */}
              <button className={getButtonClass('permMarker')} onClick={() => setTool('permMarker')} title={t('toolbar.permMarker')}>
                 <FaMapMarkerAlt size={20} className="text-red-500"/>
             </button>
             {/* Operator Button now triggers modal */}
             <button className={getButtonClass('operator')} onClick={handleOperatorButtonClick} title={t('toolbar.operator')}>
                  <FaUserPlus size={20}/>
             </button>
             {/* ... other tool buttons ... */}
              <button className={getButtonClass('arrow')} onClick={() => setTool('arrow')} title={t('toolbar.arrow')}>
                 <FaLongArrowAltRight size={20}/>
             </button>
             <button className={getButtonClass('text')} onClick={() => setTool('text')} title={t('toolbar.text')}>
                 <FaFont size={18}/>
             </button>
             <button className={getButtonClass('draw')} onClick={() => setTool('draw')} title={t('toolbar.draw')}>
                 <FaPaintBrush size={18}/>
             </button>
             <button className={getButtonClass('erase')} onClick={() => setTool('erase')} title={t('toolbar.erase')}>
                 <FaEraser size={18}/>
             </button>
         </div>

          {/* --- Color Picker --- */}
          <div className="mb-4 flex flex-col items-center">
              {/* ... existing color picker code ... */}
               <label htmlFor="colorPicker" className="sr-only">{t('toolbar.color')}</label>
              <input
                  id="colorPicker"
                  type="color"
                  value={selectedColor}
                  onChange={setColor}
                  className="w-10 h-10 p-0 border-none rounded-full cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
                  title={t('toolbar.color')}
               />
          </div>

         {/* --- Action Buttons (Undo/Import/Export/Clear) --- */}
          <div className="mt-auto pt-4 border-t border-gray-600 flex flex-col items-center space-y-1">
                {/* Przycisk Cofnij (Undo) */}
                <button 
                    onClick={handleUndo} 
                    title={t('map.undo', 'Cofnij (Ctrl+Z)')} 
                    className="p-2 m-1 border rounded-md flex items-center justify-center text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-white transition-colors duration-150 ease-in-out focus:outline-none"
                >
                    <FaUndo size={18}/>
                </button>
                
                {/* ... existing action button code ... */}
                <button onClick={handleExport} title={t('map.export')} className="p-2 m-1 border rounded-md flex items-center justify-center text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-white transition-colors duration-150 ease-in-out focus:outline-none">
                   <FaDownload size={20}/>
               </button>
               <label htmlFor="importFile" title={t('map.import')} className="p-2 m-1 border rounded-md flex items-center justify-center text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-white transition-colors duration-150 ease-in-out focus:outline-none cursor-pointer">
                  <FaUpload size={20}/>
               </label>
               <input id="importFile" type="file" accept=".json" onChange={handleImport} className="hidden" />
               <button onClick={handleClear} title={t('map.clear')} className="p-2 m-1 border rounded-md flex items-center justify-center text-gray-300 border-gray-600 hover:bg-red-600 hover:text-white transition-colors duration-150 ease-in-out focus:outline-none">
                   <FaTrash size={18}/>
               </button>
          </div>
      </div>

      {/* --- Render the Operator Selector Modal --- */}
      {/* It's now controlled by local state and rendered via Portal */}
      <OperatorSelector
        isOpen={isOperatorSelectorOpen}
        onClose={() => setIsOperatorSelectorOpen(false)}
      />
    </>
  );
}

export default Toolbar;