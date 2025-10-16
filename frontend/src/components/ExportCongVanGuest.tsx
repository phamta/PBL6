import { saveAs } from "file-saver";
import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  Table,
  TableRow,
  TableCell,
  WidthType,
  AlignmentType,
  BorderStyle,
  VerticalAlign,
  UnderlineType,
  TableBorders,
  type IParagraphOptions
} from "docx";

// --- CẤU HÌNH CỠ CHỮ CHUẨN (half-points) ---
const ALIGN = AlignmentType;
const FONT = "Times New Roman";
const CM_TO_DXA = 1440 / 2.54; // Tỷ lệ chuyển đổi cm sang dxa

const SIZE_12PT = 24; // 12pt (Header)
const SIZE_13PT = 26; // 13pt (Phổ biến: Quốc hiệu, Thân văn bản, Ký tên)
const SIZE_14PT = 28; // 14pt (Tiêu đề/Trích yếu)

// --- HÀM HỖ TRỢ ---

const boldText = (text: string, size = SIZE_13PT) =>
  new TextRun({ text, bold: true, font: FONT, size });

const normalText = (text: string, size = SIZE_13PT) =>
  new TextRun({ text, font: FONT, size });

// Paragraph cho nội dung thân công văn (Giãn cách dòng 1.5)
const paragraph = (
  text: string | TextRun[],
  alignment: any = AlignmentType.JUSTIFIED,
  spacingFirstLine = 0, // Thụt lề dòng đầu (709 dxa = 1.25cm)
  spacingAfter = 60,
  isBold = false,
  size = SIZE_13PT
) => {
  const children = typeof text === 'string'
    ? [isBold ? boldText(text, size) : normalText(text, size)]
    : text;

  // Giãn dòng 1.5 lines (360 dxa)
  return new Paragraph({
    alignment,
    spacing: { after: spacingAfter, line: 360 },
    indent: { firstLine: spacingFirstLine > 0 ? spacingFirstLine : undefined },
    children: children,
  });
}

// Paragraph cho nội dung trong cell (Giãn cách dòng đơn)
const cellParagraph = (
  children: TextRun[],
  alignment: any = AlignmentType.CENTER,
  spacingBefore = 50,
  spacingAfter = 50
) =>
  new Paragraph({
    alignment,
    spacing: { before: spacingBefore, after: spacingAfter, line: 240 }, // Giãn dòng 1.0 lines
    children: children,
  });
// --- HÀM HỖ TRỢ CHUYỂN ĐỔI DỮ LIỆU ---

// Interface thống nhất cho export
interface ExportDelegationData {
  title: string;
  startDate: string;
  purpose: string;
  participantList: any[];
}

// Adapter function để thống nhất dữ liệu từ cả officer và staff
const normalizeDelegationData = (delegation: any): ExportDelegationData => {
  // Kiểm tra nếu là Delegation interface (officer)
  if (delegation.participantList !== undefined) {
    return {
      title: delegation.title || "Unnamed Delegation",
      startDate: delegation.startDate || "",
      purpose: delegation.purpose || "",
      participantList: delegation.participantList || []
    };
  }

  // Nếu là GuestWithRelations interface (staff)
  return {
    title: delegation.groupName || "Unnamed Delegation",
    startDate: delegation.arrivalDate || "",
    purpose: delegation.purpose || "",
    participantList: delegation.members || []
  };
};

// --- HÀM CHÍNH XUẤT BÁO CÁO ---

