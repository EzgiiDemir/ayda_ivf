'use client'

import { useState, useEffect, useRef } from 'react'
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
    const [html, setHtml] = useState('')
    const editorRef = useRef<HTMLDivElement>(null)
    const isUpdatingRef = useRef(false)

    // DOMPurify client-side kontrolü
    const [isPurifyReady, setIsPurifyReady] = useState(false)

    useEffect(() => {
        // DOMPurify'ın browser'da hazır olduğundan emin ol
        if (typeof window !== 'undefined') {
            setIsPurifyReady(true)
        }
    }, [])

    // İlk içeriği set et
    useEffect(() => {
        if (content && editorRef.current && !isUpdatingRef.current) {
            const sanitized = isPurifyReady
                ? DOMPurify.sanitize(content, {
                    ALLOWED_TAGS: [
                        'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
                        'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                        'ul', 'ol', 'li',
                        'a', 'img',
                        'blockquote', 'code', 'pre',
                        'span', 'div',
                        'table', 'thead', 'tbody', 'tr', 'th', 'td',
                        'mark', 'small', 'sub', 'sup'
                    ],
                    ALLOWED_ATTR: [
                        'style', 'class', 'id',
                        'href', 'target', 'rel',
                        'src', 'alt', 'width', 'height',
                        'align', 'valign',
                        'colspan', 'rowspan',
                        'data-*'
                    ],
                    ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
                })
                : content

            if (editorRef.current.innerHTML !== sanitized) {
                editorRef.current.innerHTML = sanitized
                setHtml(sanitized)
            }
        }
    }, [content, isPurifyReady])

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
        if (!isPurifyReady) return

        isUpdatingRef.current = true

        const rawHtml = e.currentTarget.innerHTML

        // DOMPurify ile temizle - TÜM STİLLERİ KORU
        const clean = DOMPurify.sanitize(rawHtml, {
            ALLOWED_TAGS: [
                'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'ul', 'ol', 'li',
                'a', 'img',
                'blockquote', 'code', 'pre',
                'span', 'div',
                'table', 'thead', 'tbody', 'tr', 'th', 'td',
                'mark', 'small', 'sub', 'sup'
            ],
            ALLOWED_ATTR: [
                'style', 'class', 'id',
                'href', 'target', 'rel',
                'src', 'alt', 'width', 'height',
                'align', 'valign',
                'colspan', 'rowspan',
                'data-*'
            ],
            KEEP_CONTENT: true,
            ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        })

        setHtml(clean)

        // Parent'a bildir
        if (onChange) {
            onChange(clean)
        }

        setTimeout(() => {
            isUpdatingRef.current = false
        }, 0)
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
        e.preventDefault()

        if (!isPurifyReady || !editorRef.current) return

        // Önce HTML formatı almayı dene
        let pastedContent = e.clipboardData.getData('text/html')

        // HTML yoksa plain text al
        if (!pastedContent) {
            pastedContent = e.clipboardData.getData('text/plain')
            // Plain text'i p tag'ine sar ve satır sonlarını koru
            pastedContent = pastedContent
                .split('\n')
                .map(line => line.trim() ? `<p>${line}</p>` : '<br>')
                .join('')
        }

        // İçeriği temizle AMA STİLLERİ KORU
        const cleanHtml = DOMPurify.sanitize(pastedContent, {
            ALLOWED_TAGS: [
                'p', 'br', 'strong', 'b', 'em', 'i', 'u', 's', 'strike',
                'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
                'ul', 'ol', 'li',
                'a', 'img',
                'blockquote', 'code', 'pre',
                'span', 'div',
                'table', 'thead', 'tbody', 'tr', 'th', 'td',
                'mark', 'small', 'sub', 'sup'
            ],
            ALLOWED_ATTR: [
                'style', 'class', 'id',
                'href', 'target', 'rel',
                'src', 'alt', 'width', 'height',
                'align', 'valign',
                'colspan', 'rowspan',
                'data-*'
            ],
            KEEP_CONTENT: true,
            ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
        })

        // Seçili alanı bul
        const selection = window.getSelection()
        if (!selection?.rangeCount) return

        // Seçili içeriği sil
        selection.deleteFromDocument()
        const range = selection.getRangeAt(0)

        // HTML içeriğini ekle
        const fragment = range.createContextualFragment(cleanHtml)
        range.insertNode(fragment)

        // Cursor'u eklenen içeriğin sonuna taşı
        range.collapse(false)
        selection.removeAllRanges()
        selection.addRange(range)

        // Input event'ini tetikle
        handleInput({ currentTarget: editorRef.current } as any)
    }

    if (!isPurifyReady) {
        return (
            <div className={`border rounded-lg p-4 min-h-[200px] bg-gray-50 ${className}`}>
                <p className="text-gray-400">Editör yükleniyor...</p>
            </div>
        )
    }

    return (
        <div className="w-full space-y-4">
            {/* Editör - Responsive */}
            <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                onInput={handleInput}
                onPaste={handlePaste}
                className={`
                    w-full border rounded-lg p-4 
                    min-h-[200px] max-h-[600px] 
                    overflow-y-auto overflow-x-hidden
                    focus:outline-none focus:ring-2 focus:ring-primary-pink
                    prose prose-sm sm:prose-base lg:prose-lg max-w-none
                    ${className}
                `}
                data-placeholder={placeholder}
            />

            {/* Debug Panel (Geliştirme için) */}
            {process.env.NODE_ENV === 'development' && (
                <details className="mt-4 p-4 bg-gray-100 rounded">
                    <summary className="cursor-pointer font-medium">HTML Önizleme</summary>
                    <pre className="mt-2 text-xs overflow-auto max-h-40 bg-white p-2 rounded break-all whitespace-pre-wrap">
                        {html}
                    </pre>
                </details>
            )}

            {/* Global Styles */}
            <style jsx global>{`
                /* Placeholder */
                [contenteditable][data-placeholder]:empty:before {
                    content: attr(data-placeholder);
                    color: #9ca3af;
                    pointer-events: none;
                    position: absolute;
                }

                /* Editör içi responsive stiller */
                [contenteditable] {
                    word-wrap: break-word;
                    overflow-wrap: break-word;
                }

                /* Kopyalanan içeriğin stillerini koru */
                [contenteditable] * {
                    max-width: 100%;
                }

                /* Resimler responsive */
                [contenteditable] img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 0.5rem 0;
                }

                /* Tablolar responsive */
                [contenteditable] table {
                    max-width: 100%;
                    overflow-x: auto;
                    display: block;
                    border-collapse: collapse;
                }

                [contenteditable] table td,
                [contenteditable] table th {
                    border: 1px solid #e5e7eb;
                    padding: 0.5rem;
                    min-width: 50px;
                }

                /* Başlıklar responsive */
                [contenteditable] h1 {
                    font-size: clamp(1.5rem, 4vw, 2.5rem);
                    font-weight: bold;
                    margin: 1rem 0 0.5rem;
                }

                [contenteditable] h2 {
                    font-size: clamp(1.25rem, 3vw, 2rem);
                    font-weight: bold;
                    margin: 0.875rem 0 0.5rem;
                }

                [contenteditable] h3 {
                    font-size: clamp(1.125rem, 2.5vw, 1.5rem);
                    font-weight: bold;
                    margin: 0.75rem 0 0.5rem;
                }

                [contenteditable] h4 {
                    font-size: clamp(1rem, 2vw, 1.25rem);
                    font-weight: bold;
                    margin: 0.625rem 0 0.5rem;
                }

                [contenteditable] h5 {
                    font-size: clamp(0.875rem, 1.5vw, 1.125rem);
                    font-weight: bold;
                    margin: 0.5rem 0 0.5rem;
                }

                [contenteditable] h6 {
                    font-size: clamp(0.75rem, 1.25vw, 1rem);
                    font-weight: bold;
                    margin: 0.5rem 0 0.5rem;
                }

                /* Paragraflar */
                [contenteditable] p {
                    margin: 0.5rem 0;
                    line-height: 1.6;
                }

                /* Listeler */
                [contenteditable] ul,
                [contenteditable] ol {
                    margin: 0.5rem 0;
                    padding-left: 1.5rem;
                }

                [contenteditable] li {
                    margin: 0.25rem 0;
                }

                /* Blockquote */
                [contenteditable] blockquote {
                    border-left: 4px solid #e5e7eb;
                    padding-left: 1rem;
                    margin: 1rem 0;
                    color: #6b7280;
                    font-style: italic;
                }

                /* Code blokları */
                [contenteditable] code {
                    background-color: #f3f4f6;
                    padding: 0.125rem 0.25rem;
                    border-radius: 0.25rem;
                    font-family: monospace;
                    font-size: 0.875em;
                }

                [contenteditable] pre {
                    background-color: #1f2937;
                    color: #f9fafb;
                    padding: 1rem;
                    border-radius: 0.5rem;
                    overflow-x: auto;
                    margin: 1rem 0;
                }

                [contenteditable] pre code {
                    background-color: transparent;
                    padding: 0;
                    color: inherit;
                }

                /* Linkler */
                [contenteditable] a {
                    color: #3b82f6;
                    text-decoration: underline;
                }

                [contenteditable] a:hover {
                    color: #2563eb;
                }

                /* Font boyutları korunur */
                [contenteditable] [style*="font-size"] {
                    /* Inline font-size'lar korunur */
                }

                /* Renkler korunur */
                [contenteditable] [style*="color"] {
                    /* Inline color'lar korunur */
                }

                /* Background renkler korunur */
                [contenteditable] [style*="background"] {
                    /* Inline background'lar korunur */
                }

                /* Text align korunur */
                [contenteditable] [style*="text-align"] {
                    /* Inline text-align'lar korunur */
                }

                /* Mobile responsive */
                @media (max-width: 640px) {
                    [contenteditable] {
                        font-size: 14px;
                        padding: 0.75rem;
                    }

                    [contenteditable] table {
                        font-size: 12px;
                    }
                }

                /* Tablet responsive */
                @media (min-width: 641px) and (max-width: 1024px) {
                    [contenteditable] {
                        font-size: 15px;
                    }
                }

                /* Desktop */
                @media (min-width: 1025px) {
                    [contenteditable] {
                        font-size: 16px;
                    }
                }
            `}</style>
        </div>
    )
}