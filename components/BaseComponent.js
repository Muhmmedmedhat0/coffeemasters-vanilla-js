const cssCache = new Map();

async function getCssText(path) {
  if (cssCache.has(path)) {
    return cssCache.get(path);
  }

  const request = await fetch(path);
  if (!request.ok) {
    throw new Error(`Failed to load component stylesheet: ${path}`);
  }

  const cssText = await request.text();
  cssCache.set(path, cssText);
  return cssText;
}

export class BaseComponent extends HTMLElement {
  static styles = [];
  static useShadow = true;

  constructor() {
    super();
    this.root =
      this.constructor.useShadow === false
        ? this
        : this.attachShadow({ mode: 'open' });

    this.stylesLoaded = false;
  }

  get stylePaths() {
    const { styles } = this.constructor;

    if (Array.isArray(styles)) {
      return styles;
    }

    return styles ? [styles] : [];
  }

  async connectedCallback() {
    await this.loadStyles();
    await this.rerender();
    this.onConnected();
  }

  disconnectedCallback() {
    this.onDisconnected();
    this.clearContent();
  }

  async loadStyles() {
    if (this.stylesLoaded) {
      return;
    }

    const paths = this.stylePaths;
    if (paths.length === 0) {
      this.stylesLoaded = true;
      return;
    }

    const cssParts = await Promise.all(paths.map((path) => getCssText(path)));
    const style = document.createElement('style');
    style.textContent = cssParts.join('\n');
    this.root.appendChild(style);

    this.stylesLoaded = true;
  }

  clearContent() {
    this.root
      .querySelectorAll(':scope > :not(style)')
      .forEach((node) => node.remove());
  }

  renderTemplate(templateSelector) {
    const template = document.querySelector(templateSelector);
    if (!(template instanceof HTMLTemplateElement)) {
      throw new Error(`Template not found: ${templateSelector}`);
    }

    this.root.appendChild(template.content.cloneNode(true));
  }

  async rerender() {
    if (!this.isConnected) {
      return;
    }

    this.clearContent();
    await this.render();
  }

  onConnected() {}

  onDisconnected() {}

  render() {
    throw new Error(`${this.constructor.name} must implement render().`);
  }
}
