import { FileFormat1 as FileFormat } from '@sketch-hq/sketch-file-format-ts';
// @ts-ignore
import DOM from 'sketch/dom';
import { toSJSON } from '../sketchJson/toSJSON';

import { LayoutInfo } from '../../types';

export function makeSvgLayer(_layout: LayoutInfo, name: string, svg: string): FileFormat.Group {
  const svgString = NSString.stringWithString(svg);
  const svgData = svgString.dataUsingEncoding(NSUTF8StringEncoding);
  const svgImporter = MSSVGImporter.svgImporter();
  svgImporter.prepareToImportFromData(svgData);
  const svgNativeLayer = svgImporter.importAsLayer();
  const svgLayer = DOM.Group.fromNative(svgNativeLayer).layers[0];

  const frame = NSMakeRect(0, 0, svgLayer.frame.width, svgLayer.frame.height);
  const root = MSLayerGroup.alloc().initWithFrame(frame);
  root.name = name;

  svgImporter.graph().makeLayerWithParentLayer_progress(root, null);
  root.ungroupSingleChildDescendentGroups();
  svgImporter.scale_rootGroup(svgImporter.importer().scaleValue(), root);

  return toSJSON(root) as FileFormat.Group;
}
