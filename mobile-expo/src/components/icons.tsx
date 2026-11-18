import type { ComponentType } from 'react';
import Svg, { Path } from 'react-native-svg';
import {
  ArrowLeft as ArrowLeftIcon,
  ArrowRight as ArrowRightIcon,
  Bell as BellIcon,
  BookOpen as BookOpenIcon,
  Check as CheckIcon,
  CircleCheck as CircleCheckIcon,
  Clock3 as Clock3Icon,
  Compass as CompassIcon,
  Flame as FlameIcon,
  Gem as GemIcon,
  GraduationCap as GraduationCapIcon,
  Heart as HeartIcon,
  Lock as LockIcon,
  Moon as MoonIcon,
  MoonStar as MoonStarIcon,
  RotateCcw as RotateCcwIcon,
  ShieldCheck as ShieldCheckIcon,
  Sparkles as SparklesIcon,
  Sprout as SproutIcon,
  Sun as SunIcon,
  UserRound as UserRoundIcon,
  X as XIcon,
} from 'lucide-react-native';

type IconProps = { size?: number; color?: string; fill?: string; strokeWidth?: number };

function glyph(Icon: ComponentType<IconProps>, filled = false) {
  return function AppIcon({ size = 22, color = '#1E1B4B', fill, strokeWidth = 2.25 }: IconProps) {
    const paint = fill ?? (filled ? color : 'none');
    return <Icon size={size} color={color} fill={paint === 'transparent' ? 'none' : paint} strokeWidth={strokeWidth} />;
  };
}

export const BookOpen = glyph(BookOpenIcon);
export const Flame = glyph(FlameIcon, true);
export const Heart = glyph(HeartIcon, true);
export const Sparkles = glyph(SparklesIcon);
export const Gem = glyph(GemIcon, true);
export const Moon = glyph(MoonIcon);
export const Sun = glyph(SunIcon);
export const Compass = glyph(CompassIcon);
export const Sprout = glyph(SproutIcon);
export const GraduationCap = glyph(GraduationCapIcon);
export const MoonStar = glyph(MoonStarIcon);
export const Clock3 = glyph(Clock3Icon);
export const Check = glyph(CheckIcon);
export const ArrowRight = glyph(ArrowRightIcon);
export const ArrowLeft = glyph(ArrowLeftIcon);
export const Lock = glyph(LockIcon);
export const RotateCcw = glyph(RotateCcwIcon);
export const UserRound = glyph(UserRoundIcon);
export const Bell = glyph(BellIcon);
export const ShieldCheck = glyph(ShieldCheckIcon);
export const CheckCircle2 = glyph(CircleCheckIcon, true);
export const X = glyph(XIcon);

function Mark({ size = 22, color = '#1E1B4B', d }: IconProps & { d: string }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path fill={color} fillRule="evenodd" d={d} />
    </Svg>
  );
}

export function BookBible(props: IconProps) {
  return <Mark {...props} d="M4.2 4.4A2.4 2.4 0 0 1 6.6 2h8.7A3.7 3.7 0 0 1 19 5.7v13.6c0 .8-.9 1.3-1.6.8-1.1-.6-2.4-.9-3.7-.9H6.5A2.3 2.3 0 0 1 4.2 16.9V4.4zm3.1 2.8h1.5v2.2h2.2V11H8.8v2.2H7.3V11H5.1V9.4h2.2V7.2z" />;
}

export function BookQuran(props: IconProps) {
  return <Mark {...props} d="M4.2 4.4A2.4 2.4 0 0 1 6.6 2h8.7A3.7 3.7 0 0 1 19 5.7v13.6c0 .8-.9 1.3-1.6.8-1.1-.6-2.4-.9-3.7-.9H6.5A2.3 2.3 0 0 1 4.2 16.9V4.4zm6.3 2.2a3.6 3.6 0 0 1 2.7 6 3.2 3.2 0 0 0-1.3-.3 3.3 3.3 0 0 0 0 6.6c.5 0 .9-.1 1.3-.3a3.6 3.6 0 0 1-2.7-6 3.2 3.2 0 0 0 1.3.3 3.3 3.3 0 0 0 0-6.6c-.4 0-.9.1-1.3.3z" />;
}

export function HandsPraying(props: IconProps) {
  return <Mark {...props} d="M12 3.2c.5 0 .9.4.9.9v4.2l1.6-1.5c.4-.4 1-.4 1.4 0l.2.2c.4.4.4 1 0 1.4L13.6 11l2.3 2.1c.4.4.4 1 .1 1.4l-.2.2a1 1 0 0 1-1.4 0L12.4 13v5.2c0 .8-.7 1.6-1.6 1.6h-.1c-.9 0-1.6-.7-1.6-1.6V13L7.2 14.7a1 1 0 0 1-1.4 0l-.2-.2a1 1 0 0 1 .1-1.4L8 11 5.5 8.4a1 1 0 0 1 0-1.4l.2-.2c.4-.4 1-.4 1.4 0l1.6 1.5V4.1c0-.5.4-.9.9-.9H12z" />;
}
