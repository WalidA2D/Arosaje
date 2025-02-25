import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { StyleSheet, Pressable, useColorScheme } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Colors } from '@/constants/Colors';
export function Collapsible({ children, title }) {
    var _a;
    const [isOpen, setIsOpen] = useState(false);
    const theme = (_a = useColorScheme()) !== null && _a !== void 0 ? _a : 'light';
    return (<ThemedView>
      <Pressable style={styles.heading} onPress={() => setIsOpen((value) => !value)} 
    // @ts-ignore
    activeOpacity={0.8}>
        <Ionicons name={isOpen ? 'chevron-down' : 'chevron-forward-outline'} size={18} color={theme === 'light' ? Colors.light.icon : Colors.dark.icon}/>
        <ThemedText type="defaultSemiBold">{title}</ThemedText>
      </Pressable>
      {isOpen && <ThemedView style={styles.content}>{children}</ThemedView>}
    </ThemedView>);
}
const styles = StyleSheet.create({
    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    content: {
        marginTop: 6,
        marginLeft: 24,
    },
});
