import 'package:flutter/material.dart';
import 'package:flutter_mobile/src/ui/screens/login_page.dart';

class HomeGuestPage extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: Drawer(
        child: Column(
          children: [
            // Header
            Container(
              width: double.infinity,
              padding: EdgeInsets.symmetric(vertical: 32),
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF3383CD), Color(0xFF11249F)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
              ),
              child: Column(
                children: [
                  CircleAvatar(
                    radius: 28,
                    backgroundColor: Colors.white,
                    child: Icon(
                      Icons.person,
                      color: Color(0xFF3383CD),
                      size: 32,
                    ),
                  ),
                  SizedBox(height: 8),
                  Text(
                    'Khách',
                    style: TextStyle(
                      color: Colors.white,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                  Align(
                    alignment: Alignment.topRight,
                    child: IconButton(
                      icon: Icon(Icons.close, color: Colors.white),
                      onPressed: () => Navigator.of(context).pop(),
                    ),
                  ),
                ],
              ),
            ),
            // Menu items
            ListTile(
              leading: Icon(Icons.home, color: Color(0xFF3383CD)),
              title: Text('Trang chủ'),
              onTap: () {},
            ),
            ListTile(
              leading: Icon(Icons.search, color: Color(0xFF3383CD)),
              title: Text('Tra cứu MOU'),
              onTap: () {},
            ),
            ListTile(
              leading: Icon(Icons.bookmark, color: Color(0xFF3383CD)),
              title: Text('MOU đã lưu'),
              onTap: () {},
            ),
            Divider(),
            ListTile(
              leading: Icon(Icons.info, color: Color(0xFF3383CD)),
              title: Text('Giới thiệu'),
              onTap: () {},
            ),
            ListTile(
              leading: Icon(Icons.help, color: Color(0xFF3383CD)),
              title: Text('Hướng dẫn sử dụng'),
              onTap: () {},
            ),
            ListTile(
              leading: Icon(Icons.phone, color: Color(0xFF3383CD)),
              title: Text('Liên hệ'),
              onTap: () {},
            ),
            Divider(),
            ListTile(
              leading: Icon(Icons.settings, color: Color(0xFF3383CD)),
              title: Text('Cài đặt'),
              onTap: () {},
            ),
            Spacer(),
            Padding(
              padding: EdgeInsets.all(16),
              child: ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Color(0xFF3383CD),
                  minimumSize: Size(double.infinity, 48),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(24),
                  ),
                ),
                icon: Icon(Icons.login, color: Colors.white),
                label: Text('Đăng nhập', style: TextStyle(color: Colors.white)),
                onPressed: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(builder: (context) => LoginScreen()),
                  );
                },
              ),
            ),
          ],
        ),
      ),

      backgroundColor: Colors.white,
      body: Column(
        children: [
          // Header
          Container(
            width: double.infinity,
            padding: EdgeInsets.only(top: 40, left: 24, right: 24, bottom: 24),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [Color(0xFF3383CD), Color(0xFF11249F)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.only(
                bottomLeft: Radius.circular(32),
                bottomRight: Radius.circular(32),
              ),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.center,
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Container(
                      width: 48,
                      height: 48,
                      child: Image.asset(
                        'assets/logodut.jpg',
                      ), // Thay bằng logo của bạn
                    ),
                    SizedBox(width: 16),
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        // Text(
                        //   'Đại học',
                        //   style: TextStyle(
                        //     color: Colors.white,
                        //     fontWeight: FontWeight.bold,
                        //     fontSize: 18,
                        //   ),
                        // ),
                        Text(
                          'Đại học Bách khoa Đà Nẵng',
                          style: TextStyle(
                            color: Colors.white,
                            fontWeight: FontWeight.bold,
                            fontSize: 22,
                          ),
                        ),
                        Text(
                          'Hệ thống tra cứu thỏa thuận hợp tác',
                          style: TextStyle(color: Colors.white, fontSize: 14),
                        ),
                      ],
                    ),
                  ],
                ),
                SizedBox(height: 24),
                Container(
                  width: double.infinity,
                  constraints: BoxConstraints(maxWidth: 400),
                  padding: EdgeInsets.symmetric(horizontal: 16),
                  decoration: BoxDecoration(
                    color: Colors.white,
                    borderRadius: BorderRadius.circular(32),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black12,
                        blurRadius: 8,
                        offset: Offset(0, 2),
                      ),
                    ],
                  ),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          decoration: InputDecoration(
                            hintText: 'Tìm kiếm đối tác, lĩnh vực hợp tác...',
                            border: InputBorder.none,
                          ),
                        ),
                      ),
                      Icon(Icons.search, color: Color(0xFF3383CD)),
                    ],
                  ),
                ),
              ],
            ),
          ),
          // Filter
          SizedBox(height: 16),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            padding: EdgeInsets.symmetric(horizontal: 16),
            child: Row(
              children: [
                FilterChip(
                  label: Text(
                    'Tất cả',
                    style: TextStyle(color: true ? Colors.white : Colors.black),
                  ),
                  selected: true,
                  selectedColor: Color(0xFF3383CD),
                  onSelected: (_) {},
                ),
                SizedBox(width: 8),
                FilterChip(
                  label: Text(
                    'Giáo dục',
                    style: TextStyle(
                      color: false ? Colors.white : Colors.black,
                    ),
                  ),
                  selected: false,
                  selectedColor: Color(0xFF3383CD),
                  onSelected: (_) {},
                ),
                SizedBox(width: 8),
                FilterChip(
                  label: Text(
                    'Công nghệ',
                    style: TextStyle(
                      color: false ? Colors.white : Colors.black,
                    ),
                  ),
                  selected: false,
                  selectedColor: Color(0xFF3383CD),
                  onSelected: (_) {},
                ),
                SizedBox(width: 8),
                FilterChip(
                  label: Text(
                    'Điện tử',
                    style: TextStyle(
                      color: false ? Colors.white : Colors.black,
                    ),
                  ),
                  selected: false,
                  selectedColor: Color(0xFF3383CD),
                  onSelected: (_) {},
                ),
              ],
            ),
          ),
          // Kết quả
          SizedBox(height: 16),
          Expanded(
            child: ListView(
              padding: EdgeInsets.symmetric(horizontal: 16),
              children: [
                _ResultCard(
                  title: 'Đại học Quốc tế ABC',
                  date: '15/08/2023',
                  field: 'Giáo dục, Trao đổi sinh viên',
                  status: 'Đang hiệu lực',
                ),
                _ResultCard(
                  title: 'Tập đoàn Công nghệ XYZ',
                  date: '22/07/2023',
                  field: 'Công nghệ thông tin, Nghiên cứu',
                  status: 'Đang hiệu lực',
                ),
                _ResultCard(
                  title: 'Bệnh viện Đa khoa MED',
                  date: '10/06/2023',
                  field: 'Y tế, Thực tập sinh',
                  status: 'Đang hiệu lực',
                ),
                _ResultCard(
                  title: 'Tập đoàn Công nghệ XYZ',
                  date: '22/07/2023',
                  field: 'Công nghệ thông tin, Nghiên cứu',
                  status: 'Đang hiệu lực',
                ),
              ],
            ),
          ),
        ],
      ),
      bottomNavigationBar: Builder(
        builder: (context) => BottomNavigationBar(
          items: [
            BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Tra cứu'),
            BottomNavigationBarItem(
              icon: Icon(Icons.bookmark),
              label: 'Đã lưu',
            ),
            BottomNavigationBarItem(icon: Icon(Icons.menu), label: 'Menu'),
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

class _ResultCard extends StatelessWidget {
  final String title;
  final String date;
  final String field;
  final String status;
  const _ResultCard({
    required this.title,
    required this.date,
    required this.field,
    required this.status,
  });
  @override
  Widget build(BuildContext context) {
    return Card(
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
      margin: EdgeInsets.only(bottom: 16),
      child: Padding(
        padding: EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Icon(Icons.school, color: Color(0xFF3383CD)),
                SizedBox(width: 8),
                Expanded(
                  child: Text(
                    title,
                    style: TextStyle(
                      fontWeight: FontWeight.bold,
                      fontSize: 16,
                      color: Color(0xFF3383CD),
                    ),
                  ),
                ),
                IconButton(
                  icon: Icon(Icons.bookmark_border, color: Color(0xFF3383CD)),
                  onPressed: () {
                    // TODO: Xử lý lưu kết quả
                  },
                  tooltip: 'Lưu',
                ),
              ],
            ),
            SizedBox(height: 8),
            Text('Ngày ký: $date'),
            Text('Lĩnh vực: $field'),
            SizedBox(height: 8),
            Row(
              children: [
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 12, vertical: 4),
                  decoration: BoxDecoration(
                    color: Color(0xFFE3F2FD),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Text(
                    status,
                    style: TextStyle(color: Color(0xFF3383CD)),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
}

//     );
//     // TODO: implement build
//     throw UnimplementedError();
//   }
// }
