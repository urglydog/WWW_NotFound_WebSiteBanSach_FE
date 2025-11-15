# 🚀 Admin Page Development Guidelines

## 📋 Mục tiêu
Đảm bảo nhiều developer có thể làm việc trên cùng một admin page mà **KHÔNG BỊ XUNG ĐỘT** khi merge code.

## 🏗️ Cấu trúc Modular

### 1. **Page Structure Template**
```tsx
// app/admin/[feature]/page.tsx
"use client"

import { mockData } from "@/lib/mock-data"
import { useFeatureFilters } from "@/hooks/use-feature-filters"
import { 
  PageHeader,
  FilterSection, 
  ContentLayout,
  FeatureTable,
  StatisticsSidebar 
} from "@/components/admin"

export default function AdminFeaturePage() {
  const { filterState, filteredData, categories, actions } = useFeatureFilters(mockData)

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="space-y-4 px-2 py-4 sm:px-4 md:px-6 lg:px-8 w-full mx-auto">
        
        <PageHeader 
          title="Quản lý [Feature]"
          description="Mô tả chức năng"
          onAddNew={() => {/* Developer A làm việc ở đây */}}
          onSaveFilters={() => {/* Developer B làm việc ở đây */}}
        />

        <FilterSection 
          filterState={filterState}
          actions={actions}
          categories={categories}
          showSearch={true}
          showAvailability={true}
          searchPlaceholder="Tìm kiếm..."
        />

        <ContentLayout
          sidebar={<StatisticsSidebar data={mockData} />}
          sidebarSize="md"
        >
          <FeatureTable 
            data={filteredData}
            onEdit={(id) => {/* Developer C làm việc ở đây */}}
            onDelete={(id) => {/* Developer D làm việc ở đây */}}
          />
        </ContentLayout>

      </div>
    </div>
  )
}
```

## 👥 Phân chia công việc theo Component

### **Developer A - Header Actions**
- File: `components/admin/page-header.tsx`
- Trách nhiệm: Add New, Save Filters, Export functions
- Không conflict với: Filter logic, Table logic, Statistics

### **Developer B - Filter Features** 
- File: `hooks/use-feature-filters.ts`
- File: `components/admin/filter-section.tsx`
- Trách nhiệm: Search, Category, Price range, Availability filters
- Không conflict với: Header actions, Table display, Statistics

### **Developer C - Table & CRUD**
- File: `components/admin/feature-table.tsx`
- Trách nhiệm: Table display, Edit, Delete, Pagination
- Không conflict với: Header actions, Filter logic, Statistics

### **Developer D - Statistics & Analytics**
- File: `components/admin/statistics-sidebar.tsx`
- Trách nhiệm: Stats calculation, Charts, Quick insights
- Không conflict với: Table logic, Filter logic, Header actions

### **Developer E - Layout & Responsive**
- File: `components/admin/content-layout.tsx`
- Trách nhiệm: Grid layout, Responsive design, Sidebar positioning
- Không conflict với: Business logic của các components khác

## 🔧 Quy tắc để tránh Conflict

### 1. **Một Developer = Một Component**
```bash
# ❌ KHÔNG làm thế này - nhiều người cùng sửa 1 file
Developer A: sửa page.tsx (header + table)
Developer B: sửa page.tsx (filter + table)
# → CONFLICT khi merge!

# ✅ LÀM thế này - mỗi người 1 component riêng
Developer A: sửa page-header.tsx
Developer B: sửa filter-section.tsx  
Developer C: sửa feature-table.tsx
Developer D: sửa statistics-sidebar.tsx
# → KHÔNG conflict!
```

### 2. **State Management tách biệt**
```tsx
// ❌ KHÔNG: State trong main page
const [searchTerm, setSearchTerm] = useState("") // Developer A sửa
const [filters, setFilters] = useState({})       // Developer B sửa
// → CONFLICT!

// ✅ CÓ: State trong custom hook
const { filterState, actions } = useFeatureFilters(data)
// Developer B chỉ sửa file hook, không động vào page chính
```

### 3. **Props Interface cố định**
```tsx
// Định nghĩa interface trước, KHÔNG thay đổi khi dev
interface FeatureTableProps {
  data: FeatureItem[]
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  className?: string
}

// Mỗi developer implement logic bên trong component của mình
```

## 📁 File Structure Anti-Conflict

```
app/admin/books/
├── page.tsx                 # ← CHỈ import & layout, KHÔNG logic
└── loading.tsx

components/admin/
├── page-header.tsx          # ← Developer A
├── filter-section.tsx       # ← Developer B  
├── books-table.tsx          # ← Developer C
├── statistics-sidebar.tsx   # ← Developer D
├── content-layout.tsx       # ← Developer E
└── index.ts                 # ← Export all

hooks/
├── use-book-filters.ts      # ← Developer B
├── use-book-crud.ts         # ← Developer C
└── use-book-stats.ts        # ← Developer D
```

## 🚦 Git Workflow

### Branch Naming Convention
```bash
feature/books-header-actions    # Developer A
feature/books-filter-system     # Developer B  
feature/books-table-crud        # Developer C
feature/books-statistics        # Developer D
feature/books-layout            # Developer E
```

### Merge Strategy
1. **Tạo base branch** từ main
2. Mỗi developer tạo **feature branch** riêng
3. **Review** component riêng lẻ trước
4. **Merge** từng feature một cách tuần tự
5. **Test** integration sau mỗi merge

## 🧪 Testing Strategy

### Component Level Testing
```tsx
// Developer A test PageHeader
describe('PageHeader', () => {
  it('should render title and actions', () => {})
})

// Developer B test FilterSection  
describe('FilterSection', () => {
  it('should filter data correctly', () => {})
})
```

### Integration Testing
```tsx
// Sau khi merge tất cả components
describe('AdminBooksPage Integration', () => {
  it('should work together without conflicts', () => {})
})
```

## ⚡ Quick Start Checklist

- [ ] **Clone** component template cho feature mới
- [ ] **Assign** mỗi developer một component cụ thể
- [ ] **Define** interfaces và props trước khi bắt đầu code
- [ ] **Create** feature branches riêng biệt
- [ ] **Review** component riêng lẻ trước khi merge
- [ ] **Test** integration sau mỗi merge

## 🎯 Benefits

✅ **Zero Merge Conflicts** - Mỗi người làm file riêng  
✅ **Parallel Development** - Làm việc đồng thời không chờ đợi  
✅ **Code Reusability** - Components dùng lại cho nhiều pages  
✅ **Easy Testing** - Test từng component riêng lẻ  
✅ **Clear Responsibility** - Ai làm gì rõ ràng  
✅ **Maintainable** - Dễ maintain và debug  

---

**💡 Lưu ý:** Tuân thủ guidelines này = 99% không bị conflict khi merge code!