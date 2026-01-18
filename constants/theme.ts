/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#0a7ea4';
const tintColorDark = '#fff';

export const Colors = {
  light: {
    text: '#11181C',
    background: '#fff',
    tint: tintColorLight,
    icon: '#687076',
    tabIconDefault: '#687076',
    tabIconSelected: tintColorLight,
  },
  dark: {
    text: '#ECEDEE',
    background: '#151718',
    tint: tintColorDark,
    icon: '#9BA1A6',
    tabIconDefault: '#9BA1A6',
    tabIconSelected: tintColorDark,
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

export const AppFonts = {
  cabinetGroteskBlack: 'CabinetGrotesk-Black',
  cabinetGroteskBold: 'CabinetGrotesk-Bold',
  cabinetGroteskExtraBold: 'CabinetGrotesk-Extrabold',
  cabinetGroteskExtraLight: 'CabinetGrotesk-Extralight',
  cabinetGroteskLight: 'CabinetGrotesk-Light',
  cabinetGroteskMedium: 'CabinetGrotesk-Medium',
  cabinetGroteskRegular: 'CabinetGrotesk-Regular',
  cabinetGroteskThin: 'CabinetGrotesk-Thin',
  rubikBlack: 'Rubik-Black',
  rubikBlackItalic: 'Rubik-BlackItalic',
  rubikBold: 'Rubik-Bold',
  rubikBoldItalic: 'Rubik-BoldItalic',
  rubikExtraBold: 'Rubik-ExtraBold',
  rubikExtraBoldItalic: 'Rubik-ExtraBoldItalic',
  rubikItalic: 'Rubik-Italic',
  rubikLight: 'Rubik-Light',
  rubikLightItalic: 'Rubik-LightItalic',
  rubikMedium: 'Rubik-Medium',
  rubikMediumItalic: 'Rubik-MediumItalic',
  rubikRegular: 'Rubik-Regular',
  rubikRegularItalic: 'Rubik-RegularItalic',
  rubikSemiBold: 'Rubik-SemiBold',
  rubikSemiBoldItalic: 'Rubik-SemiBoldItalic',
  sfProTextRegular: 'SFProText-Regular',
};

export const CardShadow = {
  shadowColor: '#303773',
  shadowOpacity: 0.15,
  shadowRadius: 15,
  shadowOffset: { width: 0, height: 2 },
  elevation: 6,
};

export const ErrorTextStyle = {
  fontSize: 18,
  color: '#0E0940',
  textAlign: 'center',
  fontFamily: AppFonts.rubikMedium,
};
