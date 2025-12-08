"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { EmailVerification } from "@/components/auth/email-verification";
import { useAuth } from "@/lib/auth-context";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogOut, User, ShoppingBag, Heart, Settings, MapPin, Edit, Trash2 } from "lucide-react";
import { useState, useEffect } from "react";
import { usersService } from "@/lib/services/users.service";
import Image from "next/image";

interface UserProfile {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  phoneNumber?: string | null;
  role: string;
  emailVerified?: boolean;
  avatarUrl?: string;
  dateOfBirth?: string | null;
  gender?: string | null;
  lastLogin?: string | null;
  membershipTier?: string;
  points?: number;
}
import { WishlistSection } from "@/components/account/wishlist-section";
import { addressService, type Address } from "@/lib/services";
import { AddressSelectModal } from "@/components/products/address-select-modal";

export default function AccountPage() {
  const { user, logout, isLoading, setUserState } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("profile");
  const [localEmailVerified, setLocalEmailVerified] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [hasFetchedProfile, setHasFetchedProfile] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [addressesLoading, setAddressesLoading] = useState(false);
  const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<Address | null>(null);
  
  // Fetch user profile from API - fetch khi user có và chưa fetch
  useEffect(() => {
    // Tránh fetch nhiều lần
    if (hasFetchedProfile) {
      return;
    }

    const token = localStorage.getItem("authToken");
    if (!token || !user) {
      setLoadingProfile(false);
      return;
    }

    const fetchUserProfile = async () => {
      // Đánh dấu đã fetch để tránh fetch lại
      setHasFetchedProfile(true);

      try {
        const profile = await usersService.getMyProfile();
        setUserProfile(profile as UserProfile);
        
        // Update AuthContext with latest user info including avatarUrl
        // Chỉ update nếu có thay đổi thực sự để tránh trigger lại
        const updatedUser = {
          ...user,
          avatar: profile.avatarUrl || profile.avatar || user.avatar,
          emailVerified: profile.emailVerified ?? user.emailVerified,
          fullName: profile.fullName || user.fullName,
          phone: profile.phoneNumber || user.phone,
          username: profile.username || user.username,
        };
        
        // Chỉ update nếu có thay đổi
        const hasChanges = 
          updatedUser.avatar !== user.avatar ||
          updatedUser.emailVerified !== user.emailVerified ||
          updatedUser.fullName !== user.fullName ||
          updatedUser.phone !== user.phone ||
          updatedUser.username !== user.username;
        
        if (hasChanges) {
          setUserState(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        }
        
        setLocalEmailVerified(profile.emailVerified || false);
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
        // Reset flag nếu có lỗi để có thể retry
        setHasFetchedProfile(false);
      } finally {
        setLoadingProfile(false);
      }
    };

    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Chạy khi user.id thay đổi (khi user được load)

  // Refresh user from localStorage on mount AND when emailVerified event fires
  useEffect(() => {
    const checkEmailVerified = () => {
      if (user) {
        const storedUser =
          localStorage.getItem("user") || localStorage.getItem("currentUser");
        if (storedUser) {
          try {
            const freshUser = JSON.parse(storedUser);
            const isNowVerified = freshUser.emailVerified === true;

            setLocalEmailVerified(isNowVerified);

            // Update context if emailVerified changed
            if (freshUser.emailVerified !== user.emailVerified) {
              setUserState(freshUser);
            }
          } catch (err) {
            console.error("Failed to refresh user from localStorage:", err);
          }
        }
      }
    };

    checkEmailVerified();

    // Listen for custom emailVerified event from success page
    const handleEmailVerified = () => {
      console.log("📧 Email verified event received");
      checkEmailVerified();
    };

    window.addEventListener("emailVerified", handleEmailVerified);

    return () => {
      window.removeEventListener("emailVerified", handleEmailVerified);
    };
  }, [user, setUserState]);

  // Load addresses when switching to addresses tab
  useEffect(() => {
    if (activeTab === "addresses" && user) {
      loadAddresses();
    }
  }, [activeTab, user]);

  const loadAddresses = async () => {
    try {
      setAddressesLoading(true);
      const data = await addressService.getUserAddresses();
      setAddresses(data);
    } catch (error) {
      console.error("Error loading addresses:", error);
    } finally {
      setAddressesLoading(false);
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Bạn có chắc muốn xóa địa chỉ này?")) {
      return;
    }

    try {
      await addressService.deleteAddress(addressId);
      await loadAddresses();
    } catch (error) {
      console.error("Error deleting address:", error);
      alert("Có lỗi xảy ra khi xóa địa chỉ");
    }
  };

  const handleEditAddress = (address: Address) => {
    setEditingAddress(address);
    setIsAddressModalOpen(true);
  };

  const handleAddNewAddress = () => {
    setEditingAddress(null);
    setIsAddressModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-muted-foreground">Đang tải...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">Bạn chưa đăng nhập</p>
            <Link href="/login">
              <Button>Đăng nhập ngay</Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
                {/* User Info */}
                <div className="text-center mb-6">
                  {(userProfile?.avatarUrl || user?.avatar) ? (
                    <div className="w-16 h-16 rounded-full overflow-hidden mx-auto mb-3 border-2 border-primary">
                      <Image
                        src={userProfile?.avatarUrl || user?.avatar || ""}
                        alt={userProfile?.fullName || user?.fullName || "Avatar"}
                        width={64}
                        height={64}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">
                      {(
                        userProfile?.fullName?.charAt(0) ||
                        user.fullName?.charAt(0) ||
                        userProfile?.email?.charAt(0) ||
                        user.email?.charAt(0) ||
                        "?"
                      ).toUpperCase()}
                    </div>
                  )}
                  <h2 className="font-bold text-foreground">
                    {userProfile?.fullName || user.fullName || "Khách hàng BookSphere"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {userProfile?.email || user.email || "Không có email"}
                  </p>
                  {userProfile?.membershipTier && (
                    <p className="text-xs text-primary mt-1 font-medium">
                      {userProfile.membershipTier}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {(userProfile?.points ?? 0).toLocaleString("vi-VN")} điểm
                  </p>
                </div>

                {/* Menu */}
                <nav className="space-y-2 mb-6">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                      activeTab === "profile"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <User size={18} />
                    Thông tin cá nhân
                  </button>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                      activeTab === "orders"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <ShoppingBag size={18} />
                    Đơn hàng
                  </button>
                  <button
                    onClick={() => setActiveTab("wishlist")}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                      activeTab === "wishlist"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <Heart size={18} />
                    Danh sách yêu thích
                  </button>
                  <button
                    onClick={() => setActiveTab("addresses")}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                      activeTab === "addresses"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <MapPin size={18} />
                    Địa chỉ của tôi
                  </button>
                  <button
                    onClick={() => setActiveTab("settings")}
                    className={`w-full text-left px-4 py-2 rounded-lg flex items-center gap-2 transition ${
                      activeTab === "settings"
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-muted text-foreground"
                    }`}
                  >
                    <Settings size={18} />
                    Cài đặt
                  </button>
                </nav>

                <Button
                  variant="outline"
                  className="w-full bg-transparent"
                  onClick={handleLogout}
                >
                  <LogOut size={18} className="mr-2" />
                  Đăng xuất
                </Button>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              {activeTab === "profile" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Thông tin cá nhân
                  </h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Tên đăng nhập
                        </label>
                        <p className="text-foreground font-medium">
                          {userProfile?.username || user.username || "N/A"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Họ và tên
                        </label>
                        <p className="text-foreground font-medium">
                          {userProfile?.fullName || user.fullName || "Chưa cập nhật"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Email
                        </label>
                        <div className="flex items-center gap-3">
                          <p className="text-foreground font-medium">
                            {userProfile?.email || user.email}
                          </p>
                          {(userProfile?.email || user?.email) && (
                            <EmailVerification
                              email={userProfile?.email || user.email || ""}
                              isVerified={localEmailVerified}
                            />
                          )}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Số điện thoại
                        </label>
                        <p className="text-foreground font-medium">
                          {userProfile?.phoneNumber || user.phone || "Chưa cập nhật"}
                        </p>
                      </div>
                      {userProfile?.dateOfBirth && (
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Ngày sinh
                          </label>
                          <p className="text-foreground font-medium">
                            {new Date(userProfile.dateOfBirth).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Giới tính
                        </label>
                        <p className="text-foreground font-medium">
                          {userProfile?.gender 
                            ? (userProfile.gender === "MALE" ? "Nam" : userProfile.gender === "FEMALE" ? "Nữ" : "Khác")
                            : "Chưa cập nhật"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Hạng thành viên
                        </label>
                        <p className="text-foreground font-medium">
                          {userProfile?.membershipTier || "Chưa có"}
                        </p>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-muted-foreground mb-1">
                          Điểm tích lũy
                        </label>
                        <p className="text-foreground font-medium">
                          {(userProfile?.points ?? 0).toLocaleString("vi-VN")} điểm
                        </p>
                      </div>
                      {userProfile?.lastLogin && (
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Lần đăng nhập cuối
                          </label>
                          <p className="text-foreground font-medium">
                            {new Date(userProfile.lastLogin).toLocaleString("vi-VN")}
                          </p>
                        </div>
                      )}
                      {user?.createdAt && (
                        <div>
                          <label className="block text-sm font-medium text-muted-foreground mb-1">
                            Ngày tạo tài khoản
                          </label>
                          <p className="text-foreground font-medium">
                            {new Date(user.createdAt).toLocaleDateString("vi-VN")}
                          </p>
                        </div>
                      )}
                    </div>
                    <Button className="mt-4">Chỉnh sửa thông tin</Button>
                  </div>
                </div>
              )}

              {activeTab === "orders" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Đơn hàng của tôi
                  </h2>
                  <div className="text-center py-12">
                    <ShoppingBag
                      size={48}
                      className="mx-auto text-muted-foreground mb-4 opacity-50"
                    />
                    <p className="text-muted-foreground">
                      Chưa có đơn hàng nào
                    </p>
                  </div>
                </div>
              )}

              {activeTab === "wishlist" && <WishlistSection />}

              {activeTab === "addresses" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-foreground">
                      Địa chỉ của tôi
                    </h2>
                    <Button onClick={handleAddNewAddress}>
                      <MapPin size={18} className="mr-2" />
                      Thêm địa chỉ mới
                    </Button>
                  </div>
                  
                  {addressesLoading ? (
                    <div className="text-center py-12">
                      <p className="text-muted-foreground">Đang tải...</p>
                    </div>
                  ) : addresses.length === 0 ? (
                    <div className="text-center py-12">
                      <MapPin
                        size={48}
                        className="mx-auto text-muted-foreground mb-4 opacity-50"
                      />
                      <p className="text-muted-foreground">
                        Chưa có địa chỉ nào
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {addresses.map((address) => (
                        <div
                          key={address.id}
                          className="border border-border rounded-lg p-4 hover:border-primary transition"
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <h3 className="font-semibold text-foreground mb-1">
                                {address.recipientName}
                              </h3>
                              <p className="text-sm text-muted-foreground">
                                {address.phoneNumber}
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                className="text-muted-foreground hover:text-primary transition"
                                onClick={() => handleEditAddress(address)}
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                className="text-muted-foreground hover:text-destructive transition"
                                onClick={() => handleDeleteAddress(address.id)}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </div>
                          <p className="text-sm text-foreground">
                            {address.street}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.ward}, {address.district}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {address.province}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="bg-card border border-border rounded-lg p-6">
                  <h2 className="text-2xl font-bold text-foreground mb-6">
                    Cài đặt
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">
                          Thông báo email
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Nhận thông báo về đơn hàng và khuyến mãi
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        defaultChecked
                        className="w-5 h-5"
                      />
                    </div>
                    <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">Nhận SMS</p>
                        <p className="text-sm text-muted-foreground">
                          Nhận thông báo qua SMS
                        </p>
                      </div>
                      <input type="checkbox" className="w-5 h-5" />
                    </div>
                    <Button className="mt-4">Lưu thay đổi</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />

      {/* Address Modal */}
      <AddressSelectModal
        isOpen={isAddressModalOpen}
        onClose={() => {
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
        addresses={addresses}
        onSelectAddress={() => {}}
        onAddressCreated={() => {
          loadAddresses();
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
        editingAddress={editingAddress}
        onAddressUpdated={() => {
          loadAddresses();
          setIsAddressModalOpen(false);
          setEditingAddress(null);
        }}
      />
    </div>
  );
}
