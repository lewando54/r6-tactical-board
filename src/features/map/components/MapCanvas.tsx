import React, { useRef, useEffect, useState, useCallback, ComponentProps } from 'react';
import { Stage, Layer, Image as KonvaImage, Circle, Arrow as KonvaArrow, Text as KonvaText, Line as KonvaLine } from 'react-konva';
import Konva from 'konva'; // Importuj Konva dla typów
import { KonvaEventObject } from 'konva/lib/Node'; // Typ dla eventów Konva
import useImage from 'use-image';
import { useMapState, useMapDispatch } from '../contexts/MapStateContext';
import { MapElement, OperatorElement, AdminMapConfig, CalloutConfig, Tool } from '../types'; // Importuj typy

// Definicja typów propsów dla MapCanvas
interface MapCanvasProps {
  mapImageUrl: string;
  currentFloor: number;
  adminConfig: AdminMapConfig | null;
}

const svgStringToImage = (svgString: string | undefined | null, width: number, height: number): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
      // --- Early validation ---
      if (typeof svgString !== 'string' || svgString.trim() === '') {
          console.error("svgStringToImage called with invalid or empty svgString input.");
          // Reject with a specific error message
          reject(new Error('Invalid or empty SVG string provided'));
          return; // Stop execution
      }
      // --- End validation ---


      // 1. Create a data URL from the SVG string
      // Encode potentially problematic characters like #
      const encodedSVG = encodeURIComponent(svgString)
                          .replace(/'/g, '%27')
                          .replace(/"/g, '%22');
      const dataUrl = `data:image/svg+xml;charset=utf-8,${encodedSVG}`;

      // 2. Create an HTML Image element
      const img = new Image();
      img.crossOrigin = 'anonymous'; // Might be needed depending on SVG content/server

      img.onload = () => {
          // Check if dimensions are valid
           if (img.naturalWidth > 0 && img.naturalHeight > 0) {
               resolve(img);
           } else {
               // Sometimes onload fires too early for SVG data URLs? Add a small delay as fallback.
                setTimeout(() => {
                    if (img.naturalWidth > 0 && img.naturalHeight > 0) {
                        resolve(img);
                    } else {
                       // Use the validated svgString here for logging if needed
                       console.error("SVG loaded but has zero dimensions:", typeof svgString === 'string' ? svgString.substring(0, 100) : "[Original SVG Input Invalid]");
                       reject(new Error('SVG failed to load with valid dimensions'));
                    }
                }, 50); // 50ms delay fallback
           }
      };

      img.onerror = (error) => {
          // --- Add check here ---
          const svgSnippet = typeof svgString === 'string' ? svgString.substring(0, 100) : "[Original SVG Input Invalid]";
          console.error("Error loading SVG data URL:", error, svgSnippet);
          // --- End check ---
          reject(error);
      };

      // 3. Set the source to the data URL
      img.src = dataUrl;
      // Optional: Explicitly set dimensions (might help some browsers)
      img.width = width;
      img.height = height;
  });
};

