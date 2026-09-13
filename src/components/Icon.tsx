import React from 'react';
import type { SvgProps } from 'react-native-svg';

import Asset from '../../assets/icons/asset.svg';
import Back from '../../assets/icons/back.svg';
import Background from '../../assets/icons/background.svg';
import Calendar from '../../assets/icons/calendar.svg';
import Camera from '../../assets/icons/camera.svg';
import CheckboxChecked from '../../assets/icons/checkbox-checked.svg';
import CheckboxUnchecked from '../../assets/icons/checkbox-unchecked.svg';
import Close from '../../assets/icons/close.svg';
import Delete from '../../assets/icons/delete.svg';
import Gallery from '../../assets/icons/gallery.svg';
import Menu from '../../assets/icons/menu.svg';
import Music from '../../assets/icons/music.svg';
import Profile from '../../assets/icons/profile.svg';
import Redo from '../../assets/icons/redo.svg';
import Scrapbook from '../../assets/icons/scrapbook.svg';
import Settings from '../../assets/icons/settings.svg';
import Share from '../../assets/icons/share.svg';
import Text from '../../assets/icons/text.svg';
import Undo from '../../assets/icons/undo.svg';
import Upload from '../../assets/icons/upload.svg';

export const icons = {
  asset: Asset,
  back: Back,
  background: Background,
  calendar: Calendar,
  camera: Camera,
  'checkbox-checked': CheckboxChecked,
  'checkbox-unchecked': CheckboxUnchecked,
  close: Close,
  delete: Delete,
  gallery: Gallery,
  menu: Menu,
  music: Music,
  profile: Profile,
  redo: Redo,
  scrapbook: Scrapbook,
  settings: Settings,
  share: Share,
  text: Text,
  undo: Undo,
  upload: Upload,
} as const;

export type IconName = keyof typeof icons;

type IconProps = SvgProps & {
  name: IconName;
  size?: number;
};

export function Icon({ name, size = 24, ...props }: IconProps) {
  const Component = icons[name];
  return <Component width={size} height={size} {...props} />;
}
