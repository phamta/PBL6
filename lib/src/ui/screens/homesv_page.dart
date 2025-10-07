import 'package:flutter/material.dart';
import 'visa_manage_page.dart';

class HomeSVPage extends StatelessWidget {
  final String studentName;
  const HomeSVPage({required this.studentName, Key? key}) : super(key: key);
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey[100],
      appBar: AppBar(
        backgroundColor: Colors.blue,
        elevation: 0,
        title: Row(
          children: [
            CircleAvatar(radius: 20, backgroundColor: Colors.white),
            SizedBox(width: 12),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(studentName, style: TextStyle(fontSize: 14)),
                Text(
                  'Khoa CNTT • Sinh viên Quốc tế',
                  style: TextStyle(fontSize: 12),
                ),
              ],
            ),
            Spacer(),
            Icon(Icons.notifications, color: Colors.white),
          ],
        ),
        toolbarHeight: 70,
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(16),
          child: Column(
            children: [
              // Visa status
              Container(
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Tình trạng Visa của bạn',
                            style: TextStyle(fontWeight: FontWeight.bold),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Còn 15 ngày',
                            style: TextStyle(
                              color: Colors.orange,
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () {},
                      child: Text('Chi tiết'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blue,
                      ),
                    ),
                    SizedBox(width: 8),
                    OutlinedButton(
                      onPressed: () {},
                      child: Text('Gia hạn ngay'),
                    ),
                  ],
                ),
              ),
              // SizedBox(height: 16),
              // // Quick actions
              // Row(
              //   mainAxisAlignment: MainAxisAlignment.spaceBetween,
              //   children: [
              //     _QuickAction(
              //       icon: Icons.update,
              //       label: 'Gia hạn Visa',
              //       onTap: () {
              //         Navigator.push(
              //           context,
              //           MaterialPageRoute(
              //             builder: (context) => VisaManagePage(),
              //           ),
              //         );
              //       },
              //     ),
              //     _QuickAction(icon: Icons.history, label: 'Lịch sử Visa'),
              //     _QuickAction(icon: Icons.info, label: 'Thông tin Visa'),
              //     _QuickAction(icon: Icons.file_copy, label: 'Tài liệu'),
              //   ],
              // ),
              SizedBox(height: 24),
              // Status timeline
              Container(
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Trạng thái hồ sơ',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 8),
                    _StatusItem(
                      title: 'Đã nộp đơn',
                      date: '15/09/2023 - 13:00',
                      status: 'Hoàn thành',
                    ),
                    _StatusItem(
                      title: 'Đang xử lý tại khoa',
                      date: '16/09/2023',
                      status: 'Đang xử lý',
                    ),
                    _StatusItem(
                      title: 'Chuyển đến Phòng HTQT',
                      date: 'Dự kiến: 18/09/2023',
                    ),
                    _StatusItem(
                      title: 'Gửi công văn NAS',
                      date: 'Dự kiến: 20/09/2023',
                    ),
                    _StatusItem(
                      title: 'Hoàn thành',
                      date: 'Dự kiến: 25/09/2023',
                    ),
                  ],
                ),
              ),
              SizedBox(height: 24),
              // Support
              Container(
                padding: EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(16),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Hỗ trợ',
                      style: TextStyle(fontWeight: FontWeight.bold),
                    ),
                    SizedBox(height: 8),
                    _SupportItem(
                      name: 'Nguyễn Văn A',
                      role: 'Cán bộ hỗ trợ sinh viên quốc tế - Khoa CNTT',
                    ),
                    _SupportItem(
                      name: 'Trần Thị B',
                      role: 'Phòng HTQT - Quốc tế',
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
      // bottomNavigationBar: BottomNavigationBar(
      //   items: [
      //     BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Trang chủ'),
      //     BottomNavigationBarItem(icon: Icon(Icons.folder), label: 'Hồ sơ'),
      //     BottomNavigationBarItem(icon: Icon(Icons.credit_card), label: 'Visa'),
      //     BottomNavigationBarItem(icon: Icon(Icons.person), label: 'Tài khoản'),
      //   ],
      //   currentIndex: 0,
      //   onTap: (i) {},
      // ),
      bottomNavigationBar: Builder(
        builder: (context) => BottomNavigationBar(
          items: [
            BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Trang chủ'),
            BottomNavigationBarItem(
              icon: Icon(Icons.credit_card),
              label: 'Visa',
            ),
            BottomNavigationBarItem(
              icon: Icon(Icons.person),
              label: 'Tài khoản',
            ),
          ],
          currentIndex: 0,
          selectedItemColor: Color(0xFF3383CD),
          onTap: (i) {
            if (i == 2) {
              Scaffold.of(context).openDrawer();
            }
            // Xử lý chuyển tab khác nếu cần
          },
        ),
      ),
    );
  }
}

class _QuickAction extends StatelessWidget {
  final IconData icon;
  final String label;
  final VoidCallback? onTap;
  const _QuickAction({required this.icon, required this.label, this.onTap});
  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          CircleAvatar(
            backgroundColor: Colors.blue.shade50,
            child: Icon(icon, color: Colors.blue),
          ),
          SizedBox(height: 8),
          Text(label, style: TextStyle(fontSize: 12)),
        ],
      ),
    );
  }
}

class _StatusItem extends StatelessWidget {
  final String title;
  final String date;
  final String? status;
  const _StatusItem({required this.title, required this.date, this.status});
  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      title: Text(title, style: TextStyle(fontWeight: FontWeight.bold)),
      subtitle: Text(date),
      trailing: status != null
          ? Text(status!, style: TextStyle(color: Colors.green))
          : null,
    );
  }
}

class _SupportItem extends StatelessWidget {
  final String name;
  final String role;
  const _SupportItem({required this.name, required this.role});
  @override
  Widget build(BuildContext context) {
    return ListTile(
      contentPadding: EdgeInsets.zero,
      leading: CircleAvatar(child: Icon(Icons.person)),
      title: Text(name, style: TextStyle(fontWeight: FontWeight.bold)),
      subtitle: Text(role),
      trailing: Row(
        mainAxisSize: MainAxisSize.min,
        children: [
          Icon(Icons.phone, color: Colors.blue),
          SizedBox(width: 8),
          Icon(Icons.chat, color: Colors.green),
        ],
      ),
    );
  }
}
