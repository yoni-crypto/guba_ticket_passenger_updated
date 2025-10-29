'use client'
import { useState } from 'react'
import { MoveUpRight } from 'lucide-react'

interface FAQItem {
  id: number
  question: string
  answer: string
}

export default function FAQ() {
  const [activeId, setActiveId] = useState<number>(1)

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: 'How do I book a ticket?',
      answer: 'Search for your route, fill in passenger information, click book, complete payment, then confirm your seat selection.'
    },
    {
      id: 2,
      question: 'What payment methods do you accept?',
      answer: 'We currently accept Chapa payment gateway which supports CBE, Awash Bank, Abyssinia Bank, and other major Ethiopian banks.'
    },
    {
      id: 3,
      question: 'Can I choose a seat before payment?',
      answer: 'When you book, one seat will be reserved for you until the payment time expires. After completing payment, you can then choose your preferred seat.'
    }
  ]

  const toggleFAQ = (id: number) => {
    setActiveId(activeId === id ? 0 : id)
  }

  return (
    <div className="py-12 lg:py-20">
      <div className="container mx-auto px-4 flex flex-col justify-between gap-10 lg:flex-row">
        <div className="space-y-4 lg:space-y-6">
          <h2 className="w-full max-w-185.75 text-2xl font-medium text-black sm:text-3xl lg:text-4xl xl:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-gray w-full max-w-153.5 lg:text-lg">
            Still have questions? Our customer support team is here to help you with your bus ticket booking.
          </p>
        </div>

        <div className="w-full space-y-4 lg:max-w-175">
          {faqs.map((faq) => {
            const isExpanded = activeId === faq.id
            return (
              <div
                key={faq.id}
                className={`border-gray-light shadow-3xl rounded-3xl border-2 ${
                  isExpanded ? 'bg-blue text-white' : 'bg-white text-black'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  className="flex w-full items-center justify-between gap-2 p-3.5 text-left text-lg font-medium transition outline-none lg:p-5 lg:text-xl xl:p-6"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`text-3xl font-semibold sm:text-[40px] ${
                        isExpanded ? 'text-white/50' : 'text-blue/30'
                      }`}
                    >
                      {faq.id.toString().padStart(2, '0')}
                    </span>
                    <span>{faq.question}</span>
                  </span>
                  <span
                    className={`grid size-8 shrink-0 place-content-center rounded-full ${
                      isExpanded ? 'text-white bg-white/10' : 'text-blue bg-blue/10'
                    }`}
                  >
                    <MoveUpRight
                      className={`size-5.5 shrink-0 transition duration-300 ${
                        isExpanded ? 'rotate-0' : 'rotate-90'
                      }`}
                    />
                  </span>
                </button>
                
                {isExpanded && (
                  <div className="relative -top-1 sm:-top-2">
                    <p className="px-4 pb-3 sm:px-6 sm:pb-4 lg:text-lg">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
