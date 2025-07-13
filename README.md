# AnimateTyping-cm6 🎯

[![npm version](https://img.shields.io/npm/v/animate-typing-cm6.svg)](https://www.npmjs.com/package/animate-typing-cm6)
[![npm downloads](https://img.shields.io/npm/dm/animate-typing-cm6.svg)](https://www.npmjs.com/package/animate-typing-cm6)
[![license](https://img.shields.io/npm/l/animate-typing-cm6.svg)](https://github.com/gitdog01/AnimateTyping-cm6/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/gitdog01/AnimateTyping-cm6.svg)](https://github.com/gitdog01/AnimateTyping-cm6)

![demo_1](https://github.com/user-attachments/assets/706d451b-e9cc-4ddd-bd4c-30dd241ef978)

![demo_2](https://github.com/user-attachments/assets/99358b52-85fd-4c1d-8762-3183c68d3c91)


A CodeMirror 6 extension that adds beautiful typing animations to enhance the coding experience.

## Features

- 🎨 **Multiple Animation Types**: Choose from fadeIn, glow, shootingStar, rollingThunder, frenchFries, and bubble effects
- ⚡ **Lightweight**: Minimal performance impact
- 🔧 **Configurable**: Customize animation duration and style
- 🎯 **Smart Detection**: Only animates newly typed characters
- 📱 **Responsive**: Works on all screen sizes

## Installation

```bash
npm install animate-typing-cm6
```

## Links

### 📦 NPM Package
- **Package Name**: `animate-typing-cm6`
- **NPM URL**: https://www.npmjs.com/package/animate-typing-cm6
- **Installation Command**: `npm install animate-typing-cm6`

### 🔗 GitHub Repository
- **GitHub URL**: https://github.com/gitdog01/AnimateTyping-cm6
- **Issues**: https://github.com/gitdog01/AnimateTyping-cm6/issues
- **Pull Requests**: https://github.com/gitdog01/AnimateTyping-cm6/pulls

## Quick Start

```typescript
import { EditorView, basicSetup } from 'codemirror';
import { animateTyping } from 'animate-typing-cm6';

const editor = new EditorView({
  doc: 'Start typing here!',
  extensions: [
    basicSetup,
    animateTyping({
      animationType: 'fadeIn',
      duration: 500
    })
  ],
  parent: document.getElementById('editor')
});
```

## Configuration Options

```typescript
interface AnimateTypingOptions {
  /** Duration of the typing animation in milliseconds (default: 500) */
  duration?: number;
  
  /** Type of animation to use (default: 'fadeIn') */
  animationType?: 'fadeIn' | 'glow' | 'shootingStar' | 'rollingThunder' | 'frenchFries' | 'bubble';
  
  /** CSS class prefix for animation styles (default: 'animate-typing') */
  classPrefix?: string;
  
  /** Whether to animate only newly typed characters (default: true) */
  onlyNew?: boolean;
}
```

## Animation Types

### fadeIn
Smoothly fades in newly typed characters.

### glow
Characters appear with a glowing effect.

### shootingStar
Characters appear with colorful particle effects like shooting star ice cream.

### rollingThunder
Characters appear with fast rotation animation.

### frenchFries
Characters appear with golden rectangular particles rotating and flying out like french fries.

### bubble
Characters appear with soap bubble effects floating upward with gentle swaying motion.

## Examples

### Basic Usage
```typescript
import { animateTyping } from 'animate-typing-cm6';

// Simple fade animation
const extensions = [
  basicSetup,
  animateTyping()
];
```

### Custom Configuration
```typescript
// Bubble animation with custom duration
const extensions = [
  basicSetup,
  animateTyping({
    animationType: 'bubble',
    duration: 800
  })
];
```

### Multiple Editors
```typescript
// Different animations for different editors
const codeEditor = new EditorView({
  extensions: [
    basicSetup,
    animateTyping({ animationType: 'bubble' })
  ],
  parent: document.getElementById('code-editor')
});

const notesEditor = new EditorView({
  extensions: [
    basicSetup,
    animateTyping({ animationType: 'frenchFries', duration: 300 })
  ],
  parent: document.getElementById('notes-editor')
});
```

## Demo

### Running the Example

To run the demo from the example directory:

```bash
# Clone the project
git clone https://github.com/gitdog01/AnimateTyping-cm6.git
cd AnimateTyping-cm6

# Install main package dependencies and build
npm install
npm run build

# Navigate to example directory and install dependencies
cd example
npm install

# Start development server
npm run dev
```

Or run everything at once from the root directory:

```bash
npm run example
```

Open your browser and navigate to `http://localhost:5173` to see the plugin in action!

## Development

```bash
# Clone the repository
git clone https://github.com/gitdog01/AnimateTyping-cm6.git
cd AnimateTyping-cm6

# Install dependencies
npm install

# Build the project
npm run build

# Watch for changes during development
npm run dev
```

## API Reference

### `animateTyping(options?: AnimateTypingOptions): Extension`

Creates a CodeMirror 6 extension that adds typing animations.

**Parameters:**
- `options` - Configuration object for the animation behavior

**Returns:**
- CodeMirror 6 Extension that can be added to the editor

## Browser Support

This plugin supports all modern browsers that support CodeMirror 6:
- Chrome 63+
- Firefox 67+
- Safari 13+
- Edge 79+

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - see the [LICENSE](LICENSE) file for details.

