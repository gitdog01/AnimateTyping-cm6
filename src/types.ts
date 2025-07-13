/**
 * Configuration options for the typing animation extension
 */
export interface AnimateTypingOptions {
  /** Duration of the typing animation in milliseconds */
  duration?: number;
  /** Type of animation to use */
  animationType?: 'fadeIn' | 'glow' | 'shootingStar' | 'rollingThunder';
  /** CSS class prefix for animation styles */
  classPrefix?: string;
  /** Whether to animate only newly typed characters */
  onlyNew?: boolean;
} 