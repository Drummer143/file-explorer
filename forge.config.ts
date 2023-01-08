import type { ForgeConfig } from '@electron-forge/shared-types';
import { MakerSquirrel } from '@electron-forge/maker-squirrel';
import { MakerZIP } from '@electron-forge/maker-zip';
import { MakerDeb } from '@electron-forge/maker-deb';
import { MakerRpm } from '@electron-forge/maker-rpm';
import { WebpackPlugin } from '@electron-forge/plugin-webpack';

import { mainConfig } from './webpack.main.config';
import { rendererConfig } from './webpack.renderer.config';

const config: ForgeConfig = {
    packagerConfig: {},
    rebuildConfig: {},
    makers: [
        new MakerSquirrel({}),
        new MakerZIP({}, ['darwin']),
        new MakerRpm({}),
        new MakerDeb({})
    ],
    plugins: [
        new WebpackPlugin({
            mainConfig,
            devContentSecurityPolicy: "default-src 'unsafe-inline'; img-src file://*; connect-src 'self'; script-src 'self' 'unsafe-eval'; font-src 'self' fonts.gstatic.com; style-src 'self' fonts.googleapis.com 'unsafe-inline'; style-src-elem 'self' fonts.googleapis.com 'unsafe-inline'",

            renderer: {
                config: rendererConfig,
                entryPoints: [
                    {
                        html: './public/index.html',
                        js: './src/electron/renderer.ts',
                        name: 'main_window',
                        preload: {
                            js: './src/electron/preload.ts'
                        }
                    }
                ]
            }
        })
    ]
};

export default config;