export const exportCongVanBaoCao = async (delegation: any) => {
  if (!delegation) return;

  // Chuẩn hóa dữ liệu
  const normalizedData = normalizeDelegationData(delegation);

  const currentDate = new Date();
  const day = currentDate.getDate().toString();
  const month = (currentDate.getMonth() + 1).toString();
  const year = currentDate.getFullYear().toString();

  const arrivalDate = normalizedData.startDate
    ? new Date(normalizedData.startDate)
    : new Date();
  const arrivalDay = arrivalDate.getDate().toString().padStart(2, "0");
  const arrivalMonth = (arrivalDate.getMonth() + 1).toString();
  const arrivalYear = arrivalDate.getFullYear().toString();

  const marginConfig = {
    top: 2.5 * CM_TO_DXA, 
    bottom: 2.5 * CM_TO_DXA, 
    left: 3.0 * CM_TO_DXA, 
    right: 2.0 * CM_TO_DXA, 
  };

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: marginConfig,
          },
        },
        children: [
          // --- 1. HEADER (Bảng ẩn 2 cột) ---
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: [4500, 5500],
            borders: TableBorders.NONE,
            rows: [
              new TableRow({
                children: [
                  // Cột 1: Header bên trái (Cỡ 12pt)
                  new TableCell({
                    children: [
                      cellParagraph([boldText("ĐẠI HỌC ĐÀ NẴNG", SIZE_12PT)], AlignmentType.CENTER, 0, 0),
                      cellParagraph([boldText("TRƯỜNG ĐẠI HỌC BÁCH KHOA", SIZE_12PT)], AlignmentType.CENTER, 0, 100),
                      cellParagraph([normalText("Số: ……../ĐHBK-KHCN&ĐN", SIZE_13PT)], AlignmentType.CENTER, 0, 200), // Số công văn 13pt
                    ],
                  }),
                  
                  // Cột 2: Quốc hiệu và Ngày tháng bên phải (Cỡ 13pt)
                  new TableCell({
                    children: [
                      cellParagraph([boldText("CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM", SIZE_13PT)], AlignmentType.CENTER, 0, 0), // Quốc hiệu 13pt
                      cellParagraph([
                        new TextRun({
                          text: "Độc lập – Tự do – Hạnh phúc",
                          font: FONT,
                          size: SIZE_13PT, // 13pt
                          bold: true,
                          underline: { type: UnderlineType.SINGLE },
                        }),
                      ], AlignmentType.CENTER, 0, 200),
                      // Ngày tháng 13pt
                      cellParagraph([normalText(`Đà Nẵng, ngày ${day} tháng ${month} năm ${year}`, SIZE_13PT)], AlignmentType.RIGHT, 0, 0),
                    ],
                  }),
                ],
              }),
            ],
          }),

          // Tiêu đề công văn (Cỡ 14pt - SIZE_14PT)
          new Paragraph({
            alignment: AlignmentType.CENTER,
            spacing: { before: 300, after: 400 },
            children: [
                boldText("V/v thông báo đoàn khách nước ngoài đến làm việc", SIZE_14PT) // 14pt
            ],
          }),

          // --- 2. KÍNH GỬI VÀ THÂN CÔNG VĂN (Cỡ 13pt) ---

          // Kính gửi (in đậm 13pt)
          paragraph("Kính gửi:", AlignmentType.LEFT, 0, 100, true, SIZE_13PT),
          
          // Các nơi nhận (13pt)
          paragraph("- Phòng Quản lý Xuất Nhập cảnh – Công an thành phố Đà Nẵng;", AlignmentType.LEFT, 0, 0, false, SIZE_13PT),
          paragraph("- Phòng An ninh Chính trị nội bộ – Công an thành phố Đà Nẵng;", AlignmentType.LEFT, 0, 0, false, SIZE_13PT),
          paragraph("- Sở Ngoại vụ thành phố Đà Nẵng.", AlignmentType.LEFT, 0, 300, false, SIZE_13PT),

          // Đoạn mở đầu (13pt, thụt lề 1.25cm = 709 dxa)
          paragraph(
            "Thực hiện Luật số 47/2014/QH13 ngày 16/6/2014 của Quốc hội Khóa XIII về nhập cảnh, xuất cảnh, quá cảnh, cư trú của người nước ngoài tại Việt Nam, ĐHĐN/ Trường Đại học Bách khoa kính gửi thông tin báo đoàn khách nước ngoài đến làm việc, nội dung cụ thể như sau:",
            ALIGN.JUSTIFIED,
            709, 
            200,
            false,
            SIZE_13PT
          ),
          
          // Mục 1 (13pt, thụt lề 1.25cm)
          paragraph(
            `1. Thành phần đoàn khách: ${normalizedData.title || "………………………………………."}.`,
            ALIGN.JUSTIFIED,
            709,
            200,
            false,
            SIZE_13PT
          ),

          // --- 3. BẢNG CHI TIẾT KHÁCH (Cỡ 13pt) ---
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: [500, 2500, 1500, 1000, 1500, 1500, 1500],
            alignment: AlignmentType.CENTER,
            borders: {
              top: { style: BorderStyle.SINGLE, size: 4 },
              bottom: { style: BorderStyle.SINGLE, size: 4 },
              left: { style: BorderStyle.SINGLE, size: 4 },
              right: { style: BorderStyle.SINGLE, size: 4 },
              insideHorizontal: { style: BorderStyle.SINGLE, size: 4 },
              insideVertical: { style: BorderStyle.SINGLE, size: 4 },
            },
            rows: [
              // Hàng Header (13pt)
              new TableRow({
                tableHeader: true,
                children: [
                  "STT", "Họ và tên", "Ngày sinh", "Giới tính", "Quốc tịch", "Số hộ chiếu", "Chức vụ/ Đơn vị",
                ].map((header) =>
                    new TableCell({
                      children: [
                        cellParagraph([boldText(header, SIZE_13PT)], AlignmentType.CENTER, 100, 100),
                      ],
                      verticalAlign: VerticalAlign.CENTER,
                    })
                ),
              }),
              // Hàng Data (13pt)
              ...(normalizedData.participantList || []).map((member: any, index: number) => {
                const birthDate = member.dateOfBirth
                  ? new Date(member.dateOfBirth).toLocaleDateString("vi-VN")
                  : "";
                return new TableRow({
                  children: [
                    `${index + 1}`,
                    `${member.title || ""} ${member.fullName || ""}`,
                    birthDate,
                    member.gender || "",
                    member.nationality || "",
                    member.passportNumber || "",
                    `${member.position || ""} / ${member.organization || ""}`,
                  ].map((text) =>
                      new TableCell({
                        children: [
                          cellParagraph([normalText(text, SIZE_13PT)], AlignmentType.CENTER, 100, 100),
                        ],
                        verticalAlign: VerticalAlign.CENTER,
                      })
                  ),
                });
              }),
            ],
          }),
          
          // --- 4. CÁC MỤC CUỐI VÀ KÝ TÊN (Cỡ 13pt) ---

          // Mục 2 (13pt, thụt lề 1.25cm)
          paragraph("2. Thời gian và địa điểm làm việc", ALIGN.LEFT, 709, 100, true, SIZE_13PT),
          paragraph(
            `Ngày ${arrivalDay}/${arrivalMonth}/${arrivalYear} tại Trường Đại học Bách khoa, Đại học Đà Nẵng.`,
            ALIGN.JUSTIFIED,
            0,
            200,
            false,
            SIZE_13PT
          ),

          // Mục 3 (13pt, thụt lề 1.25cm)
          paragraph("3. Nội dung làm việc", ALIGN.LEFT, 709, 100, true, SIZE_13PT),
          paragraph(
            normalizedData.purpose || "……………………………………………………………………………",
            ALIGN.JUSTIFIED,
            0,
            200,
            false,
            SIZE_13PT
          ),
          
          // Đoạn kết (13pt, thụt lề 1.25cm)
          paragraph(
            "Trường Đại học Bách khoa xin báo cáo và đề nghị Quý Cơ quan quan tâm, giúp đỡ. Nếu khách có thay đổi chương trình hoạt động hoặc cần giải quyết thủ tục có liên quan, Nhà trường sẽ kịp thời có văn bản thông báo bổ sung.",
            ALIGN.JUSTIFIED,
            709,
            0,
            false,
            SIZE_13PT
          ),
          // Trân trọng (13pt)
          paragraph("Trân trọng./.", ALIGN.RIGHT, 0, 0, false, SIZE_13PT),

          // --- 5. CHỨC DANH VÀ NƠI NHẬN (Bảng ẩn 2 cột, Cỡ 13pt) ---
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            columnWidths: [4500, 5500],
            borders: TableBorders.NONE,
            rows: [
                new TableRow({
                    children: [
                        // Cột 1: Nơi nhận (13pt)
                        new TableCell({
                            children: [
                                cellParagraph([boldText("Nơi nhận:", SIZE_13PT)], AlignmentType.LEFT, 0, 0),
                                cellParagraph([normalText("- Như trên;", SIZE_13PT)], AlignmentType.LEFT, 0, 0),
                                cellParagraph([normalText("- Ban KHHTQT (để báo cáo);", SIZE_13PT)], AlignmentType.LEFT, 0, 0),
                                cellParagraph([normalText("- Ban Giám hiệu (để báo cáo);", SIZE_13PT)], AlignmentType.LEFT, 0, 0),
                                cellParagraph([normalText("- Lưu: VT, KHCN&ĐN.", SIZE_13PT)], AlignmentType.LEFT, 0, 0),
                            ],
                        }),
                        // Cột 2: Chữ ký (13pt)
                        new TableCell({
                            children: [
                                cellParagraph([boldText("TL. HIỆU TRƯỞNG", SIZE_13PT)], AlignmentType.CENTER, 0, 0),
                                cellParagraph([boldText("KT. TRƯỜNG PHÒNG KHCN&ĐN", SIZE_13PT)], AlignmentType.CENTER, 0, 0),
                                cellParagraph([boldText("PHÓ TRƯỞNG PHÒNG", SIZE_13PT)], AlignmentType.CENTER, 0, 400),
                                cellParagraph([boldText("TS. Nguyễn Hoàng Trung Hiếu", SIZE_13PT)], AlignmentType.CENTER, 400, 200),
                            ],
                        }),
                    ],
                }),
            ],
          }),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(
    blob,
    `cong-van-bao-cao-${normalizedData.title || "unnamed"}.docx`
  );
};