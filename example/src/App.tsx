import { useState, useCallback, useMemo, useEffect, useRef } from 'react'
import { EditorView, keymap, lineNumbers, drawSelection } from '@codemirror/view'
import { EditorState, StateEffect } from '@codemirror/state'
import { defaultKeymap } from '@codemirror/commands'
import { javascript } from '@codemirror/lang-javascript'
import { python } from '@codemirror/lang-python'
import { json } from '@codemirror/lang-json'
import { oneDark } from '@codemirror/theme-one-dark'
import { animateTyping, AnimateTypingOptions } from 'animate-typing-cm6'

interface Language {
  name: string
  value: string
  extension: any
}

const languages: Language[] = [
  { name: 'JavaScript', value: 'javascript', extension: javascript() },
  { name: 'Python', value: 'python', extension: python() },
  { name: 'JSON', value: 'json', extension: json() },
]

const animationTypes: AnimateTypingOptions['animationType'][] = [
  'fadeIn',
  'glow',
  'shootingStar',
  'rollingThunder'
]



function App() {
  const [code, setCode] = useState('// Start typing here to see animations!\n// Try different animation types.\n\n')
  const [animationType, setAnimationType] = useState<AnimateTypingOptions['animationType']>('fadeIn')
  const [duration, setDuration] = useState(500)
  const [language, setLanguage] = useState('javascript')
  const editorRef = useRef<HTMLDivElement>(null)
  const viewRef = useRef<EditorView | null>(null)

  const animationOptions: AnimateTypingOptions = useMemo(() => ({
    animationType,
    duration,
  }), [animationType, duration])

  const selectedLanguage = languages.find(lang => lang.value === language) || languages[0]

  const extensions = useMemo(() => [
    lineNumbers(),
    drawSelection(),
    keymap.of(defaultKeymap),
    selectedLanguage.extension,
    animateTyping(animationOptions),
    oneDark,
  ], [selectedLanguage.extension, animationOptions])

  useEffect(() => {
    if (editorRef.current) {
      // 기존 view 제거
      if (viewRef.current) {
        viewRef.current.destroy()
      }

      // 새 view 생성
      const state = EditorState.create({
        doc: code,
        extensions,
      })

      viewRef.current = new EditorView({
        state,
        parent: editorRef.current,
      })

      // 상태 변경 리스너 추가
      const updateListener = EditorView.updateListener.of((update) => {
        if (update.docChanged) {
          const newDoc = update.state.doc.toString()
          setCode(newDoc)
        }
      })

      viewRef.current.dispatch({
        effects: StateEffect.appendConfig.of([updateListener])
      })
    }

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy()
      }
    }
  }, [extensions])

  useEffect(() => {
    if (viewRef.current && viewRef.current.state.doc.toString() !== code) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: code,
        },
      })
    }
  }, [code])

  const handleLanguageChange = useCallback((newLanguage: string) => {
    setLanguage(newLanguage)
  }, [])

  return (
    <div className="App">
      <div className="container">
        <h1>🎯 AnimateTyping CM6 Playground</h1>
        
        <div className="info-panel">
          <h3>How to use</h3>
          <p>
            Start typing in the editor to see the animation effects.
            Use the controls below to test different animation options.
          </p>
          <p>
            <strong>Animation Types:</strong>
          </p>
          <ul>
            <li><code>fadeIn</code>: Gradually appears</li>
            <li><code>glow</code>: Glows in</li>
            <li><code>shootingStar</code>: Colorful particle effects</li>
            <li><code>rollingThunder</code>: Fast rotation</li>
          </ul>
        </div>

        <div className="controls">
          <div className="control-group">
            <label htmlFor="language">Language</label>
            <select 
              id="language"
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
            >
              {languages.map(lang => (
                <option key={lang.value} value={lang.value}>{lang.name}</option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="animationType">Animation Type</label>
            <select 
              id="animationType"
              value={animationType}
              onChange={(e) => setAnimationType(e.target.value as AnimateTypingOptions['animationType'])}
            >
              {animationTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="duration">Duration (ms)</label>
            <input 
              id="duration"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              min="100"
              max="2000"
              step="100"
            />
          </div>
        </div>

        <div className="editor-container">
          <div ref={editorRef} style={{ minHeight: '300px' }} />
        </div>
      </div>
    </div>
  )
}

export default App 