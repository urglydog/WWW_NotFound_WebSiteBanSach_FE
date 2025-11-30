"use client"

import { toast } from "sonner"
import { useUserFilters } from "@/hooks/use-user-filters"
import { useIsMobile } from "@/hooks/use-mobile"
import {
  UsersPageHeader,
  UsersStats,
  UsersSearchFilters,
  UsersTable,
  UsersCardView
} from "@/components/admin"

export default function AdminUsersPage() {
  const isMobile = useIsMobile()
  const {
    users,
    filteredUsers,
    filterState,
    stats,
    filterActions,
    userActions,
  } = useUserFilters([])

  // Event handlers
  const handleAddUser = () => {
    toast.info("Chức năng thêm người dùng đang phát triển")
  }

  const handleExport = () => {
    toast.success("Đã xuất dữ liệu người dùng")
  }

  const handleView = (user: any) => {
    toast.info(`Xem chi tiết người dùng: ${user.name}`)
  }

  return (
    <div className="min-h-screen bg-muted/40">
      <div className="space-y-6 px-3 py-4 sm:px-6 sm:py-6 lg:px-8">
        {/* Page Header */}
        <UsersPageHeader 
          onAddUser={handleAddUser}
          onExport={handleExport}
        />

        {/* Statistics */}
        <UsersStats stats={stats} />

        {/* Search and Filters */}
        <UsersSearchFilters
          searchTerm={filterState.searchTerm}
          statusFilter={filterState.statusFilter}
          onSearchChange={filterActions.setSearchTerm}
          onStatusChange={filterActions.setStatusFilter}
          onReset={filterActions.resetFilters}
        />

        {/* Users Display */}
        {isMobile ? (
          <UsersCardView
            users={filteredUsers}
            onDelete={userActions.deleteUser}
            onBan={userActions.banUser}
            onUnban={userActions.unbanUser}
            onView={handleView}
          />
        ) : (
          <UsersTable
            users={filteredUsers}
            onDelete={userActions.deleteUser}
            onBan={userActions.banUser}
            onUnban={userActions.unbanUser}
            onView={handleView}
          />
        )}

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <p>
            Hiển thị {filteredUsers.length} / {users.length} người dùng
          </p>
        </div>
      </div>
    </div>
  )
}
