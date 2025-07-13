import { Extension, StateField, StateEffect } from '@codemirror/state';
import { EditorView, Decoration, DecorationSet, ViewPlugin, ViewUpdate } from '@codemirror/view';
import { AnimateTypingOptions } from './types';

/**
 * State effect for adding typing animations
 */
const addTypingAnimation = StateEffect.define<{ from: number; to: number; animationType: string }>();

/**
 * State field to track typing animations
 */
const typingAnimationState = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes);
    
    // Add new animations for effects
    for (const effect of tr.effects) {
      if (effect.is(addTypingAnimation)) {
        const { from, to, animationType } = effect.value;
        const decoration = Decoration.mark({
          class: `animate-typing-${animationType}`,
          attributes: {
            'data-animate-typing': 'true'
          }
        });
        decorations = decorations.update({
          add: [decoration.range(from, to)]
        });
      }
    }
    
    return decorations;
  },
  provide: f => EditorView.decorations.from(f)
});

/**
 * View plugin that handles typing detection and animation triggering
 */
const typingAnimationPlugin = (options: AnimateTypingOptions) => ViewPlugin.fromClass(class {
  constructor(private view: EditorView) {}
  
  update(update: ViewUpdate) {
    if (!update.docChanged) return;
    
    const effects: StateEffect<any>[] = [];
    
    // Detect typing changes
    update.changes.iterChanges((fromA, toA, fromB, toB, inserted) => {
      if (inserted.length > 0) {
        // Only animate if text is being inserted (not replaced)
        if (fromA === toA) {
          effects.push(addTypingAnimation.of({
            from: fromB,
            to: toB,
            animationType: options.animationType || 'fadeIn'
          }));
        }
      }
    });
    
    if (effects.length > 0) {
      // dispatch를 다음 틱에 실행하여 업데이트 중 dispatch 에러 방지
      setTimeout(() => {
        this.view.dispatch({ effects });
      }, 0);
      
      // Remove animations after duration
      setTimeout(() => {
        this.removeAnimations();
      }, options.duration || 500);
    }
  }
  
  private removeAnimations() {
    const decorations = this.view.state.field(typingAnimationState);
    if (decorations.size > 0) {
      // dispatch를 다음 틱에 실행하여 업데이트 중 dispatch 에러 방지
      setTimeout(() => {
        this.view.dispatch({
          effects: StateEffect.appendConfig.of([])
        });
      }, 0);
    }
  }
});

/**
 * Creates the typing animation extension
 */
