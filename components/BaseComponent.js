const cssCache = new Map();

// Returns the text contents of a CSS file
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

// Base class for all components to extend, providing common functionality for loading styles and rendering templates
export class BaseComponent extends HTMLElement {
  static styles = [];

  constructor() {
    super();
    // create a shadow root for encapsulation and style isolation
    this.root = this.attachShadow({ mode: 'open' });
    this.stylesLoaded = false;
  }
  // returns an array of paths to CSS files defined in the static styles property of the component class, which can be a single string or an array of strings
  get stylePaths() {
    const styles = this.constructor.styles;

    if (Array.isArray(styles)) {
      return styles;
    }

    return styles ? [styles] : [];
  }
  // loads the styles defined in the static styles property of the component class and clears the content of the component's shadow root before rendering the template, and also sets a flag to indicate that the styles have been loaded to avoid redundant loading in future renders, and also throws an error if the render method is not implemented by the subclass
  async connectedCallback() {
    await this.loadStyles();
    this.clearContent();
    this.render();
  }

  // clears the content of the component's shadow root and sets a flag to indicate that the styles have not been loaded yet, so that they will be reloaded when the component is reconnected to the DOM, and also removes any event listeners or other resources that may have been attached to the component to prevent memory leaks and ensure proper cleanup when the component is removed from the DOM
  disconnectedCallback() {
    this.root.innerHTML = '';
    this.stylesLoaded = false;
  }
  // loads the styles defined in the static styles property of the component class by fetching the CSS files and appending them to the component's shadow root, and also caches the CSS text to avoid redundant network requests for the same styles in future renders, and also handles errors that may occur during the loading process and logs them to the console for debugging purposes
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
  // clears the content of the component's shadow root by removing all child nodes except for any <style> elements that may be present to preserve the loaded styles, and also ensures that any event listeners or other resources attached to the component are properly cleaned up to prevent memory leaks and ensure optimal performance when the component is re-rendered or removed from the DOM, and also provides a clean slate for rendering the component's template without any leftover content from previous renders that may cause visual glitches or unexpected behavior in the UI. This method is typically called before rendering the component's template to ensure that the component's shadow root is in a consistent state and ready to receive new <content className=""></content>
  clearContent() {
    this.root
      .querySelectorAll(':scope > :not(style)')
      .forEach((node) => node.remove());
  }
  // loads the template defined in the static template property of the component class and appends it to the component's shadow root, and also throws an error if the template is not found in the document or if the render method is not implemented by the subclass, and also provides a convenient way for subclasses to render their templates without having to manually manipulate the DOM or handle errors related to missing templates, and also ensures that the component's shadow root is properly updated with the new content whenever the render method is called, allowing for dynamic updates to the component's UI based on changes in state or props. This method is typically called within the render method of the subclass to render the component's template after any necessary data processing or state updates have been performed.
  renderTemplate(templateSelector) {
    const template = document.querySelector(templateSelector);
    if (!template) {
      throw new Error(`Template not found: ${templateSelector}`);
    }

    const clone = template.content.cloneNode(true);
    this.root.appendChild(clone);
  }

  // throws an error if the render method is not implemented by the subclass to enforce that all subclasses of BaseComponent must provide their own implementation of the render method to define how the component should be rendered, and also serves as a reminder for developers to implement the render method when creating new components that extend BaseComponent, ensuring that the component's UI is properly defined and rendered when the component is used in the application. This method is typically overridden by subclasses to provide the specific rendering logic for each component, allowing for flexibility and customization in how different components are displayed in the UI while still adhering to a common structure and behavior defined by the BaseComponent class.
  render() {
    throw new Error(`${this.constructor.name} must implement render().`);
  }
}
