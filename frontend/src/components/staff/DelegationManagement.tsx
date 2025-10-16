"use client";

import React from "react";
import FileUploadBox from "@/components/FileUploadBox";
import { useState, useEffect } from "react";
import { guestService, GuestWithRelations, CreateGuestDto, GuestMember } from "@/lib/api/guest.service";
import { partnerService, Partner } from "@/lib/api/partner.service";
import { unitService } from "@/lib/api/unit.service";
import { exportCongVanBaoCao } from "@/components/ExportCongVanGuest";
import { useAuth } from "@/contexts/AuthContext";
import {
  Users,
  Search,
  Plus,
  Edit,
  Trash,
  Download,
  Eye,
  FileText,
  Printer,
  MapPin,
  Calendar,
  Briefcase,
  Mail,
  Phone,
  Globe,
  Filter,
  Grid,
  List,
} from "lucide-react";
import { Card } from "../ui/card";
import { Alert, AlertDescription } from "../ui/alert";
import { AlertCircle } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { ScrollArea } from "../ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Breadcrumbs } from "../Breadcrumbs";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";


export function DelegationManagement() {
  const { user } = useAuth();
  const [selectedDelegation, setSelectedDelegation] = useState<GuestWithRelations | null>(null);
  const [isAddDelegationOpen, setIsAddDelegationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");
  const [statusFilter, setStatusFilter] = useState("all");
  const [delegations, setDelegations] = useState<GuestWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [members, setMembers] = useState<GuestMember[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [units, setUnits] = useState<{id: string, name: string, code: string}[]>([]);
  // Thêm validation state
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<Partial<CreateGuestDto>>({
    groupName: '',
    purpose: '',
    arrivalDate: '',
    departureDate: '',
    contactPerson: '',
    contactEmail: '',
    contactPhone: '',
    totalMembers: 0,
    notes: '',
    visitPurpose: '',
    hostDepartment: '',
    invitationLetterNo: '',
    partnerId: '',
    unitId: '',
  });

  const validateEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
  };

  // Helper function to format datetime for input
  const formatDateTimeForInput = (dateString: string | undefined) => {
    if (!dateString || dateString === '') return '';
    try {
      // If it's already in the correct format (YYYY-MM-DDTHH:mm), return as is
      if (dateString.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/)) {
        return dateString;
      }
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return '';
      return date.toISOString().slice(0, 16);
    } catch {
      return '';
    }
  };

  // Separate state for datetime inputs to ensure proper handling
  const [arrivalDateTime, setArrivalDateTime] = useState('');
  const [departureDateTime, setDepartureDateTime] = useState('');

  const loadDelegations = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await guestService.list();
      setDelegations(result.guests);
    } catch (err) {
      console.error('Error loading delegations:', err);
      setError('Không thể tải dữ liệu đoàn khách. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadDelegations();
  }, []);

  // Reset members when dialog closes
  React.useEffect(() => {
    if (!isAddDelegationOpen) {
      setMembers([]);
      setFormData({
        groupName: '',
        purpose: '',
        arrivalDate: '',
        departureDate: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        totalMembers: 0,
        notes: '',
        visitPurpose: '',
        hostDepartment: '',
        invitationLetterNo: '',
        partnerId: '',
        unitId: user?.unitId || '', // Set unitId from current user
      });
    }
  }, [isAddDelegationOpen, user]);

  // Validation function
  const validateForm = () => {
    const errors: {[key: string]: string} = {};

    // Validate delegation info
    if (!formData.groupName?.trim()) errors.groupName = "Tên đoàn là bắt buộc";
    if (!formData.purpose?.trim()) errors.purpose = "Mục đích là bắt buộc";
    if (!formData.arrivalDate) errors.arrivalDate = "Ngày đến là bắt buộc";
    if (!formData.departureDate) errors.departureDate = "Ngày đi là bắt buộc";

    // Validate arrival date is before departure date
    if (formData.arrivalDate && formData.departureDate) {
      const arrival = new Date(formData.arrivalDate);
      const departure = new Date(formData.departureDate);
      if (arrival >= departure) {
        errors.departureDate = "Ngày đi phải sau ngày đến";
      }
    }
    if (!formData.contactPerson?.trim()) errors.contactPerson = "Người liên hệ là bắt buộc";
    if (!formData.contactEmail?.trim()) errors.contactEmail = "Email liên hệ là bắt buộc";
    if (!formData.hostDepartment?.trim()) errors.hostDepartment = "Phòng ban chủ trì là bắt buộc";
    if (formData.contactEmail && !validateEmail(formData.contactEmail)) {
    errors.contactEmail = "Email không đúng định dạng";
    }
    // Validate members
    if (members.length === 0) {
      errors.members = "Phải có ít nhất 1 thành viên";
    } else {
      members.forEach((member, index) => {
        if (!member.title) errors[`member_${index}_title`] = "Danh xưng là bắt buộc";
        if (!member.fullName?.trim()) errors[`member_${index}_fullName`] = "Họ tên là bắt buộc";
        if (!member.dateOfBirth) errors[`member_${index}_dateOfBirth`] = "Ngày sinh là bắt buộc";
        if (!member.gender) errors[`member_${index}_gender`] = "Giới tính là bắt buộc";
        if (!member.nationality?.trim()) errors[`member_${index}_nationality`] = "Quốc tịch là bắt buộc";
        if (!member.passportNumber?.trim()) errors[`member_${index}_passportNumber`] = "Số hộ chiếu là bắt buộc";
        if (!member.position?.trim()) errors[`member_${index}_position`] = "Chức vụ là bắt buộc";
        if (!member.organization?.trim()) errors[`member_${index}_organization`] = "Cơ quan là bắt buộc";
        if (member.email && !validateEmail(member.email)) {
        errors[`member_${index}_email`] = "Email không đúng định dạng";
        }
      });
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const filteredDelegations = delegations.filter((delegation) => {
    // Filter by user's unit first
    const isUserUnit = user?.unitId && delegation.unitId === user.unitId;
    
    // Then apply search and status filters
    const matchesSearch =
      (delegation.groupName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      delegation.contactPerson.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delegation.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
      delegation.members.some(member => 
        member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.nationality.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.organization.toLowerCase().includes(searchQuery.toLowerCase())
      );
    const matchesStatus = statusFilter === "all" || delegation.status.toLowerCase() === statusFilter;
    
    return isUserUnit && matchesSearch && matchesStatus;
  });

  const handleExportReport = (format: "pdf" | "word") => {
    console.log(`Xuất báo cáo ${format.toUpperCase()}`);
  };

  const getStatusBadge = (status: string) => {
    const statusLower = status.toLowerCase();
    const variants: Record<string, { variant: "default" | "secondary" | "outline"; label: string }> = {
      registered: { variant: "secondary", label: "Đã đăng ký" },
      approved: { variant: "default", label: "Đã xác nhận" },
      arrived: { variant: "default", label: "Đã đến" },
      departed: { variant: "outline", label: "Đã về" },
      cancelled: { variant: "outline", label: "Đã hủy" },
    };
    const config = variants[statusLower] || { variant: "outline" as const, label: status };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const handleFile = (file: File | null, fieldName: string) => {
    console.log("File nhận được:", file, "for field:", fieldName);
    if (file) {
      // In a real scenario, upload file to server and get URL
      setFormData(prev => ({ ...prev, [fieldName]: file.name }));
    }
  };

  const handlePrint = async (delegation?: GuestWithRelations) => {
    const delegationToPrint = delegation || selectedDelegation;
    if (!delegationToPrint) return;
    
    try {
      await exportCongVanBaoCao(delegationToPrint);
    } catch (error) {
      console.error('Error printing cong van:', error);
      alert('Không thể tạo công văn. Vui lòng thử lại.');
    }
  };

  const updateMember = (index: number, field: keyof GuestMember, value: any) => {
    const newMembers = [...members];
    newMembers[index] = { ...newMembers[index], [field]: value };
    setMembers(newMembers);

    // Clear error for this field
    const errorKey = `member_${index}_${field}`;
    if (formErrors[errorKey]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[errorKey];
        return newErrors;
      });
    }
  };

  const addMember = () => {
    setMembers([...members, {
      title: '',
      fullName: '',
      dateOfBirth: '',
      gender: '',
      nationality: '',
      passportNumber: '',
      position: '',
      organization: '',
      email: '',
      phoneNumber: '',
      affiliation: '',
      passportFile: undefined,
    }]);
  };

  const removeMember = (index: number) => {
    if (members.length > 1) {
      const newMembers = members.filter((_, i) => i !== index);
      setMembers(newMembers);
    }
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      // Scroll to first error
      const firstError = Object.keys(formErrors)[0];
      const element = document.getElementById(firstError);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);
    try {
      const cleanMembers = members.map(({ id, ...member }) => member);
      const dataToSubmit: CreateGuestDto = {
        groupName: formData.groupName || '',
        purpose: formData.purpose || '',
        arrivalDate: formData.arrivalDate ? new Date(formData.arrivalDate).toISOString() : '',
        departureDate: formData.departureDate ? new Date(formData.departureDate).toISOString() : '',
        contactPerson: formData.contactPerson || '',
        contactEmail: formData.contactEmail || '',
        hostDepartment: formData.hostDepartment || '',
        members,
        totalMembers: members.length,
        unitId: user?.unitId || formData.unitId || '',
        contactPhone: formData.contactPhone,
        visitPurpose: formData.visitPurpose,
        invitationLetterNo: formData.invitationLetterNo,
        partnerId: formData.partnerId,
        notes: formData.notes,
      };

      await guestService.create(dataToSubmit);
      await loadDelegations();
      setIsAddDelegationOpen(false);

      // Reset form
      setFormData({
        groupName: '',
        purpose: '',
        arrivalDate: '',
        departureDate: '',
        contactPerson: '',
        contactEmail: '',
        contactPhone: '',
        totalMembers: 0,
        notes: '',
        visitPurpose: '',
        hostDepartment: '',
        invitationLetterNo: '',
        partnerId: '',
        unitId: user?.unitId || '',
      });
      setArrivalDateTime('');
      setDepartureDateTime('');
      setMembers([
        {
      
          title: '',
          fullName: '',
          dateOfBirth: '',
          gender: '',
          nationality: '',
          passportNumber: '',
          position: '',
          organization: '',
          email: '',
          phoneNumber: '',
          affiliation: '',
          passportFile: undefined,
        }
      ]);
      setFormErrors({});
    } catch (err) {
      console.error('Error creating delegation:', err);
      alert('Không thể tạo đoàn khách. Vui lòng thử lại.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumbs - giả sử có component này, giữ nguyên */}
      <Breadcrumbs items={[{ label: "Khai báo đoàn vào" }]} />

      <div className="flex items-center justify-between">
        <div>
          <h1>Quản Lý Đoàn Khách Quốc Tế</h1>
          <p className="text-muted-foreground mt-1">
            Quản lý thông tin các đoàn khách quốc tế đến thăm đơn vị
          </p>
        </div>
        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExportReport("pdf")}>
                <FileText className="w-4 h-4 mr-2" />
                Báo cáo PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportReport("word")}>
                <FileText className="w-4 h-4 mr-2" />
                Tài liệu Word
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button className="bg-primary" onClick={() => setIsAddDelegationOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Thêm đoàn mới
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Tìm kiếm theo tên đoàn, liên hệ hoặc mục đích..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Lọc trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="confirmed">Đã xác nhận</SelectItem>
              <SelectItem value="pending">Chờ xác nhận</SelectItem>
              <SelectItem value="cancelled">Đã hủy</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("grid")}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "table" ? "default" : "outline"}
              size="icon"
              onClick={() => setViewMode("table")}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </Card>

      {/* Loading State */}
      {loading && (
        <Card className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p>Đang tải dữ liệu...</p>
            </div>
          </div>
        </Card>
      )}

      {/* Error State */}
      {error && !loading && (
        <Card className="p-6">
          <div className="flex items-center justify-center py-8">
            <div className="text-center text-destructive">
              <p>{error}</p>
              <Button
                onClick={loadDelegations}
                className="mt-4"
              >
                Thử lại
              </Button>
            </div>
          </div>
        </Card>
      )}

      {/* Grid View */}
      {!loading && !error && viewMode === "grid" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDelegations.map((delegation) => (
            <Card key={delegation.id} className="p-6 hover:shadow-lg transition-all duration-300 border-l-4 border-l-primary">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h4>{delegation.groupName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {delegation.totalMembers} thành viên
                    </p>
                  </div>
                </div>
                {getStatusBadge(delegation.status)}
              </div>

              <div className="space-y-3">
                {delegation.hostDepartment && (
                  <div className="flex items-center gap-2 text-sm">
                    <Briefcase className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground">{delegation.hostDepartment}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <Globe className="w-4 h-4 text-muted-foreground" />
                  <span>{delegation.contactPerson}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>{new Date(delegation.arrivalDate).toLocaleDateString()} - {new Date(delegation.departureDate).toLocaleDateString()}</span>
                </div>
                {delegation.visitPurpose && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-muted-foreground line-clamp-1">
                      {delegation.visitPurpose}
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-4 pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {delegation.purpose}
                </p>
              </div>

              <div className="flex gap-2 mt-4">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSelectedDelegation(delegation)}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Xem
                </Button>
                <Button size="sm" variant="outline">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => handlePrint(delegation)}>
                  <Printer className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Table View */}
      {!loading && !error && viewMode === "table" && (
        <Card className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>STT</TableHead>
                  <TableHead>Tên đoàn</TableHead>
                  <TableHead>Mục đích</TableHead>
                  <TableHead>Ngày đến</TableHead>
                  <TableHead>Ngày đi</TableHead>
                  <TableHead>Liên hệ</TableHead>
                  <TableHead>Số thành viên</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredDelegations.map((delegation) => (
                  <TableRow key={delegation.id}>
                    <TableCell>{delegation.id}</TableCell>
                    <TableCell>{delegation.groupName}</TableCell>
                    <TableCell>{delegation.purpose}</TableCell>
                    <TableCell>{new Date(delegation.arrivalDate).toLocaleDateString()}</TableCell>
                    <TableCell>{new Date(delegation.departureDate).toLocaleDateString()}</TableCell>
                    <TableCell>{delegation.contactPerson}</TableCell>
                    <TableCell>{delegation.totalMembers}</TableCell>
                    <TableCell>{getStatusBadge(delegation.status)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedDelegation(delegation)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handlePrint(delegation)}>
                          <Printer className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Trash className="w-4 h-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}

      {/* Add/Edit Delegation Dialog */}
      <Dialog open={isAddDelegationOpen} onOpenChange={setIsAddDelegationOpen}>
        <DialogContent maxWidth="750px" className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Thêm Đoàn Khách Quốc Tế Mới</DialogTitle>
            <DialogDescription>
              Điền đầy đủ thông tin đoàn và thành viên. Tất cả các trường có dấu * là bắt buộc.
            </DialogDescription>
          </DialogHeader>

          <div className="dialog-body max-h-[70vh] overflow-y-auto">

            <div className="space-y-6">
              <h4 className="text-xl font-semibold border-b pb-3 text-primary">Thông Tin Đoàn</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Label htmlFor="group-name">
                    Tên đoàn <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="group-name"
                    placeholder="Ví dụ: Đoàn công tác Đại học Barcelona"
                    className={`mt-1 ${formErrors.groupName ? 'border-destructive' : ''}`}
                    value={formData.groupName || ''}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, groupName: e.target.value }));
                      if (formErrors.groupName) {
                        setFormErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.groupName;
                          return newErrors;
                        });
                      }
                    }}
                  />
                  {formErrors.groupName && (
                    <p className="text-sm text-destructive mt-1">{formErrors.groupName}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="purpose">
                    Mục đích chuyến thăm <span className="text-destructive">*</span>
                  </Label>
                  <Textarea
                    id="purpose"
                    placeholder="Mô tả chi tiết mục đích chuyến thăm..."
                    className={`mt-1 ${formErrors.purpose ? 'border-destructive' : ''}`}
                    rows={3}
                    value={formData.purpose || ''}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, purpose: e.target.value }));
                      if (formErrors.purpose) {
                        setFormErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.purpose;
                          return newErrors;
                        });
                      }
                    }}
                  />
                  {formErrors.purpose && (
                    <p className="text-sm text-destructive mt-1">{formErrors.purpose}</p>
                  )}
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                  <Label htmlFor="arrival-date" className="text-blue-800 font-semibold">
                    Ngày đến <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="arrival-date"
                    type="date"
                    className={`mt-2 ${formErrors.arrivalDate ? 'border-destructive' : ''}`}
                    value={formData.arrivalDate || ''}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, arrivalDate: e.target.value }));
                      if (formErrors.arrivalDate) {
                        setFormErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.arrivalDate;
                          return newErrors;
                        });
                      }
                    }}
                  />
                  {formErrors.arrivalDate && (
                    <p className="text-sm text-destructive mt-1">{formErrors.arrivalDate}</p>
                  )}
                  <p className="text-xs text-blue-600 mt-1">Chọn ngày và giờ đoàn khách đến</p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <Label htmlFor="departure-date" className="text-green-800 font-semibold">
                    Ngày đi <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="departure-date"
                    type="date"
                    className={`mt-2 ${formErrors.departureDate ? 'border-destructive' : ''}`}
                    value={formData.departureDate || ''}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, departureDate: e.target.value }));
                      if (formErrors.departureDate) {
                        setFormErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.departureDate;
                          return newErrors;
                        });
                      }
                    }}
                  />
                  {formErrors.departureDate && (
                    <p className="text-sm text-destructive mt-1">{formErrors.departureDate}</p>
                  )}
                  <p className="text-xs text-green-600 mt-1">Chọn ngày và giờ đoàn khách rời đi</p>
                </div>

                <div>
                  <Label htmlFor="contact-person">
                    Người liên hệ <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contact-person"
                    placeholder="Tên người phụ trách đoàn"
                    className={`mt-1 ${formErrors.contactPerson ? 'border-destructive' : ''}`}
                    value={formData.contactPerson || ''}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, contactPerson: e.target.value }));
                      if (formErrors.contactPerson) {
                        setFormErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.contactPerson;
                          return newErrors;
                        });
                      }
                    }}
                  />
                  {formErrors.contactPerson && (
                    <p className="text-sm text-destructive mt-1">{formErrors.contactPerson}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contact-email">
                    Email liên hệ <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="contact-email"
                    type="email"
                    placeholder="contact@university.edu"
                    className={`mt-1 ${formErrors.contactEmail ? 'border-destructive' : ''}`}
                    value={formData.contactEmail || ''}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, contactEmail: e.target.value }));
                      if (formErrors.contactEmail) {
                        setFormErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.contactEmail;
                          return newErrors;
                        });
                      }
                    }}
                  />
                  {formErrors.contactEmail && (
                    <p className="text-sm text-destructive mt-1">{formErrors.contactEmail}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="contact-phone">Số điện thoại liên hệ</Label>
                  <Input
                    id="contact-phone"
                    placeholder="+84 123 456 789"
                    className="mt-1"
                    value={formData.contactPhone || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="host-department">
                    Phòng ban chủ trì <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="host-department"
                    placeholder="Ví dụ: Phòng Hợp tác Quốc tế"
                    className={`mt-1 ${formErrors.hostDepartment ? 'border-destructive' : ''}`}
                    value={formData.hostDepartment || ''}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, hostDepartment: e.target.value }));
                      if (formErrors.hostDepartment) {
                        setFormErrors(prev => {
                          const newErrors = { ...prev };
                          delete newErrors.hostDepartment;
                          return newErrors;
                        });
                      }
                    }}
                  />
                  {formErrors.hostDepartment && (
                    <p className="text-sm text-destructive mt-1">{formErrors.hostDepartment}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="visit-purpose">Mục đích cụ thể</Label>
                  <Input
                    id="visit-purpose"
                    placeholder="Mô tả chi tiết hơn về mục đích chuyến thăm"
                    className="mt-1"
                    value={formData.visitPurpose || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, visitPurpose: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="invitation-letter-no">Số thư mời</Label>
                  <Input
                    id="invitation-letter-no"
                    placeholder="INV-2025-XXX"
                    className="mt-1"
                    value={formData.invitationLetterNo || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, invitationLetterNo: e.target.value }))}
                  />
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="partner-id">Đối tác</Label>
                  <Select
                    value={formData.partnerId || ''}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, partnerId: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Chọn đối tác (tùy chọn)" />
                    </SelectTrigger>
                    <SelectContent>
                      {partners.map((partner) => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.name} ({partner.country})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="notes">Ghi chú thêm</Label>
                  <Textarea
                    id="notes"
                    placeholder="Thông tin bổ sung..."
                    className="mt-1"
                    rows={2}
                    value={formData.notes || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            {/* Members Section */}
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b pb-3">
                <h4 className="text-xl font-semibold text-primary">Thành Viên Đoàn ({members.length})</h4>
                <Button type="button" variant="outline" onClick={addMember} className="bg-green-50 hover:bg-green-100 border-green-200">
                  <Plus className="w-4 h-4 mr-2" />
                  Thêm thành viên
                </Button>
              </div>

              {formErrors.members && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{formErrors.members}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-6">
                {members.map((member, index) => (
                  <Card key={index} className="p-8 border-2 hover:border-primary/20 transition-colors">
                    <div className="flex items-start justify-between mb-6">
                      <h5 className="text-lg font-semibold text-primary">Thành viên {index + 1}</h5>
                      {members.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeMember(index)}
                          className="text-destructive hover:text-destructive hover:bg-red-50"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      )}
                    </div>

                    <div className="space-y-4">
                      <div>
                        <Label htmlFor={`member-title-${index}`}>
                          Danh xưng <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={member.title || ''}
                          onValueChange={(value) => updateMember(index, 'title', value)}
                        >
                          <SelectTrigger className={`mt-1 ${formErrors[`member_${index}_title`] ? 'border-destructive' : ''}`}>
                            <SelectValue placeholder="Chọn danh xưng" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="prof">GS. (Professor)</SelectItem>
                            <SelectItem value="dr">TS. (Doctor)</SelectItem>
                            <SelectItem value="mr">Ông (Mr.)</SelectItem>
                            <SelectItem value="ms">Bà/Cô (Ms.)</SelectItem>
                            <SelectItem value="mrs">Bà (Mrs.)</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors[`member_${index}_title`] && (
                          <p className="text-sm text-destructive mt-1">{formErrors[`member_${index}_title`]}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`member-fullName-${index}`}>
                          Họ và tên đầy đủ <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`member-fullName-${index}`}
                          placeholder="Ví dụ: Nguyễn Văn A"
                          className={`mt-1 ${formErrors[`member_${index}_fullName`] ? 'border-destructive' : ''}`}
                          value={member.fullName || ''}
                          onChange={(e) => updateMember(index, 'fullName', e.target.value)}
                        />
                        {formErrors[`member_${index}_fullName`] && (
                          <p className="text-sm text-destructive mt-1">{formErrors[`member_${index}_fullName`]}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`member-dateOfBirth-${index}`}>
                          Ngày sinh <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`member-dateOfBirth-${index}`}
                          type="date"
                          className={`mt-1 ${formErrors[`member_dateOfBirth`] ? 'border-destructive' : ''}`}
                          value={member.dateOfBirth || ''}
                          onChange={(e) => updateMember(index, 'dateOfBirth', e.target.value)}
                        />
                        {formErrors[`member_${index}_dateOfBirth`] && (
                          <p className="text-sm text-destructive mt-1">{formErrors[`member_${index}_dateOfBirth`]}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`member-gender-${index}`}>
                          Giới tính <span className="text-destructive">*</span>
                        </Label>
                        <Select
                          value={member.gender || ''}
                          onValueChange={(value) => updateMember(index, 'gender', value)}
                        >
                          <SelectTrigger className={`mt-1 ${formErrors[`member_${index}_gender`] ? 'border-destructive' : ''}`}>
                            <SelectValue placeholder="Chọn giới tính" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Nam">Nam</SelectItem>
                            <SelectItem value="Nữ">Nữ</SelectItem>
                            <SelectItem value="Khác">Khác</SelectItem>
                          </SelectContent>
                        </Select>
                        {formErrors[`member_${index}_gender`] && (
                          <p className="text-sm text-destructive mt-1">{formErrors[`member_${index}_gender`]}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`member-nationality-${index}`}>
                          Quốc tịch <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`member-nationality-${index}`}
                          placeholder="Ví dụ: Việt Nam, Mỹ, Trung Quốc..."
                          className={`mt-1 ${formErrors[`member_${index}_nationality`] ? 'border-destructive' : ''}`}
                          value={member.nationality || ''}
                          onChange={(e) => updateMember(index, 'nationality', e.target.value)}
                        />
                        {formErrors[`member_${index}_nationality`] && (
                          <p className="text-sm text-destructive mt-1">{formErrors[`member_${index}_nationality`]}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`member-passportNumber-${index}`}>
                          Số hộ chiếu <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`member-passportNumber-${index}`}
                          placeholder="Số hộ chiếu"
                          className={`mt-1 ${formErrors[`member_${index}_passportNumber`] ? 'border-destructive' : ''}`}
                          value={member.passportNumber || ''}
                          onChange={(e) => updateMember(index, 'passportNumber', e.target.value)}
                        />
                        {formErrors[`member_${index}_passportNumber`] && (
                          <p className="text-sm text-destructive mt-1">{formErrors[`member_${index}_passportNumber`]}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`member-position-${index}`}>
                          Chức vụ <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`member-position-${index}`}
                          placeholder="Ví dụ: Giáo sư, Nghiên cứu viên..."
                          className={`mt-1 ${formErrors[`member_${index}_position`] ? 'border-destructive' : ''}`}
                          value={member.position || ''}
                          onChange={(e) => updateMember(index, 'position', e.target.value)}
                        />
                        {formErrors[`member_${index}_position`] && (
                          <p className="text-sm text-destructive mt-1">{formErrors[`member_${index}_position`]}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`member-organization-${index}`}>
                          Cơ quan <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id={`member-organization-${index}`}
                          placeholder="Tên trường đại học/công ty..."
                          className={`mt-1 ${formErrors[`member_${index}_organization`] ? 'border-destructive' : ''}`}
                          value={member.organization || ''}
                          onChange={(e) => updateMember(index, 'organization', e.target.value)}
                        />
                        {formErrors[`member_${index}_organization`] && (
                          <p className="text-sm text-destructive mt-1">{formErrors[`member_${index}_organization`]}</p>
                        )}
                      </div>

                      <div>
                        <Label htmlFor={`member-email-${index}`}>Email</Label>
                        <Input
                          id={`member-email-${index}`}
                          type="email"
                          placeholder="email@university.edu"
                          className="mt-1"
                          value={member.email || ''}
                          onChange={(e) => updateMember(index, 'email', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`member-phoneNumber-${index}`}>Số điện thoại</Label>
                        <Input
                          id={`member-phoneNumber-${index}`}
                          placeholder="+84 123 456 789"
                          className="mt-1"
                          value={member.phoneNumber || ''}
                          onChange={(e) => updateMember(index, 'phoneNumber', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`member-affiliation-${index}`}>Đơn vị liên kết</Label>
                        <Input
                          id={`member-affiliation-${index}`}
                          placeholder="Tên khoa/ngành liên quan"
                          className="mt-1"
                          value={member.affiliation || ''}
                          onChange={(e) => updateMember(index, 'affiliation', e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="mt-4">
                      <Label>Bản sao hộ chiếu</Label>
                      <FileUploadBox
                        label="Tải lên bản sao hộ chiếu (PDF/JPG/PNG)"
                        accept=".pdf,.jpg,.png"
                        maxSizeMB={5}
                        onFileSelect={(file) => updateMember(index, 'passportFile', file?.name)}
                      />
                      {member.passportFile && (
                        <p className="text-sm text-green-600 mt-1">✓ Đã tải lên: {member.passportFile}</p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Attachments */}
            <div className="space-y-6">
              <h4 className="text-xl font-semibold border-b pb-3 text-primary">Tài Liệu Đính Kèm</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FileUploadBox
                  label="Thư mời hoặc tài liệu khác"
                  accept=".pdf,.jpg,.png,.doc,.docx"
                  maxSizeMB={10}
                  onFileSelect={(file) => handleFile(file, 'attachments')}
                />
                <FileUploadBox
                  label="Tài liệu NA2 (Nhập cảnh)"
                  accept=".pdf"
                  maxSizeMB={10}
                  onFileSelect={(file) => handleFile(file, 'immigrationDocNA2')}
                />
                <FileUploadBox
                  label="Tài liệu NA5 (Visa)"
                  accept=".pdf"
                  maxSizeMB={10}
                  onFileSelect={(file) => handleFile(file, 'visaRequestDocNA5')}
                />
                <FileUploadBox
                  label="Báo cáo chuyến thăm"
                  accept=".pdf,.doc,.docx"
                  maxSizeMB={10}
                  onFileSelect={(file) => handleFile(file, 'reportFile')}
                />
              </div>
            </div>
          </div>

          <DialogFooter className="border-t pt-6 mt-8 flex gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsAddDelegationOpen(false)}
              disabled={isSubmitting}
              className="px-8"
            >
              Hủy
            </Button>
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="px-8 min-w-[140px]"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Đang lưu...
                </>
              ) : (
                <>
                  <Users className="w-4 h-4 mr-2" />
                  Lưu thông tin đoàn
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Delegation Dialog */}
      <Dialog
        open={!!selectedDelegation}
        onOpenChange={(open) => !open && setSelectedDelegation(null)}
      >
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto ">
          <DialogHeader>
            <DialogTitle>Chi Tiết Đoàn Khách</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về đoàn khách quốc tế và các thành viên
            </DialogDescription>
          </DialogHeader>
          {selectedDelegation && (
            <div className="max-h-[60vh] pr-4 overflow-y-auto dialog-body">
              <Tabs defaultValue="delegation" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="delegation">Thông Tin Đoàn</TabsTrigger>
                  <TabsTrigger value="members">Thành Viên ({selectedDelegation.members.length})</TabsTrigger>
                  <TabsTrigger value="documents">Tài Liệu</TabsTrigger>
                </TabsList>

                <TabsContent value="delegation">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <Label>Tên đoàn</Label>
                      <p className="mt-1">{selectedDelegation.groupName}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Mục đích</Label>
                      <p className="mt-1">{selectedDelegation.purpose}</p>
                    </div>
                    <div>
                      <Label>Ngày đến</Label>
                      <p className="mt-1">{new Date(selectedDelegation.arrivalDate).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>Ngày đi</Label>
                      <p className="mt-1">{new Date(selectedDelegation.departureDate).toLocaleString()}</p>
                    </div>
                    <div>
                      <Label>Người liên hệ</Label>
                      <p className="mt-1">{selectedDelegation.contactPerson}</p>
                    </div>
                    <div>
                      <Label>Email liên hệ</Label>
                      <p className="mt-1">{selectedDelegation.contactEmail}</p>
                    </div>
                    <div>
                      <Label>SĐT liên hệ</Label>
                      <p className="mt-1">{selectedDelegation.contactPhone}</p>
                    </div>
                    <div>
                      <Label>Số thành viên</Label>
                      <p className="mt-1">{selectedDelegation.totalMembers}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Ghi chú</Label>
                      <p className="mt-1">{selectedDelegation.notes}</p>
                    </div>
                    <div className="col-span-2">
                      <Label>Mục đích chuyến thăm</Label>
                      <p className="mt-1">{selectedDelegation.visitPurpose}</p>
                    </div>
                    <div>
                      <Label>Phòng ban chủ trì</Label>
                      <p className="mt-1">{selectedDelegation.hostDepartment}</p>
                    </div>
                    <div>
                      <Label>Số thư mời</Label>
                      <p className="mt-1">{selectedDelegation.invitationLetterNo}</p>
                    </div>
                    <div>
                      <Label>Đối tác</Label>
                      <p className="mt-1">{selectedDelegation.partner?.name || selectedDelegation.partnerId || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Đơn vị</Label>
                      <p className="mt-1">{selectedDelegation.unit?.name || selectedDelegation.unitId || 'N/A'}</p>
                    </div>
                    <div>
                      <Label>Trạng thái</Label>
                      <div className="mt-1">{getStatusBadge(selectedDelegation.status)}</div>
                    </div>
                    <div>
                      <Label>Ngày tạo</Label>
                      <p className="mt-1">{selectedDelegation.createdAt ? new Date(selectedDelegation.createdAt).toLocaleDateString('vi-VN') : 'N/A'}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="members">
                  <ScrollArea className="h-[300px]">
                    {selectedDelegation.members.map((member) => (
                      <Card key={member.id} className="p-4 mb-4">
                        <div className="space-y-2">
                          <div>
                            <Label>Họ tên</Label>
                            <p>{member.title} {member.fullName}</p>
                          </div>
                          <div>
                            <Label>Quốc tịch</Label>
                            <p>{member.nationality}</p>
                          </div>
                          <div>
                            <Label>Số hộ chiếu</Label>
                            <p>{member.passportNumber}</p>
                          </div>
                          <div>
                            <Label>Chức vụ</Label>
                            <p>{member.position}</p>
                          </div>
                          <div>
                            <Label>Cơ quan</Label>
                            <p>{member.organization}</p>
                          </div>
                          <div>
                            <Label>Email</Label>
                            <p>{member.email}</p>
                          </div>
                          <div>
                            <Label>SĐT</Label>
                            <p>{member.phoneNumber}</p>
                          </div>
                          <div>
                            <Label>Ngày sinh</Label>
                            <p>{member.dateOfBirth}</p>
                          </div>
                          <div>
                            <Label>Giới tính</Label>
                            <p>{member.gender}</p>
                          </div>
                          <div>
                            <Label>Đơn vị liên kết</Label>
                            <p>{member.affiliation}</p>
                          </div>
                          {member.passportFile && (
                            <div className="flex items-center justify-between mt-2">
                              <div className="flex items-center gap-2">
                                <FileText className="w-5 h-5 text-muted-foreground" />
                                <div>
                                  <p>Tệp hộ chiếu</p>
                                  <p className="text-sm text-muted-foreground">
                                    {member.passportFile}
                                  </p>
                                </div>
                              </div>
                              <Button size="sm" variant="outline">
                                <Download className="w-4 h-4 mr-2" />
                                Tải xuống
                              </Button>
                            </div>
                          )}
                        </div>
                      </Card>
                    ))}
                  </ScrollArea>
                </TabsContent>

                <TabsContent value="documents">
                  <div className="space-y-4">
                    {selectedDelegation.attachments && selectedDelegation.attachments.map((attachment: string, index: number) => (
                      <Card key={index} className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p>Tài liệu đính kèm</p>
                              <p className="text-sm text-muted-foreground">{attachment}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Tải xuống
                          </Button>
                        </div>
                      </Card>
                    ))}
                    {selectedDelegation.immigrationDocNA2 && (
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p>Tài liệu NA2</p>
                              <p className="text-sm text-muted-foreground">{selectedDelegation.immigrationDocNA2}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Tải xuống
                          </Button>
                        </div>
                      </Card>
                    )}
                    {selectedDelegation.visaRequestDocNA5 && (
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p>Tài liệu NA5</p>
                              <p className="text-sm text-muted-foreground">{selectedDelegation.visaRequestDocNA5}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Tải xuống
                          </Button>
                        </div>
                      </Card>
                    )}
                    {selectedDelegation.reportFile && (
                      <Card className="p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <FileText className="w-5 h-5 text-muted-foreground" />
                            <div>
                              <p>Báo cáo chuyến thăm</p>
                              <p className="text-sm text-muted-foreground">{selectedDelegation.reportFile}</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline">
                            <Download className="w-4 h-4 mr-2" />
                            Tải xuống
                          </Button>
                        </div>
                      </Card>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
          <DialogFooter className="mt-4 border-t pt-4">
            <Button variant="outline" onClick={() => setSelectedDelegation(null)}>
              Đóng
            </Button>
            <Button variant="outline">
              <Edit className="w-4 h-4 mr-2" />
              Sửa
            </Button>
            <Button variant="outline" onClick={() => handlePrint()}>
              <Printer className="w-4 h-4 mr-2" />
              In công văn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}