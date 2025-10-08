import { useState } from "react";
import { ArrowLeft, Lock, User, Eye, EyeOff, Shield, CheckCircle } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Checkbox } from "../ui/checkbox";
import { ImageWithFallback } from "../image/ImageWithFallback";
import { motion } from "motion/react";
import logoImage from "@/assets/logo_dut.png";
import campusAerialImage from "@/assets/pic.jpg";
import campus50YearsImage from "@/assets/logo2.jpg";

interface LoginPageProps {
  onLogin: () => void;
  onBack: () => void;
}

export function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username && password) {
      onLogin();
    }
  };

  const securityFeatures = [
    "Mã hóa dữ liệu 256-bit",
    "Xác thực hai yếu tố",
    "Giám sát hoạt động 24/7",
  ];

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md">
          <Button
            variant="ghost"
            onClick={onBack}
            className="mb-8 rounded-xl"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Quay lại trang chủ
          </Button>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Logo & Title */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 flex items-center justify-center bg-white rounded-2xl shadow-lg p-2">
                  <img src={logoImage.src} alt="Logo DUT" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h1 className="text-3xl text-gray-900">Đăng nhập</h1>
                  <p className="text-muted-foreground">Hệ thống Quản lý Hợp tác Quốc tế</p>
                </div>
              </div>
              <div className="h-1 w-20 bg-gradient-to-r from-blue-600 to-blue-400 rounded-full"></div>
            </div>

            {/* Welcome Message */}
            <div className="mb-8 p-6 bg-blue-50 rounded-2xl border border-blue-100">
              <p className="text-sm text-blue-900">
                Chào mừng bạn đến với hệ thống quản lý hợp tác quốc tế của Đại học Bách khoa Đà Nẵng. 
                Vui lòng đăng nhập để tiếp tục.
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="username" className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  Tên đăng nhập
                </Label>
                <Input
                  id="username"
                  placeholder="Nhập tên đăng nhập của bạn"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="rounded-xl h-12 px-4"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Mật khẩu
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu của bạn"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="rounded-xl h-12 px-4 pr-12"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <Label htmlFor="remember" className="cursor-pointer text-sm">
                    Ghi nhớ đăng nhập
                  </Label>
                </div>
                <Button variant="link" type="button" className="text-blue-600 p-0 h-auto">
                  Quên mật khẩu?
                </Button>
              </div>

              <Button
                type="submit"
                className="w-full rounded-xl h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                size="lg"
              >
                Đăng nhập
              </Button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-muted-foreground">Hoặc liên hệ hỗ trợ</span>
              </div>
            </div>

            {/* Support Info */}
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                Cần hỗ trợ? Liên hệ quản trị viên
              </p>
              <p className="text-sm">
                <a href="mailto:international@dut.udn.vn" className="text-blue-600 hover:underline">
                  international@dut.udn.vn
                </a>
                {" | "}
                <a href="tel:+842363736825" className="text-blue-600 hover:underline">
                  (+84) 236 3736 825
                </a>
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Side - Visual & Info */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-600 via-blue-700 to-blue-900 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0">
          <img
            src={campusAerialImage.src}
            alt="Campus DUT"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 via-blue-700/90 to-blue-900/90"></div>
        </div>

        <div className="relative z-10 flex flex-col justify-between p-12 text-white">
          <div>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white rounded-2xl p-2 shadow-lg">
                <img src={logoImage.src} alt="Logo DUT" className="w-full h-full object-contain" />
              </div>
              <div>
                <h2 className="text-3xl">
                  Đại học Bách khoa Đà Nẵng
                </h2>
                <p className="text-lg text-blue-100">
                  Da Nang University of Science and Technology
                </p>
              </div>
            </div>
            <div className="h-1 w-32 bg-white/30 rounded-full mb-6"></div>
            <p className="text-xl text-blue-100">
              Phòng Khoa học Công nghệ và Đối ngoại
            </p>
          </div>

          <div className="space-y-8">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-center"
              >
                <div className="text-4xl mb-2">120+</div>
                <div className="text-sm text-blue-200">Thỏa thuận hợp tác</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="text-4xl mb-2">50+</div>
                <div className="text-sm text-blue-200">Đối tác quốc tế</div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center"
              >
                <div className="text-4xl mb-2">300+</div>
                <div className="text-sm text-blue-200">Sinh viên quốc tế</div>
              </motion.div>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-xl mb-4">Bảo mật & An toàn</h3>
              {securityFeatures.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className="flex items-center gap-3"
                >
                  <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <span className="text-blue-50">{feature}</span>
                </motion.div>
              ))}
            </div>

            {/* Security Badge */}
            <div className="flex items-center gap-3 p-4 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20">
              <Shield className="w-8 h-8 text-blue-200" />
              <div>
                <p className="text-sm">Hệ thống được bảo mật</p>
                <p className="text-xs text-blue-200">Tuân thủ tiêu chuẩn ISO 27001</p>
              </div>
            </div>

            {/* Campus Image Showcase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="mt-6 rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl"
            >
              <img
                src={campus50YearsImage.src}
                alt="50 năm thành lập"
                className="w-full h-48 object-cover"
              />
            </motion.div>
          </div>

          <div className="space-y-2">
            <div className="text-sm text-blue-200">
              © 2025 Đại học Bách khoa Đà Nẵng. Tất cả quyền được bảo lưu.
            </div>
            <div className="text-xs text-blue-300">
              54 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
