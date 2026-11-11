import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { ResourcesBand } from '../src/components/InfoSections.jsx';
import { LangProvider } from '../src/i18n/LangContext.jsx';
import { STRINGS } from '../src/i18n/strings.js';
import { ToolsProvider } from '../src/state/ToolsContext.jsx';

describe('figure resources', () => {
  it.each(['zh', 'en'])('links to both viewers and opens video playback in a modal in %s', (lang) => {
    const html = renderToStaticMarkup(
      createElement(LangProvider, { initialLang: lang },
        createElement(ToolsProvider, null, createElement(ResourcesBand))),
    );
    for (const path of ['OSBs', 'BCP/3d-bubbles-viewer']) {
      expect(html).toContain(`href="https://nadc.china-vo.org/data/dustmaps/${path}" target="_blank" rel="noopener noreferrer"`);
    }
    for (const name of lang === 'zh'
      ? ['开放超泡交互式展示', '空泡捕手计划DR1交互式展示']
      : ['Open Superbubbles · Interactive Viewer', 'Bubble Catcher Project DR1 · Interactive Viewer']) {
      expect(html).toContain(name);
    }
    const gallery = STRINGS[lang].resources[2];
    const movie = gallery.items.find((item) => item.open === 'video');
    const button = html.match(/<button\b[^>]*>[\s\S]*?<\/button>/g).find((element) => element.includes(movie.name));
    expect(button).toBeDefined();
    expect(html).not.toContain('<video');
    expect(html).not.toContain('dust-flythrough.mp4');
    expect(html).toContain(STRINGS[lang].resources[2].items[0].name);
  });
});