// Helper do renderowania ikon operatorów z useImage wewnątrz mapowania
const OperatorIcon: React.FC<{ element: OperatorElement, commonProps: ComponentProps<typeof KonvaImage> }> = ({ element, commonProps }) => {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(null);
  const [error, setError] = useState<boolean>(false);
  const isMountedRef = useRef(true); // Ref to track mount status

  useEffect(() => {
      isMountedRef.current = true; // Component did mount
      let active = true; // Flag to handle race conditions if element changes quickly

      setImageElement(null); // Reset on element change
      setError(false);

      // Extract desired dimensions (use defaults if needed)
      const targetWidth = element.width || 30;
      const targetHeight = element.height || 30;

      svgStringToImage(element.iconSVG, targetWidth, targetHeight)
          .then(img => {
              // Only update state if the component is still mounted and this effect call is still active
              if (isMountedRef.current && active) {
                  setImageElement(img);
              }
          })
          .catch(err => {
              if (isMountedRef.current && active) {
                  console.error(`Failed to render SVG for operator ${element.operatorId}:`, err);
                  setError(true);
              }
          });

      // Cleanup function
      return () => {
          isMountedRef.current = false; // Component will unmount
          active = false; // Deactivate this effect call
      };
  }, [element.iconSVG, element.operatorId, element.width, element.height]); // Depend on SVG string and dimensions

  // Render Konva.Image only when the imageElement is ready
  if (error) {
       // Optionally render a placeholder on error
       return <Circle 
                radius={commonProps.width ? commonProps.width / 2 : 15} 
                fill="red" 
                x={element.x}
                y={element.y}
              />;
  }

  if (!imageElement) {
      // Optionally render a loading state or placeholder
      return <Circle 
                radius={commonProps.width ? commonProps.width / 2 : 15} 
                fill="gray" 
                x={element.x}
                y={element.y}
              />;
  }

  // Note: commonProps might include scaleX/Y for zoom. Ensure width/height are adjusted correctly.
  return <KonvaImage
              {...commonProps}
              image={imageElement}
              x={element.x}
              y={element.y}
              width={element.width || 30}
              height={element.height || 30}
              offsetX={(element.width || 30)/2} // Center based on original size
              offsetY={(element.height || 30)/2}
              scaleX={1} // Usuwamy odziedziczone skalowanie - używamy bezpośrednio width/height
              scaleY={1}
          />;
};

