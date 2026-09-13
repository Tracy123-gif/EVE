import {
  useFonts as useJostFonts,
  Jost_400Regular,
  Jost_500Medium,
  Jost_600SemiBold,
  Jost_700Bold,
} from '@expo-google-fonts/jost';
import { Caveat_400Regular, Caveat_700Bold } from '@expo-google-fonts/caveat';

export function useAppFonts() {
  return useJostFonts({
    Jost_400Regular,
    Jost_500Medium,
    Jost_600SemiBold,
    Jost_700Bold,
    Caveat_400Regular,
    Caveat_700Bold,
  });
}
