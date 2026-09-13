import type { PlanMode } from '../types/models';

export type RootStackParamList = {
  Splash: undefined;
  Onboarding: undefined;
  Auth: undefined;
  Main: undefined;
  CreateChoice: undefined;
  RoomSetup: { mode: PlanMode };
  JoinRoom: { mode: PlanMode };
  Create: { memoryId: string; mode: PlanMode; roomId?: string };
  FlipReveal: { memoryId: string };
  RevealCeremony: { memoryId: string; roomId: string };
};

export type MainDrawerParamList = {
  Choice: undefined;
  Calendar: undefined;
  Scrapbook: undefined;
  Gallery: undefined;
  Settings: undefined;
  Profile: undefined;
};
