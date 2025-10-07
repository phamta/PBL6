import 'package:flutter/material.dart';

class VisaManagePage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Quản lý Visa'),
        backgroundColor: Color(0xFF3383CD),
        actions: [
          IconButton(
            icon: Icon(Icons.notifications, color: Colors.white),
            onPressed: () {},
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Visa status
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 8,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Tình trạng Visa của bạn',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 8),
                  Row(
                    children: [
                      Container(
                        padding: EdgeInsets.symmetric(
                          horizontal: 12,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Color(0xFFFFF3E0),
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Text(
                          'Còn 15 ngày',
                          style: TextStyle(
                            color: Colors.orange,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                      Spacer(),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Color(0xFF3383CD),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(24),
                          ),
                        ),
                        onPressed: () {},
                        child: Text('Gia hạn ngay'),
                      ),
                    ],
                  ),
                  SizedBox(height: 8),
                  Row(
                    children: [
                      OutlinedButton(onPressed: () {}, child: Text('Chi tiết')),
                    ],
                  ),
                ],
              ),
            ),
            SizedBox(height: 16),
            // Visa info
            Text(
              'Thông tin Visa',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 8,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _VisaInfoRow(label: 'Số visa', value: 'VN20231123456'),
                  _VisaInfoRow(label: 'Loại visa', value: 'DH - Du học'),
                  _VisaInfoRow(label: 'Số lần nhập cảnh', value: 'Nhiều lần'),
                  _VisaInfoRow(label: 'Thời hạn', value: '6 tháng'),
                  _VisaInfoRow(
                    label: 'Nơi cấp',
                    value: 'Đại sứ quán Việt Nam tại Washington',
                  ),
                ],
              ),
            ),
            SizedBox(height: 16),
            // Processing
            Text(
              'Đơn đang xử lý',
              style: TextStyle(fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 8),
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 8,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Đơn xin gia hạn visa',
                    style: TextStyle(fontWeight: FontWeight.bold),
                  ),
                  SizedBox(height: 4),
                  Row(
                    children: [
                      Container(
                        padding: EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 2,
                        ),
                        decoration: BoxDecoration(
                          color: Color(0xFFE3F2FD),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Text(
                          'Đang xử lý',
                          style: TextStyle(color: Color(0xFF3383CD)),
                        ),
                      ),
                      Spacer(),
                      Text('01/08/2023 - 25/08/2023'),
                    ],
                  ),
                  SizedBox(height: 8),
                  LinearProgressIndicator(
                    value: 0.7,
                    backgroundColor: Colors.grey.shade200,
                    color: Color(0xFF3383CD),
                  ),
                  SizedBox(height: 8),
                  Row(
                    children: [
                      OutlinedButton(
                        onPressed: () {},
                        child: Text('Xem chi tiết'),
                      ),
                      SizedBox(width: 8),
                      OutlinedButton(onPressed: () {}, child: Text('Hủy đơn')),
                    ],
                  ),
                ],
              ),
            ),
            SizedBox(height: 16),
            // History
            Text('Lịch sử Visa', style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Container(
              padding: EdgeInsets.all(16),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black12,
                    blurRadius: 8,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  _VisaHistoryItem(
                    title: 'Visa Du học DH',
                    date: '15/03/2022 - 15/09/2022',
                    status: 'Đã hết hạn',
                    statusColor: Colors.red,
                  ),
                  _VisaHistoryItem(
                    title: 'Visa Du học DH',
                    date: '15/03/2022 - 15/09/2022',
                    status: 'Đã hết hạn',
                    statusColor: Colors.red,
                  ),
                  _VisaHistoryItem(
                    title: 'Visa Du học DH',
                    date: '15/03/2022 - 15/09/2022',
                    status: 'Đã hết hạn',
                    statusColor: Colors.red,
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
      backgroundColor: Color(0xFFF5F6FA),
    );
  }
}

class _VisaInfoRow extends StatelessWidget {
  final String label;
  final String value;
  const _VisaInfoRow({required this.label, required this.value});
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Text(label + ': ', style: TextStyle(fontWeight: FontWeight.bold)),
          Expanded(child: Text(value)),
        ],
      ),
    );
  }
}

class _VisaHistoryItem extends StatelessWidget {
  final String title;
  final String date;
  final String status;
  final Color statusColor;
  const _VisaHistoryItem({
    required this.title,
    required this.date,
    required this.status,
    required this.statusColor,
  });
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: EdgeInsets.symmetric(vertical: 4),
      child: Row(
        children: [
          Icon(Icons.bookmark, color: Color(0xFF3383CD)),
          SizedBox(width: 8),
          Expanded(child: Text(title)),
          Text(date, style: TextStyle(color: Colors.grey)),
          SizedBox(width: 8),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 8, vertical: 2),
            decoration: BoxDecoration(
              color: statusColor.withOpacity(0.1),
              borderRadius: BorderRadius.circular(8),
            ),
            child: Text(status, style: TextStyle(color: statusColor)),
          ),
        ],
      ),
    );
  }
}
