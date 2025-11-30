# API Services Documentation

## Cấu trúc thư mục

```
lib/
├── api-client.ts           # Base API client configuration
└── services/
    ├── index.ts            # Central export
    ├── auth.service.ts     # Authentication APIs
    ├── books.service.ts    # Books management APIs
    ├── orders.service.ts   # Orders management APIs
    ├── users.service.ts    # Users management APIs
    ├── cart.service.ts     # Shopping cart APIs
    ├── categories.service.ts # Categories APIs
    ├── promotions.service.ts # Promotions/Discounts APIs
    └── reviews.service.ts  # Reviews APIs
```

## Cách sử dụng

### 1. Cấu hình API Base URL

Tạo file `.env.local` trong root project:

```env
NEXT_PUBLIC_API_URL=http://localhost:8080/api
```

### 2. Import và sử dụng services

```typescript
import { authService, booksService, ordersService } from "@/lib/services";

// Trong component hoặc function
async function handleLogin() {
  try {
    const response = await authService.login({
      identifier: "admin",
      password: "password123",
    });

    // Lưu token
    localStorage.setItem("authToken", response.token);

    console.log("User:", response.user);
  } catch (error) {
    console.error("Login failed:", error);
  }
}

// Lấy danh sách sách
async function fetchBooks() {
  try {
    const response = await booksService.getBooks({
      page: 1,
      pageSize: 20,
      category: "fiction",
      sortBy: "price",
      sortOrder: "asc",
    });

    console.log("Books:", response.data);
    console.log("Total pages:", response.totalPages);
  } catch (error) {
    console.error("Failed to fetch books:", error);
  }
}
```

### 3. Sử dụng trong React Components

```typescript
"use client";

import { useState, useEffect } from "react";
import { booksService, Book } from "@/lib/services";

export function BooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadBooks() {
      try {
        const response = await booksService.getBooks({ page: 1, pageSize: 10 });
        setBooks(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      {books.map((book) => (
        <div key={book.id}>{book.title}</div>
      ))}
    </div>
  );
}
```

## API Services Chi Tiết

### Authentication Service (`authService`)

- `login(data)` - Đăng nhập
- `signup(data)` - Đăng ký tài khoản
- `loginWithGoogle(credential)` - Đăng nhập Google
- `logout()` - Đăng xuất
- `getCurrentUser()` - Lấy thông tin user hiện tại
- `refreshToken()` - Refresh token
- `forgotPassword(email)` - Quên mật khẩu
- `resetPassword(token, newPassword)` - Đặt lại mật khẩu

### Books Service (`booksService`)

- `getBooks(filters)` - Lấy danh sách sách có phân trang
- `getBookById(id)` - Lấy chi tiết 1 sách
- `createBook(data)` - Tạo sách mới (Admin)
- `updateBook(id, data)` - Cập nhật sách (Admin)
- `deleteBook(id)` - Xóa sách (Admin)
- `getFeaturedBooks(limit)` - Lấy sách nổi bật
- `getBestSellers(limit)` - Lấy sách bán chạy
- `getNewArrivals(limit)` - Lấy sách mới
- `searchBooks(keyword, filters)` - Tìm kiếm sách
- `uploadImage(file)` - Upload ảnh bìa sách
- `updateStock(id, quantity)` - Cập nhật tồn kho

### Orders Service (`ordersService`)

- `getOrders(filters)` - Lấy danh sách đơn hàng (Admin)
- `getOrderById(id)` - Lấy chi tiết đơn hàng
- `getMyOrders(filters)` - Lấy đơn hàng của user
- `createOrder(data)` - Tạo đơn hàng mới
- `updateOrderStatus(id, data)` - Cập nhật trạng thái (Admin)
- `cancelOrder(id, reason)` - Hủy đơn hàng
- `getOrderStats(startDate, endDate)` - Thống kê đơn hàng (Admin)
- `validatePromotion(code, total)` - Validate mã giảm giá

### Users Service (`usersService`)

