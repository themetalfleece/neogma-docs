import { getRenderer } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/transport/renderer.js';
import { initJssCs } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/transport/setup-jss.js';initJssCs();
import { installTheme } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/content/theme.ts';installTheme();
import { codeSelection } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/components/code/selection.js';codeSelection();
import { sameLineLengthInCodes } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/components/code/same-line-length.js';sameLineLengthInCodes();
import { initHintBox } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/components/code/line-hint/index.js';initHintBox();
import { initCodeLineRef } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/components/code/line-ref/index.js';initCodeLineRef();
import { initSmartCopy } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/components/code/smart-copy.js';initSmartCopy();
import { copyHeadings } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/components/heading/copy-headings.js';copyHeadings();
import { contentNavHighlight } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/components/page/contentnav/highlight.js';contentNavHighlight();
import { loadDeferredIFrames } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/transport/deferred-iframe.js';loadDeferredIFrames();
import { smoothLoading } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/transport/smooth-loading.js';smoothLoading();
import { tocHighlight } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/components/page/toc/toc-highlight.js';tocHighlight();
import { postNavSearch } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/components/page/toc/search/post-nav/index.js';postNavSearch();
import { reloadOnChange } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/serve/reload.js';reloadOnChange();
import { ToCPrevNext } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/components/page/toc/prevnext/index.js';
import { CollapseControl } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/components/collapse/collapse-control.js';
import { GithubSearch } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/components/misc/github/search.js';
import { ToCToggle } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/components/page/toc/toggle/index.js';
import { DarkModeSwitch } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/components/darkmode/index.js';
import { ConfigTransport } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/transport/config.js';
import { TabSelector } from 'C:/Users/jason/Documents/Projects/thesis/neogma-docs/.codedoc/node_modules/@codedoc/core/dist/es5/components/tabs/selector.js';

const components = {
  'cqyP4A4AWwlyqCNUmmWLBQ==': ToCPrevNext,
  '50selNXobUoeYBXeQKyIDg==': CollapseControl,
  'YB5mYFpoUSnaPnp9jzLt3Q==': GithubSearch,
  'Gzg+XsTInFW0CrIHgtmZZg==': ToCToggle,
  'Z1Qm7ycUatInlLwa4Isp8A==': DarkModeSwitch,
  'qOPKsZYSSX8JKLOr6FQU3Q==': ConfigTransport,
  'hUH2ZKs1lx+ia2CCedFdmg==': TabSelector
};

const renderer = getRenderer();
const ogtransport = window.__sdh_transport;
window.__sdh_transport = function(id, hash, props) {
  if (hash in components) {
    const target = document.getElementById(id);
    renderer.render(renderer.create(components[hash], props)).after(target);
    target.remove();
  }
  else if (ogtransport) ogtransport(id, hash, props);
}
