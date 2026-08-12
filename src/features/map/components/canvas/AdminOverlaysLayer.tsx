import { useLayoutEffect, useRef, useState } from 'react';
import { Rect, Text as KonvaText } from 'react-konva';
import type Konva from 'konva';
import { useTranslation } from 'react-i18next';
import {
  CALLOUT_BACKGROUND,
  CALLOUT_PADDING,
  CALLOUT_TEXT_FILL,
  DEFAULT_ICON_SIZE,
  DEFAULT_TEXT_FONT_SIZE,
} from '../../config/canvasConstants';
import type { AdminMapConfig, CalloutConfig, MapIconConfig } from '../../types';
import { LegendIcon } from './LegendIcon';

interface AdminOverlaysLayerProps {
  adminConfig: AdminMapConfig | null;
  currentFloor: number;
  mapId: string | null;
  stageScale: number;
}

function CalloutLabel({
  callout,
  text,
  stageScale,
}: {
  callout: CalloutConfig;
  text: string;
  stageScale: number;
}) {
  const textRef = useRef<Konva.Text>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });
  const fontSize = DEFAULT_TEXT_FONT_SIZE / stageScale;
  const padding = CALLOUT_PADDING / stageScale;

  useLayoutEffect(() => {
    const node = textRef.current;
    if (!node) {
      return;
    }
    const width = node.width();
    const height = node.height();
    setSize((current) => (current.width === width && current.height === height ? current : { width, height }));
  }, [text, fontSize, padding]);

  return (
    <>
      <Rect
        x={callout.x}
        y={callout.y}
        width={size.width}
        height={size.height}
        fill={CALLOUT_BACKGROUND}
        cornerRadius={2}
        listening={false}
      />
      <KonvaText
        ref={textRef}
        x={callout.x}
        y={callout.y}
        text={text}
        fontSize={fontSize}
        fill={CALLOUT_TEXT_FILL}
        padding={padding}
        align="center"
        verticalAlign="middle"
        listening={false}
      />
    </>
  );
}

function AdminLegendIcon({ icon }: { icon: MapIconConfig }) {
  const stableId = `admin-${icon.legendId}-${icon.x}-${icon.y}`;
  return (
    <LegendIcon
      element={{
        id: stableId,
        type: 'legendIcon',
        x: icon.x,
        y: icon.y,
        legendId: icon.legendId,
        width: DEFAULT_ICON_SIZE,
        height: DEFAULT_ICON_SIZE,
      }}
      draggable={false}
      listening={false}
    />
  );
}

export function AdminOverlaysLayer({
  adminConfig,
  currentFloor,
  mapId,
  stageScale,
}: AdminOverlaysLayerProps) {
  const { t } = useTranslation();
  const floorConfig = adminConfig?.floors.find((floor) => floor.floorNumber === currentFloor);

  if (!floorConfig) {
    return null;
  }

  return (
    <>
      {floorConfig.callouts?.map((callout) => (
        <CalloutLabel
          key={`callout-${callout.nameKey}-${callout.x}-${callout.y}`}
          callout={callout}
          text={t(`mapCallouts.${mapId}.${callout.nameKey}`)}
          stageScale={stageScale}
        />
      ))}
      {floorConfig.icons?.map((icon) => (
        <AdminLegendIcon key={`icon-${icon.legendId}-${icon.x}-${icon.y}`} icon={icon} />
      ))}
    </>
  );
}
