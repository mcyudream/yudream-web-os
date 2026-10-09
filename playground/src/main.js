import { builtinApps } from '@yudream/yudream-webos-apps';
import { arcoAdapter } from '@yudream/yudream-webos-arco';
import { createWebOS } from '@yudream/yudream-webos-vue';
import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';
import 'virtual:uno.css';
import './styles.css';
const app = createApp(App);
app.use(createPinia());
app.use(createWebOS({
    ui: arcoAdapter,
    apps: builtinApps,
    persist: { adapter: 'localstorage', prefix: 'playground' },
    desktop: { arrangeMode: 'grid', collision: 'swap' },
    dock: { position: 'bottom', magnification: true },
    widgets: { placement: 'sidebar' },
    menubar: { showControlCenter: true, showClock: true },
    windows: { snapToEdge: true, sessionRestore: true },
    // 四级覆盖④：配置级 —— 覆盖内置应用
    overrides: {
        finder: { name: '访达' },
    },
}));
app.mount('#app');
