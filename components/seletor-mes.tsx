"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface MonthCarouselProps {
  onMonthSelect?: (date: Date) => void
  defaultSelectedMonth?: Date
}

export function MonthCarousel({ onMonthSelect, defaultSelectedMonth }: MonthCarouselProps) {
  const [selectedMonth, setSelectedMonth] = useState<Date>(defaultSelectedMonth || new Date())
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Gera array de meses: 1 ano atrás até 1 ano à frente
  const generateMonths = () => {
    const months: Date[] = []
    const today = new Date()
    const startDate = new Date(today.getFullYear() - 1, today.getMonth(), 1)

    for (let i = 0; i < 25; i++) {
      const date = new Date(startDate.getFullYear(), startDate.getMonth() + i, 1)
      months.push(date)
    }

    return months
  }

  const months = generateMonths()

  // Formata o mês para exibição (ex: "Janeiro - 2024")
  const formatMonth = (date: Date) => {
    const monthNames = [
      "Janeiro",
      "Fevereiro",
      "Março",
      "Abril",
      "Maio",
      "Junho",
      "Julho",
      "Agosto",
      "Setembro",
      "Outubro",
      "Novembro",
      "Dezembro",
    ]
    return `${monthNames[date.getMonth()]} - ${date.getFullYear()}`
  }

  const handleMonthClick = (date: Date) => {
    setSelectedMonth(date)
    onMonthSelect?.(date)
  }

  const scroll = (direction: "left" | "right") => {
    if (scrollContainerRef.current) {
      const scrollAmount = 300
      scrollContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  // Scroll automático para o mês selecionado ao montar
  useEffect(() => {
    const selectedIndex = months.findIndex(
      (m) => m.getMonth() === selectedMonth.getMonth() && m.getFullYear() === selectedMonth.getFullYear(),
    )

    if (selectedIndex !== -1 && scrollContainerRef.current) {
      const button = scrollContainerRef.current.children[selectedIndex] as HTMLElement
      if (button) {
        button.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" })
      }
    }
  }, [])

  return (
    <div className="relative w-full">
      <div className="flex items-center gap-2">
        {/* Botão de scroll para esquerda */}
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 h-10 w-10 bg-transparent"
          onClick={() => scroll("left")}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Container rolável de meses */}
        <div
          ref={scrollContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide scroll-smooth flex-1"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {months.map((month, index) => {
            const isSelected =
              month.getMonth() === selectedMonth.getMonth() && month.getFullYear() === selectedMonth.getFullYear()

            return (
              <Button
                key={index}
                variant={isSelected ? "default" : "outline"}
                className={cn("shrink-0 whitespace-nowrap", isSelected && "text-primary-foreground")}
                onClick={() => handleMonthClick(month)}
              >
                {formatMonth(month)}
              </Button>
            )
          })}
        </div>

        {/* Botão de scroll para direita */}
        <Button
          variant="outline"
          size="icon"
          className="shrink-0 h-10 w-10 bg-transparent"
          onClick={() => scroll("right")}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
