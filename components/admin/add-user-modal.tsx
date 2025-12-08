"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { ImageUpload } from "@/components/ui/image-upload"
import { UserPlus, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { usersService } from "@/lib/services/users.service"

export interface CreateUserData {
    username: string
    password: string
    email: string
    fullName: string
    phoneNumber: string
    gender: string
    dateOfBirth: string
    role: string
    avatarUrl?: string
}

interface AddUserModalProps {
    isOpen: boolean
    onClose: () => void
    onSubmit: (userData: CreateUserData) => Promise<void>
}

export function AddUserModal({ isOpen, onClose, onSubmit }: AddUserModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isUploadingAvatar, setIsUploadingAvatar] = useState(false)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [formData, setFormData] = useState<CreateUserData>({
        username: "",
        password: "",
        email: "",
        fullName: "",
        phoneNumber: "",
        gender: "Other",
        dateOfBirth: "",
        role: "CUSTOMER",
        avatarUrl: "",
    })

    const [errors, setErrors] = useState<Partial<Record<keyof CreateUserData, string>>>({})

    // Reset form when modal opens/closes
    useEffect(() => {
        if (isOpen) {
            setFormData({
                username: "",
                password: "",
                email: "",
                fullName: "",
                phoneNumber: "",
                gender: "Other",
                dateOfBirth: "",
                role: "CUSTOMER",
                avatarUrl: "",
            })
            setErrors({})
            setAvatarFile(null)
            setIsUploadingAvatar(false)
        }
    }, [isOpen])

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof CreateUserData, string>> = {}

        // Username validation
        if (!formData.username.trim()) {
            newErrors.username = "Tên đăng nhập là bắt buộc"
        } else if (formData.username.length < 3 || formData.username.length > 50) {
            newErrors.username = "Tên đăng nhập phải từ 3-50 ký tự"
        } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
            newErrors.username = "Chỉ được chứa chữ cái, số và dấu gạch dưới"
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = "Mật khẩu là bắt buộc"
        } else if (formData.password.length < 6) {
            newErrors.password = "Mật khẩu phải có ít nhất 6 ký tự"
        }

        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = "Email là bắt buộc"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Email không hợp lệ"
        }

        // Full name validation
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Họ tên là bắt buộc"
        }

        // Phone number validation
        if (formData.phoneNumber && !/^(\+84|0)[0-9]{9}$/.test(formData.phoneNumber)) {
            newErrors.phoneNumber = "Số điện thoại không hợp lệ (VD: 0912345678)"
        }

        // Date of birth validation (optional but if provided, must be valid)
        if (formData.dateOfBirth) {
            const dob = new Date(formData.dateOfBirth)
            const today = new Date()
            if (dob > today) {
                newErrors.dateOfBirth = "Ngày sinh không được là ngày tương lai"
            }
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleInputChange = (field: keyof CreateUserData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }))
        }
    }

    const handleAvatarFileSelect = (file: File) => {
        setAvatarFile(file)
    }

    const handleSubmit = async () => {
        if (!validateForm()) return

        setIsSubmitting(true)
        try {
            // Upload avatar first if selected
            let avatarUrl = formData.avatarUrl

            if (avatarFile) {
                setIsUploadingAvatar(true)

                try {
                    avatarUrl = await usersService.uploadAvatar(avatarFile)
                } catch (error: any) {
                    toast.error(error.message || "Không thể upload ảnh")
                    setIsSubmitting(false)
                    setIsUploadingAvatar(false)
                    return
                } finally {
                    setIsUploadingAvatar(false)
                }
            }

            // Submit form with avatar URL
            await onSubmit({
                ...formData,
                avatarUrl: avatarUrl
            })

            // Only close if successful (onSubmit will throw if error)
            onClose()
        } catch (error: any) {
            // Parse error from Backend API
            let errorMessage = error.response?.data?.message || error.message

            // Translate English errors to Vietnamese
            if (errorMessage?.toLowerCase().includes('username') && errorMessage?.toLowerCase().includes('exist')) {
                errorMessage = "Tên đăng nhập đã tồn tại"
                setErrors(prev => ({ ...prev, username: errorMessage }))
            } else if (errorMessage?.toLowerCase().includes('email') && errorMessage?.toLowerCase().includes('exist')) {
                errorMessage = "Email đã tồn tại"
                setErrors(prev => ({ ...prev, email: errorMessage }))
            } else if (errorMessage?.toLowerCase().includes('tên đăng nhập')) {
                setErrors(prev => ({ ...prev, username: errorMessage }))
            } else if (errorMessage?.toLowerCase().includes('email')) {
                setErrors(prev => ({ ...prev, email: errorMessage }))
            }

            // Re-throw to let parent handle toast
            throw error
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-xl">
                        <UserPlus className="h-5 w-5" />
                        Thêm người dùng mới
                    </DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                    {/* Row 1: Username & Password */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="flex items-center gap-1">
                                Tên đăng nhập <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="username"
                                value={formData.username}
                                onChange={(e) => handleInputChange("username", e.target.value)}
                                placeholder="VD: nguyenvana"
                                className={errors.username ? "border-red-500" : ""}
                                disabled={isSubmitting}
                            />
                            {errors.username && (
                                <p className="text-xs text-red-500">{errors.username}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="flex items-center gap-1">
                                Mật khẩu <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                placeholder="Tối thiểu 6 ký tự"
                                className={errors.password ? "border-red-500" : ""}
                                disabled={isSubmitting}
                            />
                            {errors.password && (
                                <p className="text-xs text-red-500">{errors.password}</p>
                            )}
                        </div>
                    </div>

                    {/* Row 2: Full Name & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="fullName" className="flex items-center gap-1">
                                Họ và tên <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="fullName"
                                value={formData.fullName}
                                onChange={(e) => handleInputChange("fullName", e.target.value)}
                                placeholder="VD: Nguyễn Văn A"
                                className={errors.fullName ? "border-red-500" : ""}
                                disabled={isSubmitting}
                            />
                            {errors.fullName && (
                                <p className="text-xs text-red-500">{errors.fullName}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-1">
                                Email <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                placeholder="VD: nguyenvana@example.com"
                                className={errors.email ? "border-red-500" : ""}
                                disabled={isSubmitting}
                            />
                            {errors.email && (
                                <p className="text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Row 3: Phone & Date of Birth */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="phoneNumber">Số điện thoại</Label>
                            <Input
                                id="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                                placeholder="VD: 0912345678"
                                className={errors.phoneNumber ? "border-red-500" : ""}
                                disabled={isSubmitting}
                            />
                            {errors.phoneNumber && (
                                <p className="text-xs text-red-500">{errors.phoneNumber}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                            <Input
                                id="dateOfBirth"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                                className={errors.dateOfBirth ? "border-red-500" : ""}
                                disabled={isSubmitting}
                            />
                            {errors.dateOfBirth && (
                                <p className="text-xs text-red-500">{errors.dateOfBirth}</p>
                            )}
                        </div>
                    </div>

                    {/* Row 4: Gender & Role */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="gender">Giới tính</Label>
                            <Select
                                value={formData.gender}
                                onValueChange={(value) => handleInputChange("gender", value)}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn giới tính" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Male">Nam</SelectItem>
                                    <SelectItem value="Female">Nữ</SelectItem>
                                    <SelectItem value="Other">Khác</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="role" className="flex items-center gap-1">
                                Vai trò <span className="text-red-500">*</span>
                            </Label>
                            <Select
                                value={formData.role}
                                onValueChange={(value) => handleInputChange("role", value)}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Chọn vai trò" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="GUEST">Khách</SelectItem>
                                    <SelectItem value="CUSTOMER">Khách hàng</SelectItem>
                                    <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Row 5: Avatar Upload */}
                    <div className="space-y-2">
                        <Label>Ảnh đại diện</Label>
                        <ImageUpload
                            value={formData.avatarUrl}
                            onChange={(url) => handleInputChange("avatarUrl", url)}
                            onFileSelect={handleAvatarFileSelect}
                            disabled={isSubmitting || isUploadingAvatar}
                        />
                        {isUploadingAvatar && (
                            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Đang upload ảnh...</span>
                            </div>
                        )}
                    </div>

                    {/* Required fields note */}
                    <p className="text-xs text-muted-foreground">
                        <span className="text-red-500">*</span> Trường bắt buộc
                    </p>
                </div>

                <DialogFooter className="gap-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Hủy
                    </Button>
                    <Button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isSubmitting || isUploadingAvatar}
                        className="min-w-[100px]"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {isUploadingAvatar ? "Đang upload..." : "Đang thêm..."}
                            </>
                        ) : (
                            <>
                                <UserPlus className="mr-2 h-4 w-4" />
                                Thêm người dùng
                            </>
                        )}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
