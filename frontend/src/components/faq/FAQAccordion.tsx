// src/components/faq/FAQAccordion.tsx
'use client';

import { useState, useEffect } from 'react';
import { faqService } from '@/src/services/faq.service';
import { FAQItem } from '@/src/types/faq.types';
import {ArrowDown, ChevronDown} from 'lucide-react';

interface FAQAccordionProps {
    locale: string;
}

export default function FAQAccordion({ locale }: FAQAccordionProps) {
    const [faqs, setFaqs] = useState<FAQItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [openIndex, setOpenIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchFAQs = async () => {
            try {
                setLoading(true);
                const config = await faqService.getFAQConfig(locale);
                setFaqs(config.faqs);
            } catch (error) {
                console.error('Error fetching FAQs:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchFAQs();
    }, [locale]);

    if (loading) {
        return (
            <div className="w-full max-w-3xl mx-auto animate-pulse">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="border p-6 rounded-md mb-4">
                        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />
                    </div>
                ))}
            </div>
        );
    }

    if (faqs.length === 0) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Henüz soru eklenmemiş.</p>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto space-y-4">
            {faqs.map((faq, index) => (
                <div
                    key={faq.id || index}
                    className="border border-primary-blue rounded-lg overflow-hidden"
                >
                    <button
                        onClick={() => setOpenIndex(openIndex === index ? null : index)}
                        className="w-full flex items-center justify-between p-6 text-left transition-colors"
                    >
                        <h3 className="text-lg font-semibold text-primary-pink pr-4">
                            {faq.question}
                        </h3>
                        <ArrowDown className={`w-8 h-8 text-white bg-primary-pink p-1 rounded-sm flex-shrink-0 transition-transform duration-200 ${
                            openIndex === index ? 'rotate-180' : ''
                        }`}/>
                    </button>

                    <div
                        className={`overflow-hidden transition-all duration-300 ${
                            openIndex === index ? 'max-h-96' : 'max-h-0'
                        }`}
                    >
                        <div className="p-6 pt-0 text-gray-700 leading-relaxed">
                            {faq.answer}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}