import { useCallback, useState, type ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';
import {
  FaDownload,
  FaEraser,
  FaFont,
  FaList,
  FaLongArrowAltRight,
  FaMapMarkerAlt,
  FaMousePointer,
  FaPaintBrush,
  FaTrash,
  FaUndo,
  FaUpload,
  FaUserPlus,
} from 'react-icons/fa';
import { Modal } from '../../../components/Modal';
import { legendItems } from '../config/legendConfig';
import { useMapDispatch, useMapState } from '../state/MapStateContext';
import type { LegendItemConfig, Tool } from '../types';
import { createStrategyFile, parseStrategyFile, serializeStrategyFile } from '../schemas/strategyFile';
import OperatorSelector from './OperatorSelector';

interface ToolbarProps {
  currentFloor: number;
}

export default function Toolbar({ currentFloor }: ToolbarProps) {
  const { t } = useTranslation();
  const mapState = useMapState();
  const { currentTool, selectedColor, mapId } = mapState;
  const dispatch = useMapDispatch();
  const [isOperatorSelectorOpen, setIsOperatorSelectorOpen] = useState(false);
  const [isLegendSelectorOpen, setIsLegendSelectorOpen] = useState(false);
  const [isClearDialogOpen, setIsClearDialogOpen] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);

  const setTool = useCallback((tool: Tool) => dispatch({ type: 'SET_TOOL', payload: tool }), [dispatch]);
  const setColor = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_COLOR', payload: event.target.value });
  }, [dispatch]);

  const setLegendItem = useCallback(
    (item: LegendItemConfig) => {
      dispatch({ type: 'SET_LEGEND_ITEM', payload: item });
      setTool('legendIcon');
      setIsLegendSelectorOpen(false);
    },
    [dispatch, setTool],
  );

  const handleExport = useCallback(() => {
    if (!mapId) {
      return;
    }
    const exportData = createStrategyFile(mapId, mapState.elementsByFloor, mapState.stageState);
    const jsonString = serializeStrategyFile(exportData);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const fileName = `r6-tactical-map-${mapId}-${new Date().toISOString().slice(0, 10)}.json`;
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = fileName;
    document.body.appendChild(anchor);
    anchor.click();
    document.body.removeChild(anchor);
    URL.revokeObjectURL(url);
  }, [mapId, mapState.elementsByFloor, mapState.stageState]);

  const handleImport = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      event.target.value = '';
      if (!file) {
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result;
        if (typeof result !== 'string') {
          setImportError(t('map.importError'));
          return;
        }
        try {
          const json: unknown = JSON.parse(result);
          const strategy = parseStrategyFile(json);
          dispatch({
            type: 'LOAD_STATE',
            payload: {
              elementsByFloor: strategy.elementsByFloor,
              stageState: strategy.stageState,
            },
          });
        } catch {
          setImportError(t('map.importError'));
        }
      };
      reader.readAsText(file);
    },
    [dispatch, t],
  );

  const getButtonClass = (tool: Tool): string =>
    `p-2 m-1 border rounded-md flex items-center justify-center transition-all duration-150 ease-in-out focus:outline-none ${
      currentTool === tool
        ? 'bg-blue-600 text-white border-blue-700 shadow-lg scale-105 transform ring-2 ring-blue-500 ring-opacity-50'
        : 'bg-gray-700 text-gray-300 border-gray-600 hover:bg-gray-600 hover:text-white'
    }`;

  return (
    <>
      <div className="toolbar z-20 flex w-32 flex-shrink-0 flex-col bg-gray-800 p-2 shadow-lg md:w-40">
        <div className="mb-4 grid grid-cols-2 gap-1">
          <button type="button" className={getButtonClass('select')} onClick={() => setTool('select')} title={t('toolbar.select')}>
            <FaMousePointer size={20} />
          </button>
          <button type="button" className={getButtonClass('permMarker')} onClick={() => setTool('permMarker')} title={t('toolbar.permMarker')}>
            <FaMapMarkerAlt size={20} className="text-red-500" />
          </button>
          <button
            type="button"
            className={getButtonClass('operator')}
            onClick={() => {
              setTool('operator');
              setIsOperatorSelectorOpen(true);
            }}
            title={t('toolbar.operator')}
          >
            <FaUserPlus size={20} />
          </button>
          <button type="button" className={getButtonClass('arrow')} onClick={() => setTool('arrow')} title={t('toolbar.arrow')}>
            <FaLongArrowAltRight size={20} />
          </button>
          <button type="button" className={getButtonClass('text')} onClick={() => setTool('text')} title={t('toolbar.text')}>
            <FaFont size={18} />
          </button>
          <button type="button" className={getButtonClass('draw')} onClick={() => setTool('draw')} title={t('toolbar.draw')}>
            <FaPaintBrush size={18} />
          </button>
          <button type="button" className={getButtonClass('erase')} onClick={() => setTool('erase')} title={t('toolbar.erase')}>
            <FaEraser size={18} />
          </button>
          <button
            type="button"
            className={getButtonClass('legendIcon')}
            onClick={() => setIsLegendSelectorOpen(true)}
            title={t('toolbar.legendIcon')}
          >
            <FaList size={20} />
          </button>
        </div>

        <div className="mb-4 flex flex-col items-center">
          <label htmlFor="colorPicker" className="sr-only">
            {t('toolbar.color')}
          </label>
          <input
            id="colorPicker"
            type="color"
            value={selectedColor}
            onChange={setColor}
            className="h-10 w-10 cursor-pointer rounded-full border-none p-0 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            title={t('toolbar.color')}
          />
        </div>

        <div className="mt-auto flex flex-col items-center space-y-1 border-t border-gray-600 pt-4">
          <button
            type="button"
            onClick={() => dispatch({ type: 'UNDO' })}
            title={t('map.undo')}
            className="m-1 flex items-center justify-center rounded-md border border-gray-600 p-2 text-gray-300 transition-colors hover:bg-gray-600 hover:text-white focus:outline-none"
          >
            <FaUndo size={18} />
          </button>
          <button
            type="button"
            onClick={handleExport}
            title={t('map.export')}
            className="m-1 flex items-center justify-center rounded-md border border-gray-600 p-2 text-gray-300 transition-colors hover:bg-gray-600 hover:text-white focus:outline-none"
          >
            <FaDownload size={20} />
          </button>
          <label
            htmlFor="importFile"
            title={t('map.import')}
            className="m-1 flex cursor-pointer items-center justify-center rounded-md border border-gray-600 p-2 text-gray-300 transition-colors hover:bg-gray-600 hover:text-white focus:outline-none"
          >
            <FaUpload size={20} />
          </label>
          <input id="importFile" type="file" accept=".json" onChange={handleImport} className="hidden" />
          <button
            type="button"
            onClick={() => setIsClearDialogOpen(true)}
            title={t('map.clear')}
            className="m-1 flex items-center justify-center rounded-md border border-gray-600 p-2 text-gray-300 transition-colors hover:bg-red-600 hover:text-white focus:outline-none"
          >
            <FaTrash size={18} />
          </button>
        </div>
      </div>

      <Modal
        isOpen={isLegendSelectorOpen}
        onClose={() => setIsLegendSelectorOpen(false)}
        title={t('toolbar.selectLegendItem')}
        titleId="legend-selector-title"
        panelClassName="max-w-md"
      >
        <div className="grid grid-cols-2 gap-2">
          {legendItems.map((item) => (
            <button
              type="button"
              key={item.id}
              className="flex items-center justify-center rounded-md border border-gray-600 p-2 text-white transition-colors hover:bg-gray-600"
              onClick={() => setLegendItem(item)}
            >
              {item.symbol ? (
                <span className="mr-2 text-2xl" style={{ color: item.color }}>
                  {item.symbol}
                </span>
              ) : (
                <span className="mr-2 text-2xl">
                  <img className="h-6 w-6" src={item.svgSource} alt="" />
                </span>
              )}
              <span>{t(item.nameKey)}</span>
            </button>
          ))}
        </div>
      </Modal>

      <Modal
        isOpen={isClearDialogOpen}
        onClose={() => setIsClearDialogOpen(false)}
        title={t('map.clear')}
        titleId="clear-canvas-title"
        panelClassName="max-w-md"
      >
        <div className="flex flex-col gap-2">
          <button
            type="button"
            className="rounded-md bg-gray-700 p-2 text-white hover:bg-gray-600"
            onClick={() => {
              dispatch({ type: 'CLEAR_CANVAS', payload: { floor: currentFloor } });
              setIsClearDialogOpen(false);
            }}
          >
            {t('map.clearFloor')}
          </button>
          <button
            type="button"
            className="rounded-md bg-red-700 p-2 text-white hover:bg-red-600"
            onClick={() => {
              dispatch({ type: 'CLEAR_CANVAS' });
              setIsClearDialogOpen(false);
            }}
          >
            {t('map.clearAll')}
          </button>
          <button
            type="button"
            className="rounded-md bg-gray-700 p-2 text-white hover:bg-gray-600"
            onClick={() => setIsClearDialogOpen(false)}
          >
            {t('common.cancel')}
          </button>
        </div>
      </Modal>

      <Modal
        isOpen={importError !== null}
        onClose={() => setImportError(null)}
        title={t('map.import')}
        titleId="import-error-title"
        panelClassName="max-w-md"
      >
        <p className="mb-4 text-white">{importError}</p>
        <button
          type="button"
          className="w-full rounded-md bg-gray-700 p-2 text-white hover:bg-gray-600"
          onClick={() => setImportError(null)}
        >
          {t('common.close')}
        </button>
      </Modal>

      <OperatorSelector isOpen={isOperatorSelectorOpen} onClose={() => setIsOperatorSelectorOpen(false)} />
    </>
  );
}
