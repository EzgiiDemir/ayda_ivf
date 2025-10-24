'use client'

import React, { useEffect, useRef, useState } from 'react'
import DOMPurify from 'dompurify'

interface RawEditorProps {
    content?: string
    onChange?: (html: string) => void
    placeholder?: string
    className?: string
}

export default function RawEditor({
                                      content = '',
                                      onChange,
                                      placeholder = 'İçeriğinizi buraya yazın...',
                                      className = ''
                                  }: RawEditorProps) {
    const editorRef = useRef<HTMLDivElement | null>(null)
    const isUpdatingRef = useRef(false)
    const [isPurifyReady, setIsPurifyReady] = useState(false)
    const [html, setHtml] = useState<string>('')

    const [foreColor, setForeColor] = useState('#000000')
    const [backColor, setBackColor] = useState('#FFFF00')
    const [fontSize, setFontSize] = useState('16')
    const [showColorPicker, setShowColorPicker] = useState(false)
    const [showBgColorPicker, setShowBgColorPicker] = useState(false)

    useEffect(() => {
        if (typeof window !== 'undefined') setIsPurifyReady(true)
    }, [])

    const sanitizeConfig = {
        ALLOWED_TAGS: [
            'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'ul', 'ol', 'li',
            'a', 'img',
            'blockquote', 'code', 'pre',
            'span', 'div', 'font',
            'table', 'thead', 'tbody', 'tr', 'th', 'td',
            'mark', 'small', 'sub', 'sup', 'hr'
        ],
        ALLOWED_ATTR: [
            'style', 'class', 'id',
            'href', 'target', 'rel',
            'src', 'alt', 'width', 'height',
            'align', 'valign',
            'colspan', 'rowspan',
            'color', 'size', 'face',
            'data-*'
        ],
        KEEP_CONTENT: true,
        ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
    } as DOMPurify.Config

    const sanitizeToString = (dirty: string) => {
        const res = DOMPurify.sanitize(dirty, sanitizeConfig)
        return typeof res === 'string' ? res : String(res)
    }

    const emitChange = (newHtml: string) => {
        setHtml(newHtml)
        if (onChange) onChange(newHtml)
    }

    useEffect(() => {
        if (!isPurifyReady) return
        if (content && editorRef.current && !isUpdatingRef.current) {
            const sanitized = sanitizeToString(content)
            if ((editorRef.current.innerHTML ?? '') !== sanitized) {
                editorRef.current.innerHTML = sanitized
                setHtml(sanitized)
            }
        }
    }, [content, isPurifyReady])

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        if (!isPurifyReady) return
        isUpdatingRef.current = true
        const rawHtml = e.currentTarget.innerHTML
        const clean = sanitizeToString(rawHtml)
        emitChange(clean)
        setTimeout(() => { isUpdatingRef.current = false }, 0)
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault()
        if (!isPurifyReady || !editorRef.current) return

        let pasted = e.clipboardData.getData('text/html')
        if (!pasted) {
            pasted = e.clipboardData.getData('text/plain')
            pasted = pasted
                .split('\n')
                .map(line => line.trim() ? `<p>${escapeHtml(line)}</p>` : '<br>')
                .join('')
        }

        const clean = sanitizeToString(pasted)

        const sel = window.getSelection()
        if (!sel?.rangeCount) return
        const range = sel.getRangeAt(0)
        range.deleteContents()
        const frag = range.createContextualFragment(clean)
        range.insertNode(frag)

        range.collapse(false)
        sel.removeAllRanges()
        sel.addRange(range)

        handleInput({ currentTarget: editorRef.current } as any)
    }

    const exec = (cmd: string, value?: string) => {
        try {
            document.execCommand(cmd, false, value)
            editorRef.current?.focus()
        } catch (err) {
            console.warn('execCommand failed', err)
        }
    }

    const applyForeColor = (color: string) => {
        const sel = window.getSelection()
        if (!sel || sel.rangeCount === 0) return

        const range = sel.getRangeAt(0)
        if (range.collapsed) return

        const span = document.createElement('span')
        span.style.color = color

        try {
            const contents = range.extractContents()
            span.appendChild(contents)
            range.insertNode(span)

            range.selectNodeContents(span)
            sel.removeAllRanges()
            sel.addRange(range)

            setForeColor(color)
            setShowColorPicker(false)

            if (editorRef.current) {
                handleInput({ currentTarget: editorRef.current } as any)
            }
        } catch (err) {
            console.warn('Color apply failed', err)
        }
    }

    const applyBackColor = (color: string) => {
        const sel = window.getSelection()
        if (!sel || sel.rangeCount === 0) return

        const range = sel.getRangeAt(0)
        if (range.collapsed) return

        const span = document.createElement('span')
        span.style.backgroundColor = color

        try {
            const contents = range.extractContents()
            span.appendChild(contents)
            range.insertNode(span)

            range.selectNodeContents(span)
            sel.removeAllRanges()
            sel.addRange(range)

            setBackColor(color)
            setShowBgColorPicker(false)

            if (editorRef.current) {
                handleInput({ currentTarget: editorRef.current } as any)
            }
        } catch (err) {
            console.warn('Background color apply failed', err)
        }
    }

    const insertLink = () => {
        const url = prompt("Bağlantı URL'si (https://...)")
        if (!url) return
        exec('createLink', url)
        setTimeout(() => {
            if (editorRef.current) {
                handleInput({ currentTarget: editorRef.current } as any)
            }
        }, 0)
    }

    const insertImage = () => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = 'image/*'

        input.onchange = (e) => {
            const file = (e.target as HTMLInputElement).files?.[0]
            if (!file) return

            if (file.size > 5 * 1024 * 1024) {
                alert('Resim boyutu 5MB\'dan küçük olmalıdır!')
                return
            }

            const reader = new FileReader()
            reader.onload = (event) => {
                const base64 = event.target?.result as string

                // Resmi ekle
                const img = document.createElement('img')
                img.src = base64
                img.style.maxWidth = '100%'
                img.style.height = 'auto'
                img.style.display = 'block'
                img.style.margin = '0.5rem 0'
                img.style.borderRadius = '4px'

                const sel = window.getSelection()
                if (sel && sel.rangeCount > 0) {
                    const range = sel.getRangeAt(0)
                    range.insertNode(img)
                    range.collapse(false)
                } else if (editorRef.current) {
                    editorRef.current.appendChild(img)
                }

                setTimeout(() => {
                    if (editorRef.current) {
                        handleInput({ currentTarget: editorRef.current } as any)
                    }
                }, 0)
            }

            reader.readAsDataURL(file)
        }

        input.click()
    }

    const setHeading = (tag: string) => {
        exec('formatBlock', tag)
        setTimeout(() => {
            if (editorRef.current) {
                handleInput({ currentTarget: editorRef.current } as any)
            }
        }, 0)
    }

    const setFontSizeCustom = (sizePx: string) => {
        const sel = window.getSelection()
        if (!sel || !sel.rangeCount) return
        const range = sel.getRangeAt(0)
        if (range.collapsed) return
        const span = document.createElement('span')
        span.style.fontSize = `${sizePx}px`
        try {
            span.appendChild(range.extractContents())
            range.insertNode(span)
            setFontSize(sizePx)
            if (editorRef.current) {
                handleInput({ currentTarget: editorRef.current } as any)
            }
        } catch (err) {
            console.warn(err)
        }
    }

    const alignText = (dir: 'left' | 'center' | 'right' | 'justify') => {
        const cmdMap = {
            left: 'justifyLeft',
            center: 'justifyCenter',
            right: 'justifyRight',
            justify: 'justifyFull'
        }
        exec(cmdMap[dir])
        setTimeout(() => {
            if (editorRef.current) {
                handleInput({ currentTarget: editorRef.current } as any)
            }
        }, 0)
    }

    function escapeHtml(unsafe: string) {
        return unsafe.replace(/[&<>"']/g, function(m) {
            switch (m) {
                case '&': return '&amp;'
                case '<': return '&lt;'
                case '>': return '&gt;'
                case '"': return '&quot;'
                case "'": return '&#039;'
                default: return m
            }
        })
    }

    const colorPresets = [
        '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', '#FFFF00',
        '#FF00FF', '#00FFFF', '#FFA500', '#800080', '#FFC0CB', '#808080',
        '#8B4513', '#006400', '#000080', '#FF6347', '#4B0082', '#FFD700'
    ]

    if (!isPurifyReady) {
        return (
            <div className={`border rounded-lg p-4 min-h-[200px] bg-gray-50 ${className}`}>
                <p className="text-gray-400">Editör yükleniyor...</p>
            </div>
        )
    }

    return (
        <div className={`w-full space-y-3 ${className}`}>
            {/* Toolbar */}
            <div className="bg-white border rounded-lg p-2 shadow-sm">
                {/* Row 1 */}
                <div className="flex flex-wrap gap-2 items-center pb-2 border-b">
                    {/* Format Buttons */}
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={() => exec('bold')}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 font-bold transition-colors"
                            title="Kalın (Ctrl+B)"
                        >
                            B
                        </button>
                        <button
                            type="button"
                            onClick={() => exec('italic')}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 italic transition-colors"
                            title="İtalik (Ctrl+I)"
                        >
                            I
                        </button>
                        <button
                            type="button"
                            onClick={() => exec('underline')}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 underline transition-colors"
                            title="Altı Çizili (Ctrl+U)"
                        >
                            U
                        </button>
                        <button
                            type="button"
                            onClick={() => exec('strikeThrough')}
                            className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 line-through transition-colors"
                            title="Üstü Çizili"
                        >
                            S
                        </button>
                    </div>

                    {/* Heading */}
                    <select
                        onChange={(e) => setHeading(e.target.value)}
                        defaultValue="p"
                        className="px-2 py-1 text-sm border rounded hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="p">Paragraf</option>
                        <option value="h1">Başlık 1</option>
                        <option value="h2">Başlık 2</option>
                        <option value="h3">Başlık 3</option>
                        <option value="h4">Başlık 4</option>
                        <option value="h5">Başlık 5</option>
                        <option value="h6">Başlık 6</option>
                    </select>

                    {/* Font Size */}
                    <select
                        value={fontSize}
                        onChange={(e) => setFontSizeCustom(e.target.value)}
                        className="px-2 py-1 text-sm border rounded hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="12">12px</option>
                        <option value="14">14px</option>
                        <option value="16">16px</option>
                        <option value="18">18px</option>
                        <option value="20">20px</option>
                        <option value="24">24px</option>
                        <option value="28">28px</option>
                        <option value="32">32px</option>
                        <option value="36">36px</option>
                    </select>

                    {/* Colors */}
                    <div className="flex gap-1">
                        {/* Text Color */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowColorPicker(!showColorPicker)
                                    setShowBgColorPicker(false)
                                }}
                                className="w-8 h-8 flex flex-col items-center justify-center rounded hover:bg-gray-100 transition-colors"
                                title="Metin Rengi"
                            >
                                <span className="text-sm font-bold">A</span>
                                <div className="w-6 h-1 rounded mt-0.5" style={{ backgroundColor: foreColor }} />
                            </button>
                            {showColorPicker && (
                                <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-3 z-50 min-w-[180px]">
                                    <div className="grid grid-cols-6 gap-1 mb-2">
                                        {colorPresets.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => applyForeColor(color)}
                                                className="w-6 h-6 rounded border-2 hover:scale-110 transition-transform"
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                    <input
                                        type="color"
                                        value={foreColor}
                                        onChange={(e) => applyForeColor(e.target.value)}
                                        className="w-full h-8 cursor-pointer rounded"
                                    />
                                </div>
                            )}
                        </div>

                        {/* Background Color */}
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => {
                                    setShowBgColorPicker(!showBgColorPicker)
                                    setShowColorPicker(false)
                                }}
                                className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors"
                                title="Arka Plan Rengi"
                            >
                                <span className="px-1.5 py-0.5 text-xs font-bold rounded" style={{ backgroundColor: backColor }}>
                                    A
                                </span>
                            </button>
                            {showBgColorPicker && (
                                <div className="absolute top-full left-0 mt-1 bg-white border rounded-lg shadow-lg p-3 z-50 min-w-[180px]">
                                    <div className="grid grid-cols-6 gap-1 mb-2">
                                        {colorPresets.map(color => (
                                            <button
                                                key={color}
                                                type="button"
                                                onClick={() => applyBackColor(color)}
                                                className="w-6 h-6 rounded border-2 hover:scale-110 transition-transform"
                                                style={{ backgroundColor: color }}
                                                title={color}
                                            />
                                        ))}
                                    </div>
                                    <input
                                        type="color"
                                        value={backColor}
                                        onChange={(e) => applyBackColor(e.target.value)}
                                        className="w-full h-8 cursor-pointer rounded"
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Row 2 */}
                <div className="flex flex-wrap gap-2 items-center pt-2">
                    {/* Lists */}
                    <div className="flex gap-1">
                        <button
                            type="button"
                            onClick={() => {
                                exec('insertUnorderedList')
                                setTimeout(() => editorRef.current && handleInput({ currentTarget: editorRef.current } as any), 0)
                            }}
                            className="px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
                            title="Madde İşaretli Liste"
                        >
                            <span>•</span> Liste
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                exec('insertOrderedList')
                                setTimeout(() => editorRef.current && handleInput({ currentTarget: editorRef.current } as any), 0)
                            }}
                            className="px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors flex items-center gap-1"
                            title="Numaralı Liste"
                        >
                            <span>1.</span> Liste
                        </button>
                    </div>

                    {/* Alignment */}
                    <div className="flex gap-1 border-l pl-2">
                        <button type="button" onClick={() => alignText('left')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors" title="Sola Hizala">
                            ☰
                        </button>
                        <button type="button" onClick={() => alignText('center')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors" title="Ortala">
                            ☰
                        </button>
                        <button type="button" onClick={() => alignText('right')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors" title="Sağa Hizala">
                            ☰
                        </button>
                        <button type="button" onClick={() => alignText('justify')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors" title="İki Yana Yasla">
                            ☰
                        </button>
                    </div>

                    {/* Indent */}
                    <div className="flex gap-1 border-l pl-2">
                        <button type="button" onClick={() => { exec('indent'); setTimeout(() => editorRef.current && handleInput({ currentTarget: editorRef.current } as any), 0) }} className="px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors" title="Girintili">→</button>
                        <button type="button" onClick={() => { exec('outdent'); setTimeout(() => editorRef.current && handleInput({ currentTarget: editorRef.current } as any), 0) }} className="px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors" title="Çıkıntılı">←</button>
                    </div>

                    {/* Insert */}
                    <div className="flex gap-1 border-l pl-2">
                        <button type="button" onClick={insertLink} className="px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors" title="Link Ekle">🔗</button>
                        <button type="button" onClick={insertImage} className="px-2 py-1 text-md rounded hover:bg-gray-100 transition-colors" title="Resim Ekle">📷️</button>
                        <button type="button" onClick={() => { exec('insertHorizontalRule'); setTimeout(() => editorRef.current && handleInput({ currentTarget: editorRef.current } as any), 0) }} className="px-2 py-1 text-sm rounded hover:bg-gray-100 transition-colors" title="Yatay Çizgi">―</button>
                    </div>

                    {/* Undo/Redo & Clear */}
                    <div className="flex gap-1 border-l pl-2 ml-auto">
                        <button type="button" onClick={() => exec('undo')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors" title="Geri Al">↶</button>
                        <button type="button" onClick={() => exec('redo')} className="w-8 h-8 flex items-center justify-center rounded hover:bg-gray-100 transition-colors" title="Yinele">↷</button>
                        <button type="button" onClick={() => { exec('removeFormat'); setTimeout(() => editorRef.current && handleInput({ currentTarget: editorRef.current } as any), 0) }} className="px-2 py-1 text-sm rounded hover:bg-red-50 text-red-600 transition-colors" title="Formatı Temizle">✕</button>
                    </div>
                </div>
            </div>

            {/* Editor */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onPaste={handlePaste}
                className="w-full border-2 rounded-lg p-4 min-h-[300px] max-h-[600px] overflow-y-auto focus:outline-none focus:border-blue-500 bg-white transition-colors"
                style={{
                    wordWrap: 'break-word',
                    overflowWrap: 'break-word'
                }}
            />
        </div>
    )
}