const MapCanvas: React.FC<MapCanvasProps> = ({ mapImageUrl, currentFloor, adminConfig }) => {
  // Typowanie refów
  const stageRef = useRef<Konva.Stage>(null);
  const drawLayerRef = useRef<Konva.Layer>(null); // Warstwa użytkownika
  const previewLayerRef = useRef<Konva.Layer>(null); // Warstwa podglądu

  const [mapImage] = useImage(mapImageUrl); // useImage zwraca [Image | undefined, string]
  const mapState = useMapState();
  const dispatch = useMapDispatch();
  
  // Pobierz elementy tylko dla aktualnego piętra
  const currentFloorElements = mapState.elementsByFloor[currentFloor] || [];
  
  const { currentTool, selectedColor, selectedOperator, stageState } = mapState;

  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  // Typowanie stanu dla punktów rysowania
  const [drawingPoints, setDrawingPoints] = useState<number[]>([]);
  const [canvasSize, setCanvasSize] = useState<{ width: number; height: number }>({ width: 500, height: 500 }); // Domyślny rozmiar

  // Efekt do ustawiania rozmiaru canvasa
  useEffect(() => {
    const container = stageRef.current?.container()?.parentElement;
    if (!container) return;

    const handleResize = () => {
       setCanvasSize({ width: container.offsetWidth, height: container.offsetHeight });
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);
    handleResize(); // Ustaw rozmiar początkowy

    return () => resizeObserver.disconnect();
  }, []); // Pusta tablica zależności, bo container jest stały po zamontowaniu

  // --- Obsługa Panning & Zooming ---
  const handleWheel = useCallback((e: KonvaEventObject<WheelEvent>) => { // Typ eventu Konva
      e.evt.preventDefault();
      const stage = stageRef.current;
      if (!stage) return;

      const scaleBy = 1.05; // Mniejszy krok dla płynności
      const oldScale = stage.scaleX();
      const pointer = stage.getPointerPosition();

      if (!pointer) return; // Pointer może być null

      const mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale,
          y: (pointer.y - stage.y()) / oldScale,
      };

      const direction = e.evt.deltaY > 0 ? -1 : 1;
      let newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

      // Ograniczenie zoomu
      const minScale = 0.1;
      const maxScale = 10.0; // Zwiększony max zoom
      newScale = Math.max(minScale, Math.min(maxScale, newScale));

      const newPos = {
           x: pointer.x - mousePointTo.x * newScale,
           y: pointer.y - mousePointTo.y * newScale,
      };

      dispatch({ type: 'SET_STAGE_STATE', payload: { scale: newScale, x: newPos.x, y: newPos.y } });

  }, [dispatch]);

   const handleDragEnd = useCallback((e: KonvaEventObject<DragEvent>) => {
        const target = e.target;
        if (target === stageRef.current) { // Przesuwanie całej sceny
             dispatch({ type: 'SET_STAGE_STATE', payload: { x: target.x(), y: target.y() } });
        } else { // Przesuwanie konkretnego elementu
            const id = target.id(); // ID powinno być liczbą zgodnie z typem MapElement
            const elementId = parseInt(id, 10); // Konwertuj ID string na number

            if (!isNaN(elementId)) {
                const newPos = { x: target.x(), y: target.y() };
                // Znajdź element, aby upewnić się, że aktualizujemy właściwe pola
                const elementToUpdate = currentFloorElements.find(el => el.id === elementId);

                if (elementToUpdate) {
                    let updates: Partial<MapElement> = {};
                     // Wszystkie elementy z x/y mogą być przesuwane - obsługujemy wszystkie typy
                     if ('x' in elementToUpdate && 'y' in elementToUpdate) {
                         updates = { x: newPos.x, y: newPos.y };
                         dispatch({ 
                            type: 'UPDATE_ELEMENT', 
                            payload: { 
                                floor: currentFloor,
                                id: elementId, 
                                updates 
                            } 
                         });
                    }
                }
            } else {
                console.warn("Dragged element has invalid or missing ID:", id);
            }
        }
    }, [dispatch, currentFloorElements, currentFloor]);


  // --- Obsługa kliknięć i rysowania ---
  const getRelativePointerPosition = useCallback((stage: Konva.Stage | null): { x: number; y: number } | null => {
        if (!stage) return null;
        const pointerPos = stage.getPointerPosition();
        if (!pointerPos) return null;
        const transform = stage.getAbsoluteTransform().copy();
        transform.invert();
        return transform.point(pointerPos);
  }, []); // Pusta tablica, bo funkcja zależy tylko od argumentu


  const handleMouseDown = useCallback((e: KonvaEventObject<MouseEvent>) => {
     // Rozpocznij tylko jeśli kliknięto bezpośrednio na Stage (tło mapy)
     if (e.target !== stageRef.current) return;

     const stage = stageRef.current;
     const pos = getRelativePointerPosition(stage);
     if (!pos) return;

     // Sprawdź, czy narzędzie wymaga rozpoczęcia rysowania
      const toolsRequiringDrawStart: Tool[] = ['arrow', 'draw', 'erase'];
      if (toolsRequiringDrawStart.includes(currentTool)) {
          setIsDrawing(true);
      }


     switch (currentTool) {
        case 'tempMarker':
             // Logika tymczasowego znacznika (nie zapisujemy w stanie globalnym)
             // Można dodać element do warstwy podglądu i usunąć go np. w mouseup/kolejnym click
             console.log("Add temp marker at", pos);
             // Np. narysuj coś w previewLayerRef
             break;
        case 'permMarker':
             dispatch({ 
                type: 'ADD_ELEMENT', 
                payload: { 
                    floor: currentFloor,
                    element: { 
                        id: 0, 
                        type: 'permMarker', 
                        x: pos.x, 
                        y: pos.y, 
                        radius: 5 * (1 / stageState.scale), 
                        fill: selectedColor 
                    }
                } 
             });
             break;
        case 'operator':
           if (selectedOperator) {
                // Ustawiamy szerokość i wysokość ikony operatora
                const opWidth = 30 * (1 / stageState.scale);
                const opHeight = 30 * (1 / stageState.scale);
                // Dodajemy element operatora z dokładną pozycją kursora
                dispatch({ 
                    type: 'ADD_ELEMENT', 
                    payload: { 
                        floor: currentFloor,
                        element: { 
                            id: 0, 
                            type: 'operator', 
                            x: pos.x, 
                            y: pos.y, 
                            operatorId: selectedOperator.id, 
                            icon: selectedOperator.icon, 
                            iconSVG: selectedOperator.icon, 
                            width: opWidth, 
                            height: opHeight 
                        } 
                    }
                });
           }
           break;
       case 'arrow':
       case 'draw':
            setDrawingPoints([pos.x, pos.y]); // Rozpocznij linię/strzałkę
            break;
       case 'text': { // Użyj bloku dla zmiennej text
           // Użyj lepszego modala zamiast prompt w realnej aplikacji
            const text = window.prompt("Enter text:");
            if (text) {
                dispatch({ 
                    type: 'ADD_ELEMENT', 
                    payload: { 
                        floor: currentFloor,
                        element: { 
                            id: 0, 
                            type: 'text', 
                            x: pos.x, 
                            y: pos.y, 
                            text: text, 
                            fill: selectedColor, 
                            fontSize: 16 * (1 / stageState.scale) 
                        }
                    }
                });
            }
            break;
        }
       case 'erase':
           // Rozpocznij "rysowanie" gumką
            setDrawingPoints([pos.x, pos.y]);
           break;
         case 'select':
             // Nic nie rób na mousedown na stage
            break;
     }
  }, [currentTool, dispatch, getRelativePointerPosition, selectedColor, selectedOperator, stageState.scale, currentFloor]);

  const handleMouseMove = useCallback(() => {
    if (!isDrawing) return;

    const stage = stageRef.current;
    const pos = getRelativePointerPosition(stage);
    if (!pos) return;

    switch (currentTool) {
       case 'draw':
       case 'erase': // Gumka działa jak rysowanie specjalną linią
           setDrawingPoints(prev => [...prev, pos.x, pos.y]);
           // Rysuj linię podglądu w previewLayerRef
           break;
        case 'arrow':
            // Aktualizuj tylko ostatnie dwa punkty (końcówkę strzałki)
            setDrawingPoints(prev => [prev[0], prev[1], pos.x, pos.y]);
             // Rysuj podgląd strzałki w previewLayerRef
            break;
        // Inne narzędzia mogą nie potrzebować obsługi w mouseMove
    }
     // Wymuś odświeżenie warstwy podglądu
     previewLayerRef.current?.batchDraw();

  }, [isDrawing, currentTool, getRelativePointerPosition]);

  const handleMouseUp = useCallback(() => {
    if (!isDrawing) return;
     setIsDrawing(false);

     const stage = stageRef.current;
     if (!stage) return;
     // Pozycja nie jest potrzebna w mouseUp dla tych narzędzi

     switch (currentTool) {
       case 'draw':
         if (drawingPoints.length >= 4) { // Potrzebujemy przynajmniej 2 punktów (x, y, x, y)
            dispatch({ 
                type: 'ADD_ELEMENT', 
                payload: { 
                    floor: currentFloor,
                    element: { 
                        id: 0, 
                        type: 'drawing', 
                        // Zapisujemy oryginalne punkty bez skalowania
                        points: drawingPoints, 
                        stroke: selectedColor, 
                        strokeWidth: 2 * (1 / stageState.scale) 
                    }
                } 
            });
         }
         break;
       case 'arrow':
          if (drawingPoints.length === 4) {
               // Upewnij się, że start i end point nie są zbyt blisko
               const [x1, y1, x2, y2] = drawingPoints;
               const dx = x2 - x1;
               const dy = y2 - y1;
               if (Math.sqrt(dx*dx + dy*dy) > 5) { // Minimalna długość strzałki
                   dispatch({ 
                       type: 'ADD_ELEMENT', 
                       payload: { 
                           floor: currentFloor,
                           element: { 
                               id: 0, 
                               type: 'arrow', 
                               // Zapisujemy oryginalne punkty bez skalowania
                               points: drawingPoints, 
                               stroke: selectedColor, 
                               fill: selectedColor, 
                               strokeWidth: 3 * (1 / stageState.scale), 
                               pointerLength: 10 * (1 / stageState.scale), 
                               pointerWidth: 10 * (1 / stageState.scale) 
                           }
                       } 
                   });
               }
          }
          break;
        case 'erase':
             if (drawingPoints.length >= 4) {
                 // Dodaj linię gumki (specjalny typ lub właściwość)
                  dispatch({ 
                      type: 'ADD_ELEMENT', 
                      payload: {
                          floor: currentFloor,
                          element: {
                              id: 0,
                              type: 'drawing', // Można stworzyć dedykowany typ 'eraserLine'
                              // Zapisujemy oryginalne punkty bez skalowania
                              points: drawingPoints,
                              stroke: '#ffffff', // Kolor gumki (bez znaczenia przy destination-out)
                              strokeWidth: 10 * (1 / stageState.scale), // Szerokość gumki
                              globalCompositeOperation: 'destination-out', // Kluczowy efekt gumki
                              // Dodatkowe właściwości dla gumki
                              lineCap: 'round',
                              lineJoin: 'round',
                          }
                      } 
                  });
             }
            break;
     }
     setDrawingPoints([]); // Wyczyść punkty rysowania
      // Wyczyść warstwę podglądu
      previewLayerRef.current?.destroyChildren(); // Usuń wszystkie dzieci
      previewLayerRef.current?.batchDraw();
  }, [isDrawing, currentTool, drawingPoints, dispatch, selectedColor, stageState.scale, currentFloor]);


  const handleElementClick = useCallback((e: KonvaEventObject<MouseEvent | TouchEvent>, element: MapElement) => {
      e.evt.stopPropagation(); // Zatrzymaj propagację, aby nie wywołać handleMouseDown na stage
      console.log("Clicked element:", element);

       if (currentTool === 'select') {
           // Logika zaznaczania - można dodać Konva.Transformer
            console.log("Selected:", element.id);
           // dispatch({ type: 'SET_SELECTED_ELEMENT', payload: element.id });
       } else if (currentTool === 'erase') { // Usuwanie pojedynczym kliknięciem
            dispatch({ 
                type: 'REMOVE_ELEMENT', 
                payload: { 
                    floor: currentFloor, 
                    id: element.id 
                } 
            });
       }
       // Można dodać usuwanie na prawy przycisk:
       // if (e.evt.button === 2) {
       //    e.evt.preventDefault(); // Zapobiegaj menu kontekstowemu
       //    dispatch({ type: 'REMOVE_ELEMENT', payload: { floor: currentFloor, id: element.id } });
       // }

  }, [currentTool, dispatch, currentFloor]);

  // Funkcja do transformacji punktów zgodnie z aktualną skalą
  const transformPoints = useCallback((points: number[]): number[] => {
    // Nie transformujemy, jeśli nie ma punktów
    if (!points || points.length < 2) {
      return points;
    }

    // Tworzymy nową tablicę punktów, nie modyfikując oryginalnej
    // Punkty nie wymagają skalowania, ponieważ są już w koordynatach świata
    return [...points];
  }, []);

  // Renderowanie elementów użytkownika
  const renderElements = useCallback(() => {
    return currentFloorElements.map(el => {
      const elementIdStr = String(el.id);
      const isDraggable = currentTool === 'select';

      // --- Define props WITHOUT the key initially ---
      const baseProps = {
        // key: elementIdStr, // <<< REMOVE KEY FROM HERE
        id: elementIdStr, // Konva oczekuje string ID
        draggable: isDraggable,
        onDragEnd: handleDragEnd,
        onClick: (e: KonvaEventObject<MouseEvent>) => handleElementClick(e, el),
        onTap: (e: KonvaEventObject<TouchEvent>) => handleElementClick(e, el),
        shadowColor: 'black',
        shadowBlur: isDraggable ? 5 : 2,
        shadowOpacity: 0.5,
        shadowOffsetX: 1 / stageState.scale,
        shadowOffsetY: 1 / stageState.scale,
        strokeWidth: 2 * (1 / stageState.scale),
        radius: 5 * (1 / stageState.scale),
        fontSize: 16 * (1 / stageState.scale),
        pointerWidth: 10 * (1 / stageState.scale),
        pointerLength: 10 * (1 / stageState.scale),
        image: undefined,
      };
      // --- End baseProps definition ---

      // Dostosuj propsy w zależności od typu elementu
      const specificProps = { ...baseProps }; // Clone base props
      if ('strokeWidth' in el) specificProps.strokeWidth = el.strokeWidth * (1 / stageState.scale);
      if ('radius' in el) specificProps.radius = el.radius * (1 / stageState.scale);
      if ('fontSize' in el) specificProps.fontSize = el.fontSize * (1 / stageState.scale);
      if ('pointerLength' in el) specificProps.pointerLength = el.pointerLength * (1 / stageState.scale);
      if ('pointerWidth' in el) specificProps.pointerWidth = el.pointerWidth * (1 / stageState.scale);
      // Przesunięcie tekstu/ikony, aby skalowanie było względem środka
      if (el.type === 'text') {
          // You might need to adjust text offset based on alignment needs
          // Konva's offsetX/Y for text often relates to its bounding box
          // specificProps.offsetX = ...
          // specificProps.offsetY = ...
      }

      switch (el.type) {
        case 'permMarker':
          return <Circle
                    key={elementIdStr} // <<< Apply key directly
                    {...specificProps}
                    x={el.x}
                    y={el.y}
                    scaleX={1}  // Usuń skalowanie dla markerów - użyjemy radius
                    scaleY={1}
                    // radius and fill are handled by specificProps or defaults in baseProps
                    fill={el.fill}
                 />;
        case 'operator':
             // Pass specificProps (which no longer contains 'key')
             // The OperatorIcon component will spread these onto KonvaImage
             return <OperatorIcon
                       key={elementIdStr} // <<< Apply key directly
                       element={el}
                       commonProps={specificProps} // Pass the props object (without key)
                    />;
        case 'arrow':
          // Używamy transformacji punktów dla strzałek
          return <KonvaArrow
                    key={elementIdStr}
                    {...specificProps}
                    points={transformPoints(el.points)}
                    stroke={el.stroke}
                    fill={el.fill}
                    scaleX={1}
                    scaleY={1}
                  />;
        case 'text':
          return <KonvaText
                    key={elementIdStr}
                    {...specificProps}
                    x={el.x}
                    y={el.y}
                    text={el.text}
                    fill={el.fill}
                    scaleX={1}
                    scaleY={1}
                    align="center"
                    verticalAlign="middle"
                 />;
        case 'drawing':
            // Używamy transformacji punktów dla rysunków
            return <KonvaLine
                      key={elementIdStr}
                      {...specificProps}
                      points={transformPoints(el.points)}
                      stroke={el.stroke}
                      scaleX={1}
                      scaleY={1}
                      tension={el.tension ?? 0.5}
                      lineCap={el.lineCap ?? "round"}
                      lineJoin={el.lineJoin ?? "round"}
                      globalCompositeOperation={el.globalCompositeOperation as GlobalCompositeOperation}
                   />;
        default:
             console.warn("Unknown element type:", el);
          return null;
      }
    });
  }, [currentFloorElements, currentTool, handleDragEnd, handleElementClick, stageState.scale, transformPoints]);

   // Renderowanie podglądu podczas rysowania
   const renderPreviewElements = useCallback(() => {
        if (!isDrawing || drawingPoints.length < 2) return null; // Potrzebujemy przynajmniej punktu startowego

        const previewProps = {
            stroke: selectedColor,
            strokeWidth: (currentTool === 'erase' ? 10 : (currentTool === 'arrow' ? 3 : 2)) * (1 / stageState.scale),
            dash: [5 * (1 / stageState.scale), 5 * (1 / stageState.scale)], // Skalowane przerwy
            listening: false, // Podgląd nie powinien być interaktywny
            // Usuń skalowanie - będziemy bezpośrednio używać punktów
            scaleX: 1,
            scaleY: 1,
        };

         if (currentTool === 'arrow' && drawingPoints.length === 4) {
             // Transformujemy punkty dla podglądu strzałki
             return <KonvaArrow 
                    {...previewProps} 
                    points={transformPoints(drawingPoints)} 
                    fill={selectedColor} 
                    pointerLength={10 * (1 / stageState.scale)} 
                    pointerWidth={10 * (1 / stageState.scale)} 
                    />;
         }
         if ((currentTool === 'draw' || currentTool === 'erase') && drawingPoints.length >= 2) {
             // Dla gumki można użyć innego koloru lub stylu podglądu
             const eraserPreviewProps = currentTool === 'erase' ? 
                { ...previewProps, stroke: 'rgba(255, 0, 0, 0.5)' } : 
                previewProps;
            // Transformujemy punkty dla podglądu rysunku
            return <KonvaLine 
                    {...eraserPreviewProps} 
                    points={transformPoints(drawingPoints)} 
                    tension={0.5} 
                    lineCap="round" 
                    lineJoin="round" 
                    />;
         }
        return null;
   }, [isDrawing, drawingPoints, currentTool, selectedColor, stageState.scale, transformPoints]);

   // Renderowanie nakładek admina (Calloutów)
   const renderAdminOverlays = useCallback(() => {
        if (!adminConfig?.floors || adminConfig.floors.length === 0 || adminConfig.floors[currentFloor].callouts === undefined) {
            return null;
        }
        // TODO: Zintegrować t() z react-i18next tutaj, jeśli to możliwe
        // Może wymagać przekazania t jako prop lub użycia hooka w komponencie wyższego rzędu
        return adminConfig.floors[currentFloor].callouts.map((callout: CalloutConfig, index: number) => (
             <KonvaText
                key={`callout-${index}-${callout.nameKey}`} // Lepszy klucz
                x={callout.x}
                y={callout.y}
                text={callout.nameKey} // Na razie wyświetlamy klucz
                fontSize={12 * (1 / stageState.scale)} // Skalowanie tekstu
                fill="rgba(255, 255, 255, 0.8)"
                listening={false}
                scaleX={1 / stageState.scale} // Zastosuj skalowanie, aby tekst pozostał tej samej wielkości
                scaleY={1 / stageState.scale}
                shadowColor="black"
                shadowBlur={2}
                shadowOpacity={0.7}
             />
        ));
   }, [adminConfig, currentFloor, stageState.scale]);

   // Ustawienie kursora myszy w zależności od narzędzia
   const getCursorStyle = (): string => {
        switch (currentTool) {
            case 'select': return 'grab'; // Zmieni się na 'grabbing' podczas przeciągania stage
            case 'erase': return 'cell'; // Lub inny wskazujący na gumkę
            case 'text': return 'text';
            case 'draw':
            case 'arrow':
            case 'permMarker':
            case 'tempMarker':
            case 'operator':
                 return 'crosshair';
            default: return 'default';
        }
   };


  return (
    <Stage
      ref={stageRef}
      width={canvasSize.width}
      height={canvasSize.height}
      draggable={currentTool === 'select'}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDragStart={(e) => { // Zmień kursor na 'grabbing' podczas przeciągania sceny
          if (e.target === stageRef.current) {
                const container = stageRef.current?.container();
                if (container) container.style.cursor = 'grabbing';
          }
      }}
      onDragEnd={(e) => { // Przywróć kursor po przeciąganiu sceny
           handleDragEnd(e); // Wywołaj oryginalny handler
           const container = stageRef.current?.container();
           if (container) container.style.cursor = getCursorStyle(); // Ustaw z powrotem na podstawie narzędzia
      }}
      scaleX={stageState.scale}
      scaleY={stageState.scale}
      x={stageState.x}
      y={stageState.y}
      style={{ cursor: getCursorStyle() }} // Ustaw styl kursora dla kontenera stage
    >
      {/* Warstwa Tła Mapy */}
      <Layer listening={false}>
        {mapImage && (
          <KonvaImage
            image={mapImage}
            width={mapImage.width}
            height={mapImage.height}
          />
        )}
      </Layer>

      {/* Warstwa Nakładek Admina */}
      <Layer listening={false}>
         {renderAdminOverlays()}
      </Layer>

      {/* Warstwa Rysowania Użytkownika */}
      <Layer ref={drawLayerRef}>
        {renderElements()}
      </Layer>

      {/* Warstwa Podglądu Rysowania */}
       <Layer ref={previewLayerRef} listening={false}>
           {renderPreviewElements()}
       </Layer>

    </Stage>
  );
}

export default MapCanvas;