import { Howl } from "howler";

export type SoundType = "hover" | "click" | "transition";

const SOUND_URLS: Record<SoundType, string> = {
  hover:
    "https://assets.mixkit.co/active_storage/sfx/913/913-preview.mp3",
  click:
    "https://assets.mixkit.co/active_storage/sfx/902/902-preview.mp3",
  transition:
    "https://assets.mixkit.co/active_storage/sfx/3114/3114-preview.mp3",
};

const SOUND_VOLUMES: Record<SoundType, number> = {
  hover: 0.2,
  click: 0.25,
  transition: 0.15,
};

let audioUnlocked = false;
let gateInitialized = false;

function isMobileViewport(): boolean {
  if (typeof window === "undefined") return true;
  return window.innerWidth < 768;
}

function initSoundGate(): void {
  if (gateInitialized || typeof window === "undefined") return;
  gateInitialized = true;

  const unlock = () => {
    audioUnlocked = true;
  };

  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

const sounds: Record<SoundType, Howl> = {
  hover: new Howl({ src: [SOUND_URLS.hover], volume: SOUND_VOLUMES.hover }),
  click: new Howl({ src: [SOUND_URLS.click], volume: SOUND_VOLUMES.click }),
  transition: new Howl({
    src: [SOUND_URLS.transition],
    volume: SOUND_VOLUMES.transition,
  }),
};

export function playSound(type: SoundType): void {
  initSoundGate();

  if (!audioUnlocked || isMobileViewport()) return;

  sounds[type].stop();
  sounds[type].play();
}

export function getSoundUrls(): Record<SoundType, string> {
  return { ...SOUND_URLS };
}
