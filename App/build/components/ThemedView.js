var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { View } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';
export function ThemedView(_a) {
    var { style, lightColor, darkColor } = _a, otherProps = __rest(_a, ["style", "lightColor", "darkColor"]);
    const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
    return <View style={[{ backgroundColor }, style]} {...otherProps}/>;
}
