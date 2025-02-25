/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */
import { useColorScheme } from 'react-native';
import { Colors } from '@/constants/Colors';
export function useThemeColor(props, colorName) {
    var _a;
    const theme = (_a = useColorScheme()) !== null && _a !== void 0 ? _a : 'light';
    const colorFromProps = props[theme];
    if (colorFromProps) {
        return colorFromProps;
    }
    else {
        return Colors[theme][colorName];
    }
}
