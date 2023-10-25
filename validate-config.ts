import { App } from 'electron';
import fs from 'fs';
import path from 'path';

export function validateConfig(app: App) {
  const configPath = path.join(app.getPath('userData'), 'config.json');
  fs.readFile(configPath, 'utf8', (err, walletConfigText) => {
    if (err) return;
    try {
      JSON.parse(walletConfigText);
    } catch (e) {
      const now = new Date().toISOString();
      const corruptFilePath = path.join(
        app.getPath('userData'),
        `corrupt-wallet-backup-${now}.txt`
      );
      fs.writeFile(corruptFilePath, walletConfigText, err => {
        if (err) return;
      });
    }
  });
}
