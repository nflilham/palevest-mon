import { UIManager } from './ui/uiManager.js';
import { GameEngine } from './game/gameEngine.js';
import { sound } from './game/audio.js';

document.addEventListener('DOMContentLoaded', () => {
  const root = document.getElementById('app');
  const ui = new UIManager(root);
  const game = new GameEngine(ui);

  ui.bindGame(game);
  ui.setCallbacks({
    game,
    getGameState: () => game.getStateSnapshot(),
    onEnterGame: ({ save, authState }) => {
      game.start(save, authState);
    },
    onExitGame: () => {
      game.stop();
    },
    onSelectHotbar: (slotIndex) => {
      game.selectHotbarSlot(slotIndex);
    },
    onFastTravel: (tx, ty) => {
      game.teleportPlayer(tx, ty);
    },
    onMobileInput: (action, dir) => {
      game.handleMobileInput(action, dir);
    },
    onToggleSound: () => sound.toggleMute(),
  });
});