- `getUsers(filters)` - Lấy danh sách user (Admin)
- `getUserById(id)` - Lấy thông tin user (Admin)
- `getMyProfile()` - Lấy profile của user hiện tại
- `updateProfile(data)` - Cập nhật profile
- `changePassword(data)` - Đổi mật khẩu
- `uploadAvatar(file)` - Upload avatar
- `getAddresses()` - Lấy danh sách địa chỉ
- `addAddress(data)` - Thêm địa chỉ mới
- `updateAddress(id, data)` - Cập nhật địa chỉ
- `deleteAddress(id)` - Xóa địa chỉ
- `setDefaultAddress(id)` - Đặt địa chỉ mặc định
- `updateUserStatus(id, status)` - Cập nhật trạng thái user (Admin)
- `updateUserRole(id, role)` - Cập nhật role user (Admin)
- `getUserStats()` - Thống kê user (Admin)

### Cart Service (`cartService`)

- `getCart()` - Lấy giỏ hàng hiện tại
- `addToCart(data)` - Thêm sản phẩm vào giỏ
- `updateCartItem(itemId, data)` - Cập nhật số lượng
- `removeCartItem(itemId)` - Xóa sản phẩm khỏi giỏ
- `clearCart()` - Xóa toàn bộ giỏ hàng
- `syncCart(items)` - Đồng bộ giỏ hàng
- `checkAvailability()` - Kiểm tra tồn kho

### Categories Service (`categoriesService`)

- `getCategories(includeInactive)` - Lấy danh sách danh mục
- `getCategoryById(id)` - Lấy chi tiết danh mục
- `getCategoryBySlug(slug)` - Lấy danh mục theo slug
- `createCategory(data)` - Tạo danh mục mới (Admin)
- `updateCategory(id, data)` - Cập nhật danh mục (Admin)
- `deleteCategory(id)` - Xóa danh mục (Admin)
- `getCategoryStats()` - Thống kê danh mục (Admin)

### Promotions Service (`promotionsService`)

- `getPromotions(filters)` - Lấy danh sách khuyến mãi (Admin)
- `getActivePromotions()` - Lấy khuyến mãi đang active
- `getPromotionById(id)` - Lấy chi tiết khuyến mãi
- `validatePromotion(code, orderTotal)` - Validate mã khuyến mãi
- `createPromotion(data)` - Tạo khuyến mãi mới (Admin)
- `updatePromotion(id, data)` - Cập nhật khuyến mãi (Admin)
- `deletePromotion(id)` - Xóa khuyến mãi (Admin)
- `togglePromotionStatus(id)` - Bật/tắt khuyến mãi (Admin)
- `getPromotionStats()` - Thống kê khuyến mãi (Admin)

### Reviews Service (`reviewsService`)

- `getReviews(filters)` - Lấy danh sách đánh giá
- `getBookReviews(bookId, filters)` - Lấy đánh giá của sách
- `getMyReviews(filters)` - Lấy đánh giá của user hiện tại
- `createReview(data)` - Tạo đánh giá mới
- `updateReview(id, data)` - Cập nhật đánh giá
- `deleteReview(id)` - Xóa đánh giá
- `markHelpful(id)` - Đánh dấu hữu ích
- `getBookRatingSummary(bookId)` - Lấy tổng quan rating

## Error Handling

API client tự động xử lý errors và throw Error với message phù hợp:

```typescript
try {
  const result = await booksService.getBookById("123");
} catch (error) {
  if (error instanceof Error) {
    console.error(error.message); // HTTP Error message
  }
}
```

## Authentication

API client tự động gửi JWT token trong header nếu có trong localStorage:

```typescript
// Sau khi login thành công
const response = await authService.login(credentials);
localStorage.setItem("authToken", response.token);

// Các request sau sẽ tự động có token trong header
const books = await booksService.getBooks();
```

## Upload Files

Sử dụng FormData cho file uploads:

```typescript
const file = event.target.files[0];
const result = await booksService.uploadImage(file);
console.log("Image URL:", result.url);
```
