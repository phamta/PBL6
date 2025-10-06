"use client";
import { useState, useEffect } from "react";
import { 
  FileText, 
  Users, 
  GraduationCap, 
  Languages, 
  Globe, 
  Shield,
  CheckCircle,
  ArrowRight,
  Mail,
  Phone,
  MapPin,
  Award,
  BarChart3,
  Clock,
  Zap,
  TrendingUp,
  Target,
  Lightbulb,
  BookOpen,
  Briefcase,
  ChevronRight,
  Star,
  Play
} from "lucide-react";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { ImageWithFallback } from "./image/ImageWithFallback";
import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import logoImage from "@/assets/logo_dut.png";
import campusAerialImage from "@/assets/pic.png";
import campus50YearsImage from "@/assets/logo2.png";

interface EnhancedLandingPageProps {
  onLoginClick: () => void;
}

export function EnhancedLandingPage({ onLoginClick }: EnhancedLandingPageProps) {
  const [currentStat, setCurrentStat] = useState(0);

  // Animated counter for statistics
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: FileText,
      title: "Quản lý Văn bản MOU/MOA",
      description: "Số hóa quy trình đề xuất, phê duyệt và quản lý các văn bản hợp tác quốc tế. Theo dõi tiến trình xử lý real-time với thông báo tự động.",
      color: "blue",
      stats: "120+ văn bản/năm",
    },
    {
      icon: Users,
      title: "Quản lý Đoàn Khách Quốc tế",
      description: "Đăng ký, lưu trữ thông tin chi tiết về đoàn khách. Tạo báo cáo tự động, xuất giấy mời và các tài liệu cần thiết chỉ trong vài phút.",
      color: "green",
      stats: "200+ đoàn khách/năm",
    },
    {
      icon: GraduationCap,
      title: "Quản lý Du học sinh & Visa",
      description: "Theo dõi thông tin sinh viên, giảng viên quốc tế. Cảnh báo tự động visa sắp hết hạn. Hỗ trợ làm thủ tục gia hạn và cấp giấy NA5/NA6.",
      color: "purple",
      stats: "300+ du học sinh",
    },
    {
      icon: Languages,
      title: "Xác nhận Dịch thuật",
      description: "Quản lý yêu cầu xác nhận dịch thuật các văn bản hợp tác. Lưu trữ có hệ thống theo năm, đối tác và đơn vị. Xuất giấy xác nhận nhanh chóng.",
      color: "orange",
      stats: "500+ tài liệu/năm",
    },
  ];

  const benefits = [
    {
      icon: Zap,
      title: "Tăng hiệu suất 300%",
      description: "Tự động hóa quy trình giúp tiết kiệm thời gian xử lý văn bản từ 3-5 ngày xuống còn 1 ngày",
    },
    {
      icon: Shield,
      title: "Bảo mật tuyệt đối",
      description: "Mã hóa dữ liệu 256-bit, phân quyền chặt chẽ, log hoạt động chi tiết đảm bảo an toàn thông tin",
    },
    {
      icon: BarChart3,
      title: "Báo cáo trực quan",
      description: "Dashboard thống kê realtime, biểu đồ phân tích đa chiều, xuất báo cáo tự động theo yêu cầu",
    },
    {
      icon: Clock,
      title: "Tiết kiệm thời gian",
      description: "Giảm 70% thời gian làm việc giấy tờ, tìm kiếm thông tin nhanh chóng với công cụ search mạnh mẽ",
    },
    {
      icon: Target,
      title: "Quản lý tập trung",
      description: "Tất cả thông tin hợp tác quốc tế ở một nơi, dễ dàng truy cập mọi lúc mọi nơi",
    },
    {
      icon: TrendingUp,
      title: "Nâng cao chuyên nghiệp",
      description: "Tạo ấn tượng tốt với đối tác quốc tế nhờ quy trình làm việc hiện đại, chuyên nghiệp",
    },
  ];

  const stats = [
    { number: "120+", label: "Thỏa thuận hợp tác", icon: FileText },
    { number: "50+", label: "Đối tác quốc tế", icon: Globe },
    { number: "300+", label: "Du học sinh", icon: GraduationCap },
    { number: "500+", label: "Văn bản dịch thuật", icon: Languages },
  ];

  const testimonials = [
    {
      name: "TS. Nguyễn Văn A",
      position: "Trưởng Phòng Đối ngoại",
      quote: "Hệ thống đã giúp phòng chúng tôi tăng hiệu suất làm việc gấp 3 lần. Quản lý văn bản chưa bao giờ dễ dàng đến thế!",
      avatar: "NVA",
    },
    {
      name: "PGS.TS. Trần Thị B",
      position: "Phó Hiệu trưởng",
      quote: "Báo cáo thống kê trực quan, dữ liệu luôn cập nhật. Đây là công cụ không thể thiếu cho công tác hợp tác quốc tế.",
      avatar: "TTB",
    },
    {
      name: "ThS. Lê Văn C",
      position: "Cán bộ phụ trách Du học sinh",
      quote: "Tính năng cảnh báo visa hết hạn rất hữu ích. Không còn lo sót hồ sơ hay quên deadline nữa!",
      avatar: "LVC",
    },
  ];

  const processes = [
    {
      step: "01",
      title: "Đăng nhập hệ thống",
      description: "Sử dụng tài khoản cơ quan được cấp để truy cập",
    },
    {
      step: "02",
      title: "Nhập thông tin",
      description: "Điền form với thông tin chi tiết về văn bản, đoàn khách hoặc sinh viên",
    },
    {
      step: "03",
      title: "Gửi phê duyệt",
      description: "Hệ thống tự động gửi thông báo đến người phụ trách",
    },
    {
      step: "04",
      title: "Theo dõi tiến trình",
      description: "Nhận thông báo realtime về tình trạng xử lý",
    },
  ];

  const faqs = [
    {
      q: "Ai có thể sử dụng hệ thống này?",
      a: "Tất cả cán bộ, giảng viên của Đại học Bách khoa Đà Nẵng có liên quan đến công tác hợp tác quốc tế đều có thể đăng ký tài khoản sử dụng.",
    },
    {
      q: "Làm thế nào để lấy tài khoản đăng nhập?",
      a: "Vui lòng liên hệ Phòng Khoa học Công nghệ và Đối ngoại qua email international@dut.udn.vn hoặc số điện thoại (0236) 3736 825 để được cấp tài khoản.",
    },
    {
      q: "Hệ thống có hỗ trợ xuất báo cáo không?",
      a: "Có, hệ thống hỗ trợ xuất báo cáo tự động theo nhiều tiêu chí khác nhau dưới định dạng PDF và Excel.",
    },
    {
      q: "Dữ liệu có được bảo mật không?",
      a: "Hệ thống sử dụng mã hóa 256-bit, phân quyền chi tiết và được giám sát 24/7 để đảm bảo an toàn tuyệt đối cho dữ liệu.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Floating Header */}
      <motion.header 
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-100"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-4">
              <motion.div 
                className="w-14 h-14 flex items-center justify-center"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <img src={logoImage.src} alt="Logo DUT" className="w-full h-full object-contain" />
              </motion.div>
              <div>
                <h1 className="text-blue-900">ĐH Bách khoa Đà Nẵng</h1>
                <p className="text-sm text-muted-foreground">Phòng KH-CN & Đối ngoại</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <nav className="hidden md:flex items-center gap-6 mr-6">
                <a href="#features" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                  Tính năng
                </a>
                <a href="#benefits" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                  Lợi ích
                </a>
                <a href="#process" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                  Quy trình
                </a>
                <a href="#faq" className="text-sm text-muted-foreground hover:text-blue-600 transition-colors">
                  FAQ
                </a>
              </nav>
              <Button 
                onClick={onLoginClick}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30"
              >
                Đăng nhập
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section - Enhanced */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-blue-300 rounded-full blur-3xl opacity-20"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-purple-300 rounded-full blur-3xl opacity-20"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Badge className="mb-6 rounded-full px-4 py-2 bg-blue-100 text-blue-700 border-blue-200">
                <Lightbulb className="w-4 h-4 mr-2" />
                Giải pháp Quản lý Hợp tác Quốc tế Thông minh
              </Badge>
              
              <h1 className="text-6xl mb-6 text-gray-900 leading-tight">
                Số hóa Toàn diện<br />
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Hợp tác Quốc tế
                </span>
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Nền tảng quản lý thông minh giúp tối ưu hóa quy trình làm việc, 
                tiết kiệm thời gian và nâng cao hiệu quả công tác hợp tác quốc tế 
                tại Đại học Bách khoa Đà Nẵng.
              </p>

              <div className="flex flex-wrap gap-4 mb-12">
                <Button 
                  size="lg"
                  onClick={onLoginClick}
                  className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30"
                >
                  Bắt đầu ngay
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="rounded-xl border-2 border-blue-200 hover:bg-blue-50"
                >
                  <Play className="w-5 h-5 mr-2" />
                  Xem video giới thiệu
                </Button>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-3 gap-6">
                {stats.slice(0, 3).map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="text-center"
                  >
                    <div className="text-3xl text-blue-600 mb-1">{stat.number}</div>
                    <div className="text-sm text-gray-600">{stat.label}</div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-20"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                  <img
                    src={campusAerialImage.src}
                    alt="Campus ĐH Bách khoa Đà Nẵng"
                    className="w-full h-[500px] object-cover"
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                    <p className="text-white text-sm">Khuôn viên Đại học Bách khoa Đà Nẵng</p>
                    <p className="text-white/80 text-xs mt-1">54 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng</p>
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -bottom-6 -left-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tỷ lệ hài lòng</p>
                    <p className="text-xl text-green-600">98%</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                    <Award className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Hơn 50 năm</p>
                    <p className="text-lg text-blue-600">Uy tín</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 rounded-full px-4 py-2 bg-purple-100 text-purple-700 border-purple-200">
              Chức năng toàn diện
            </Badge>
            <h2 className="text-5xl mb-4 text-gray-900">
              Giải pháp <span className="text-blue-600">4 trong 1</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Tất cả công cụ bạn cần để quản lý hiệu quả mọi hoạt động hợp tác quốc tế, 
              từ văn bản đến con người
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const colorClasses = {
                blue: "from-blue-500 to-blue-600",
                green: "from-green-500 to-green-600",
                purple: "from-purple-500 to-purple-600",
                orange: "from-orange-500 to-orange-600",
              };

              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="rounded-3xl shadow-lg border-gray-100 hover:shadow-2xl transition-all duration-300 h-full overflow-hidden group">
                    <CardContent className="p-8">
                      <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${colorClasses[feature.color as keyof typeof colorClasses]} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <Badge variant="outline" className="mb-4 rounded-full">
                        {feature.stats}
                      </Badge>
                      <h3 className="mb-4 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 leading-relaxed mb-4">
                        {feature.description}
                      </p>
                      <Button variant="link" className="p-0 h-auto text-blue-600 group-hover:gap-2 transition-all">
                        Tìm hiểu thêm
                        <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits Section - Enhanced */}
      <section id="benefits" className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 rounded-full px-4 py-2 bg-orange-100 text-orange-700 border-orange-200">
              Lợi ích vượt trội
            </Badge>
            <h2 className="text-5xl mb-4 text-gray-900">
              Tại sao chọn <span className="text-blue-600">hệ thống của chúng tôi?</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Được phát triển dựa trên nhu cầu thực tế và phản hồi từ hàng trăm cán bộ
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="rounded-2xl shadow-sm border-gray-100 hover:shadow-xl transition-shadow h-full bg-white">
                  <CardContent className="p-6">
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mb-4">
                      <benefit.icon className="w-7 h-7 text-blue-600" />
                    </div>
                    <h3 className="mb-3 text-gray-900">{benefit.title}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {benefit.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section id="process" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 rounded-full px-4 py-2 bg-green-100 text-green-700 border-green-200">
              Quy trình đơn giản
            </Badge>
            <h2 className="text-5xl mb-4 text-gray-900">
              Bắt đầu chỉ với <span className="text-blue-600">4 bước</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {processes.map((process, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
                className="relative"
              >
                {index < processes.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-gradient-to-r from-blue-600 to-blue-300 -z-10"></div>
                )}
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white text-3xl mx-auto mb-4 shadow-lg">
                    {process.step}
                  </div>
                  <h3 className="mb-2 text-gray-900">{process.title}</h3>
                  <p className="text-sm text-gray-600">{process.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Showcase Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Badge className="mb-4 rounded-full px-4 py-2 bg-blue-100 text-blue-700 border-blue-200">
                50+ năm phát triển
              </Badge>
              <h2 className="text-5xl mb-6 text-gray-900">
                Đại học <span className="text-blue-600">Bách khoa Đà Nẵng</span>
              </h2>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                Được thành lập từ năm 1975, Đại học Bách khoa Đà Nẵng là một trong những cơ sở 
                giáo dục đại học kỹ thuật hàng đầu khu vực miền Trung - Tây Nguyên.
              </p>
              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">Đào tạo chất lượng cao</h4>
                    <p className="text-sm text-gray-600">
                      Chương trình đào tạo tiên tiến, đội ngũ giảng viên giàu kinh nghiệm
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">Hợp tác quốc tế rộng khắp</h4>
                    <p className="text-sm text-gray-600">
                      Liên kết với 50+ đối tác từ Mỹ, Nhật, Hàn Quốc, châu Âu
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="text-gray-900 mb-1">Cơ sở vật chất hiện đại</h4>
                    <p className="text-sm text-gray-600">
                      Phòng lab tiêu chuẩn quốc tế, thư viện điện tử phong phú
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
                <img
                  src={campus50YearsImage.src}
                  alt="50 năm thành lập ĐH Bách khoa Đà Nẵng"
                  className="w-full h-[500px] object-cover"
                />
              </div>
              {/* Anniversary Badge */}
              <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl shadow-xl">
                <p className="text-center">
                  <span className="text-3xl block mb-1">1975 - 2025</span>
                  <span className="text-sm text-blue-100">50 Năm Xây dựng và Phát triển</span>
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-blue-800 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <img
            src={campusAerialImage.src}
            alt="Background"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-16 text-white">
            <Badge className="mb-4 rounded-full px-4 py-2 bg-white/20 text-white border-white/30">
              Phản hồi từ người dùng
            </Badge>
            <h2 className="text-5xl mb-4">
              Họ nói gì về <span className="text-blue-200">hệ thống?</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15 }}
              >
                <Card className="rounded-2xl shadow-xl border-0 bg-white/10 backdrop-blur-lg h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-white mb-6 leading-relaxed italic">
                      "{testimonial.quote}"
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-blue-400 flex items-center justify-center text-white">
                        {testimonial.avatar}
                      </div>
                      <div>
                        <p className="text-white">{testimonial.name}</p>
                        <p className="text-sm text-blue-200">{testimonial.position}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge className="mb-4 rounded-full px-4 py-2 bg-blue-100 text-blue-700 border-blue-200">
              Câu hỏi thường gặp
            </Badge>
            <h2 className="text-5xl mb-4 text-gray-900">FAQ</h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="rounded-2xl shadow-sm border-gray-100 hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="mb-3 text-gray-900 flex items-start gap-3">
                      <span className="text-blue-600 flex-shrink-0">Q:</span>
                      {faq.q}
                    </h3>
                    <p className="text-gray-600 leading-relaxed flex gap-3">
                      <span className="text-blue-600 flex-shrink-0">A:</span>
                      <span>{faq.a}</span>
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section - Enhanced */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-blue-100 rounded-full mb-6">
              <Zap className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700">Bắt đầu ngay hôm nay</span>
            </div>
            <h2 className="text-5xl mb-6 text-gray-900">
              Sẵn sàng <span className="text-blue-600">chuyển đổi số</span>?
            </h2>
            <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
              Tham gia cùng hàng trăm cán bộ đã sử dụng hệ thống để nâng cao hiệu quả công việc
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button 
                size="lg"
                onClick={onLoginClick}
                className="rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg shadow-blue-500/30 px-8 h-14"
              >
                Đăng nhập ngay
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                size="lg"
                variant="outline"
                className="rounded-xl border-2 border-blue-200 hover:bg-blue-50 px-8 h-14"
              >
                <Mail className="w-5 h-5 mr-2" />
                Liên hệ hỗ trợ
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer - Enhanced */}
      <footer className="bg-gray-900 text-gray-300 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 flex items-center justify-center">
                  <img src={logoImage.src} alt="Logo DUT" className="w-full h-full object-contain" />
                </div>
                <div>
                  <h3 className="text-white">Đại học Bách khoa Đà Nẵng</h3>
                  <p className="text-sm text-gray-400">Phòng Khoa học Công nghệ và Đối ngoại</p>
                </div>
              </div>
              <p className="text-sm text-gray-400 mb-6 max-w-md">
                Hệ thống quản lý hợp tác quốc tế hiện đại, giúp số hóa toàn diện 
                quy trình làm việc và nâng cao hiệu quả công tác đối ngoại.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" size="icon" className="rounded-xl border-gray-700 hover:bg-gray-800">
                  <Globe className="w-5 h-5" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-xl border-gray-700 hover:bg-gray-800">
                  <Mail className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-white mb-4">Liên kết nhanh</h3>
              <div className="space-y-3">
                <a href="#features" className="block text-sm hover:text-blue-400 transition-colors">Tính năng</a>
                <a href="#benefits" className="block text-sm hover:text-blue-400 transition-colors">Lợi ích</a>
                <a href="#process" className="block text-sm hover:text-blue-400 transition-colors">Quy trình</a>
                <a href="#faq" className="block text-sm hover:text-blue-400 transition-colors">FAQ</a>
              </div>
            </div>

            <div>
              <h3 className="text-white mb-4">Liên hệ</h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <span>54 Nguyễn Lương Bằng, Liên Chiểu, Đà Nẵng</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <span>(+84) 236 3736 825</span>
                </div>
                <div className="flex items-center gap-3 text-sm">
                  <Mail className="w-5 h-5 flex-shrink-0" />
                  <span>international@dut.udn.vn</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <p className="text-sm text-gray-400">
                © 2025 Đại học Bách khoa Đà Nẵng. Tất cả quyền được bảo lưu.
              </p>
              <div className="flex gap-6 text-sm">
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Chính sách bảo mật
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                  Điều khoản sử dụng
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
