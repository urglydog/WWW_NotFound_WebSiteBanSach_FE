"use client"

import { mockBooks } from "@/lib/mock-data"
import { useBookFilters } from "@/hooks/use-book-filters"
import { 
  PageHeader,
  FilterSection,
  ContentLayout,
  BooksTable,
  StatisticsSidebar 
} from "@/components/admin"

export default function AdminBooksPage() {
  const { filterState, filteredBooks, categories, actions } = useBookFilters(mockBooks)

  // Handler functions - có thể assign cho từng developer khác nhau
  const handleAddNewBook = () => {
    // Developer A: Implement add new book logic
    console.log('Add new book')
  }

  const handleSaveFilters = () => {
    // Developer B: Implement save filters logic  
    console.log('Save filters')
  }

  const handleEditBook = (id: string) => {
    // Developer C: Implement edit book logic
    console.log('Edit book:', id)
  }

  const handleDeleteBook = (id: string) => {
    // Developer D: Implement delete book logic
    console.log('Delete book:', id)
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="space-y-4 px-2 py-4 sm:px-4 md:px-6 lg:px-8 w-full mx-auto">
        
        <PageHeader 
          title="Quản lý sách"
          description="Quản lý tồn kho, cập nhật thông tin sách và theo dõi hiệu suất bán hàng."
          onAddNew={handleAddNewBook}
          onSaveFilters={handleSaveFilters}
        />

        <FilterSection 
          filterState={filterState}
          actions={actions}
          categories={categories}
          showSearch={true}
          showAvailability={true}
          showPriceRange={true}
          showCategories={true}
          searchPlaceholder="Tìm kiếm sách, tác giả..."
        />

        <ContentLayout
          sidebar={<StatisticsSidebar books={mockBooks} />}
          sidebarSize="md"
          gap="md"
        >
          <BooksTable 
            books={filteredBooks}
          />
        </ContentLayout>

      </div>
    </div>
  )
}