export function animateTyping(options: AnimateTypingOptions = {}): Extension {
  return [
    typingAnimationState,
    typingAnimationPlugin(options),
    EditorView.baseTheme({
      '.animate-typing-fadeIn': {
        animation: `fadeIn ${options.duration || 500}ms ease-out`
      },
      '.animate-typing-glow': {
        animation: `glow ${options.duration || 500}ms ease-out`
      },
      '.animate-typing-shootingStar': {
        animation: `shootingStar ${options.duration || 500}ms ease-out`,
        position: 'relative'
      },
      '.animate-typing-rollingThunder': {
        animation: `rollingThunder ${options.duration || 500}ms ease-out`,
        display: 'inline-block'
      },
      '.animate-typing-frenchFries': {
        animation: `frenchFries ${options.duration || 500}ms ease-out`,
        display: 'inline-block',
        position: 'relative'
      },
      '@keyframes fadeIn': {
        '0%': { opacity: '0' },
        '100%': { opacity: '1' }
      },
      '@keyframes glow': {
        '0%': { boxShadow: '0 0 0 rgba(255, 255, 255, 0)', opacity: '0' },
        '50%': { boxShadow: '0 0 10px rgba(255, 255, 255, 0.8)' },
        '100%': { boxShadow: '0 0 0 rgba(255, 255, 255, 0)', opacity: '1' }
      },
      '@keyframes shootingStar': {
        '0%': { 
          opacity: '0',
          transform: 'scale(0.8)',
          boxShadow: '0 0 0 rgba(156, 246, 246, 0), 0 0 0 rgba(124, 131, 253, 0), 0 0 0 rgba(255, 93, 162, 0), 0 0 0 rgba(123, 63, 0, 0)'
        },
        '10%': { 
          opacity: '1',
          transform: 'scale(1.2)',
          boxShadow: '0 0 8px rgba(156, 246, 246, 1), 0 0 8px rgba(124, 131, 253, 1), 0 0 8px rgba(255, 93, 162, 1), 0 0 8px rgba(123, 63, 0, 1)'
        },
        '25%': { 
          transform: 'scale(1)',
          boxShadow: '4px -4px 12px rgba(156, 246, 246, 0.9), -4px -4px 12px rgba(124, 131, 253, 0.9), 2px -6px 12px rgba(255, 93, 162, 0.9), -2px -2px 12px rgba(123, 63, 0, 0.9)'
        },
        '40%': { 
          boxShadow: '8px -8px 16px rgba(156, 246, 246, 0.8), -8px -8px 16px rgba(124, 131, 253, 0.8), 4px -12px 16px rgba(255, 93, 162, 0.8), -6px -4px 16px rgba(123, 63, 0, 0.8)'
        },
        '60%': { 
          boxShadow: '14px -14px 24px rgba(156, 246, 246, 0.6), -14px -14px 24px rgba(124, 131, 253, 0.6), 8px -20px 24px rgba(255, 93, 162, 0.6), -12px -8px 24px rgba(123, 63, 0, 0.6)'
        },
        '80%': { 
          boxShadow: '20px -20px 32px rgba(156, 246, 246, 0.3), -20px -20px 32px rgba(124, 131, 253, 0.3), 12px -28px 32px rgba(255, 93, 162, 0.3), -18px -12px 32px rgba(123, 63, 0, 0.3)'
        },
        '100%': { 
          opacity: '1',
          transform: 'scale(1)',
          boxShadow: '0 0 0 rgba(156, 246, 246, 0), 0 0 0 rgba(124, 131, 253, 0), 0 0 0 rgba(255, 93, 162, 0), 0 0 0 rgba(123, 63, 0, 0)'
        }
      },
      '@keyframes rollingThunder': {
        '0%': { 
          transform: 'rotate(0deg)',
          opacity: '0'
        },
        '25%': { 
          transform: 'rotate(90deg)',
          opacity: '0.3'
        },
        '50%': { 
          transform: 'rotate(180deg)',
          opacity: '0.7'
        },
        '75%': { 
          transform: 'rotate(270deg)',
          opacity: '0.9'
        },
        '100%': { 
          transform: 'rotate(360deg)',
          opacity: '1'
        }
      },
      '@keyframes frenchFries': {
        '0%': { 
          opacity: '0',
          transform: 'translateY(0px) rotate(0deg) scale(0.8)',
          boxShadow: '0 0 0 rgba(255, 215, 0, 0), 0 0 0 rgba(255, 165, 0, 0), 0 0 0 rgba(255, 140, 0, 0), 0 0 0 rgba(218, 165, 32, 0), 0 0 0 rgba(255, 193, 37, 0), 0 0 0 rgba(255, 127, 80, 0), 0 0 0 rgba(255, 185, 15, 0), 0 0 0 rgba(255, 160, 122, 0)'
        },
        '15%': { 
          opacity: '1',
          transform: 'translateY(-6px) rotate(30deg) scale(1.2)',
          boxShadow: '3px 3px 0 rgba(255, 215, 0, 1), -3px 3px 0 rgba(255, 165, 0, 1), 0px 6px 0 rgba(255, 140, 0, 1), 2px 2px 0 rgba(218, 165, 32, 1), -2px 4px 0 rgba(255, 193, 37, 1), 1px 5px 0 rgba(255, 127, 80, 1), -1px 3px 0 rgba(255, 185, 15, 1), 3px 4px 0 rgba(255, 160, 122, 1)'
        },
        '30%': { 
          transform: 'translateY(-18px) rotate(75deg) scale(1)',
          boxShadow: '8px 8px 0 rgba(255, 215, 0, 0.9), -8px 8px 0 rgba(255, 165, 0, 0.9), 0px 16px 0 rgba(255, 140, 0, 0.9), 6px 6px 0 rgba(218, 165, 32, 0.9), -6px 12px 0 rgba(255, 193, 37, 0.9), 3px 14px 0 rgba(255, 127, 80, 0.9), -3px 10px 0 rgba(255, 185, 15, 0.9), 9px 11px 0 rgba(255, 160, 122, 0.9)'
        },
        '50%': { 
          transform: 'translateY(-24px) rotate(120deg) scale(1)',
          boxShadow: '16px 16px 0 rgba(255, 215, 0, 0.8), -16px 16px 0 rgba(255, 165, 0, 0.8), 0px 28px 0 rgba(255, 140, 0, 0.8), 12px 12px 0 rgba(218, 165, 32, 0.8), -12px 20px 0 rgba(255, 193, 37, 0.8), 6px 24px 0 rgba(255, 127, 80, 0.8), -6px 18px 0 rgba(255, 185, 15, 0.8), 18px 19px 0 rgba(255, 160, 122, 0.8)'
        },
        '70%': { 
          transform: 'translateY(-16px) rotate(180deg) scale(1)',
          boxShadow: '24px 24px 0 rgba(255, 215, 0, 0.6), -24px 24px 0 rgba(255, 165, 0, 0.6), 0px 36px 0 rgba(255, 140, 0, 0.6), 18px 18px 0 rgba(218, 165, 32, 0.6), -18px 28px 0 rgba(255, 193, 37, 0.6), 9px 32px 0 rgba(255, 127, 80, 0.6), -9px 26px 0 rgba(255, 185, 15, 0.6), 27px 27px 0 rgba(255, 160, 122, 0.6)'
        },
        '85%': { 
          transform: 'translateY(-8px) rotate(225deg) scale(1)',
          boxShadow: '32px 32px 0 rgba(255, 215, 0, 0.4), -32px 32px 0 rgba(255, 165, 0, 0.4), 0px 44px 0 rgba(255, 140, 0, 0.4), 24px 24px 0 rgba(218, 165, 32, 0.4), -24px 36px 0 rgba(255, 193, 37, 0.4), 12px 40px 0 rgba(255, 127, 80, 0.4), -12px 34px 0 rgba(255, 185, 15, 0.4), 36px 35px 0 rgba(255, 160, 122, 0.4)'
        },
        '100%': { 
          opacity: '1',
          transform: 'translateY(0px) rotate(270deg) scale(1)',
          boxShadow: '0 0 0 rgba(255, 215, 0, 0), 0 0 0 rgba(255, 165, 0, 0), 0 0 0 rgba(255, 140, 0, 0), 0 0 0 rgba(218, 165, 32, 0), 0 0 0 rgba(255, 193, 37, 0), 0 0 0 rgba(255, 127, 80, 0), 0 0 0 rgba(255, 185, 15, 0), 0 0 0 rgba(255, 160, 122, 0)'
        }
      }
    })
  ];
} 