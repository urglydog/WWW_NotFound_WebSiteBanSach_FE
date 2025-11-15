import { CalendarRange, Download, RefreshCw, Settings } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { DateRange } from "@/hooks/use-revenue-data"

interface RevenuePageHeaderProps {
  title?: string
  description?: string
  dateRange: DateRange
  onDateRangeChange?: (range: DateRange) => void
  onExport?: () => void
  onRefresh?: () => void
  onSettings?: () => void
  className?: string
}

export function RevenuePageHeader({ 
  title = "Thống kê doanh thu",
  description = "Theo dõi doanh thu đa kênh, hiệu suất danh mục và các chỉ số tài chính quan trọng.",
  dateRange,
  onDateRangeChange,
  onExport,
  onRefresh,
  onSettings,
  className 
}: RevenuePageHeaderProps) {
  return (
    <header className={cn("flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between", className)}>
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">{description}</p>
      </div>
      
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={onSettings}
          >
            <Settings className="w-4 h-4" />
            <span className="hidden sm:inline">Cài đặt</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={onRefresh}
          >
            <RefreshCw className="w-4 h-4" />
            <span className="hidden sm:inline">Làm mới</span>
          </Button>
          
          <Button 
            variant="outline" 
            size="sm"
            className="gap-2"
            onClick={onExport}
          >
            <Download className="w-4 h-4" />
            <span className="hidden sm:inline">Xuất</span>
          </Button>
        </div>

        {/* Date Range Display */}
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
          <CalendarRange className="w-4 h-4 shrink-0" />
          <span className="whitespace-nowrap">
            {dateRange.startDate} - {dateRange.endDate}
          </span>
        </div>
      </div>
    </header>
  )
}